import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { DataStore } from '../common/data.store';

class ProductDto { @IsString() title!: string; @IsString() slug!: string; @IsString() categoryId!: string; @IsNumber() currentPrice!: number; @IsOptional() @IsNumber() oldPrice?: number; }

@Controller('products')
export class ProductsController {
  constructor(private ds: DataStore) {}
  @Get() list() { return this.ds.products; }
  @Get(':id') one(@Param('id') id: string) { return this.ds.productById(id); }
  @Get('slug/:slug') bySlug(@Param('slug') slug: string) { return this.ds.products.find((x) => x.slug === slug); }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post() create(@Body() body: ProductDto) { const p={ id: `p${Date.now()}`,...body}; this.ds.products.push(p); return p; }
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Patch(':id') patch(@Param('id') id:string,@Body() body: Partial<ProductDto>){const p=this.ds.productById(id); Object.assign(p,body); return p;}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Delete(':id') remove(@Param('id') id:string){this.ds.products=this.ds.products.filter(x=>x.id!==id); return {ok:true};}
  @UseGuards(AuthGuard, RolesGuard) @Roles('ADMIN') @Post(':id/check-price') check(@Param('id') id:string){const p=this.ds.productById(id); return {productId:id,currentPrice:p.currentPrice,checked:true};}
}
