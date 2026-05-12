import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { DataStore } from '../common/data.store';
class CategoryDto { @IsString() name!: string; @IsString() slug!: string; }
@Controller('categories')
export class CategoriesController { constructor(private ds:DataStore){}
  @Get() list(){return this.ds.categories}
  @Get(':slug') one(@Param('slug') slug:string){return this.ds.categories.find(c=>c.slug===slug)}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Post() create(@Body() body:CategoryDto){const c={id:`c${Date.now()}`,...body}; this.ds.categories.push(c); return c;}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Patch(':id') patch(@Param('id') id:string,@Body() body:Partial<CategoryDto>){const c=this.ds.categories.find(x=>x.id===id); Object.assign(c!,body); return c;}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Delete(':id') del(@Param('id') id:string){this.ds.categories=this.ds.categories.filter(x=>x.id!==id); return {ok:true};}
}
