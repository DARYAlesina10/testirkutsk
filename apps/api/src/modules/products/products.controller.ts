import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { PrismaService } from '../common/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProductsAutofillService } from './products-autofill.service';

class ProductDto { @IsString() title!: string; @IsString() slug!: string; @IsString() categoryId!: string; @IsNumber() currentPrice!: number; @IsOptional() @IsNumber() oldPrice?: number; @IsOptional() @IsString() marketUrl?: string; @IsOptional() @IsString() marketArticle?: string; }

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService, private autofill: ProductsAutofillService, @InjectQueue('partner-article') private readonly partnerArticleQueue: Queue) {}
  @Get() list(@Query('categorySlug') categorySlug?: string, @Query('limit') limit?: string) {
    return this.prisma.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : undefined,
      take: limit ? Math.min(Number(limit) || 50, 200) : 50,
      orderBy: { createdAt: 'desc' }
    });
  }
  @Get(':id') one(@Param('id') id: string) { return this.prisma.product.findUnique({ where: { id } }); }
  @Get('slug/:slug') bySlug(@Param('slug') slug: string) { return this.prisma.product.findUnique({ where: { slug } }); }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post() async create(@Body() body: ProductDto) {
    const p = await this.prisma.product.create({ data: { ...body, oldPrice: body.oldPrice ?? body.currentPrice, marketUrl: body.marketUrl ?? null, imageUrl: null, partnerArticle: null } });
    await this.partnerArticleQueue.add('CreatePartnerArticleJob', { productId: p.id, marketArticle: body.marketArticle, marketUrl: body.marketUrl, source: 'admin' });
    return p;
  }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Patch(':id') patch(@Param('id') id:string,@Body() body: Partial<ProductDto>){return this.prisma.product.update({ where: { id }, data: body });}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Delete(':id') remove(@Param('id') id:string){return this.prisma.product.delete({ where: { id } });}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post(':id/check-price') async check(@Param('id') id:string){const p=await this.prisma.product.findUnique({ where: { id } }); return {productId:id,currentPrice:p?.currentPrice,checked:!!p};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post(':id/create-partner-article') async createPartner(@Param('id') id:string){const p=await this.prisma.product.findUnique({ where: { id } }); await this.partnerArticleQueue.add('CreatePartnerArticleJob',{productId:id,marketArticle:undefined,marketUrl:p?.marketUrl || undefined,source:'admin'}); return {queued:true};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post('import') async importMock(@Body() body:{items:ProductDto[]}){ for (const item of body.items||[]){ const p=await this.prisma.product.create({ data: { ...item, oldPrice: item.oldPrice ?? item.currentPrice, marketUrl: item.marketUrl ?? null, imageUrl: null, partnerArticle: null } }); await this.partnerArticleQueue.add('CreatePartnerArticleJob',{productId:p.id,marketArticle:item.marketArticle,marketUrl:item.marketUrl,source:'import'});} return {imported:(body.items||[]).length}; }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post('autofill') autofillFromQueries(@Body() body:{queries:string[];categorySlug?:string}){ return this.autofill.importFromQueries(body); }
}
