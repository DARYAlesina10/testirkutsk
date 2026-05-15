import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { DataStore } from '../common/data.store';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

class ProductDto { @IsString() title!: string; @IsString() slug!: string; @IsString() categoryId!: string; @IsNumber() currentPrice!: number; @IsOptional() @IsNumber() oldPrice?: number; @IsOptional() @IsString() marketUrl?: string; @IsOptional() @IsString() marketArticle?: string; }

@Controller('products')
export class ProductsController {
  constructor(private ds: DataStore, @InjectQueue('partner-article') private readonly partnerArticleQueue: Queue) {}
  @Get() list() { return this.ds.products; }
  @Get(':id') one(@Param('id') id: string) { return this.ds.productById(id); }
  @Get('slug/:slug') bySlug(@Param('slug') slug: string) { return this.ds.products.find((x) => x.slug === slug); }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post() async create(@Body() body: ProductDto) {
    const p={ id: `p${Date.now()}`,...body, oldPrice: body.oldPrice ?? body.currentPrice, marketUrl: body.marketUrl ?? "", marketArticle: body.marketArticle ?? null, partnerArticle:null, dealScore:0, active:true }; this.ds.products.push(p);
    await this.partnerArticleQueue.add('CreatePartnerArticleJob', { productId: p.id, marketArticle: body.marketArticle, marketUrl: body.marketUrl, source: 'admin' });
    return p;
  }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Patch(':id') patch(@Param('id') id:string,@Body() body: Partial<ProductDto>){const p=this.ds.productById(id); Object.assign(p,body); return p;}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Delete(':id') remove(@Param('id') id:string){this.ds.products=this.ds.products.filter(x=>x.id!==id); return {ok:true};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post(':id/check-price') check(@Param('id') id:string){const p=this.ds.productById(id); return {productId:id,currentPrice:p.currentPrice,checked:true};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post(':id/create-partner-article') async createPartner(@Param('id') id:string){const p=this.ds.productById(id); await this.partnerArticleQueue.add('CreatePartnerArticleJob',{productId:id,marketArticle:p.marketArticle,marketUrl:p.marketUrl,source:'admin'}); return {queued:true};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post('import') async importMock(@Body() body:{items:ProductDto[]}){ for (const item of body.items||[]){ const p={id:`p${Date.now()}${Math.random()}`,...item, oldPrice: item.oldPrice ?? item.currentPrice, marketUrl: item.marketUrl ?? "", marketArticle: item.marketArticle ?? null, partnerArticle:null, dealScore:0, active:true}; this.ds.products.push(p); await this.partnerArticleQueue.add('CreatePartnerArticleJob',{productId:p.id,marketArticle:item.marketArticle,marketUrl:item.marketUrl,source:'import'});} return {imported:(body.items||[]).length}; }
}
