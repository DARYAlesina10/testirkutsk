import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { PrismaService } from '../common/prisma.service';
class CategoryDto { @IsString() name!: string; @IsString() slug!: string; }
@Controller('categories')
export class CategoriesController { constructor(private prisma: PrismaService){}
  @Get() list(){return this.prisma.category.findMany({ orderBy: { createdAt: 'desc' } });}
  @Get(':slug') one(@Param('slug') slug:string){return this.prisma.category.findUnique({ where: { slug } });}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Post() create(@Body() body:CategoryDto){return this.prisma.category.create({ data: body });}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Patch(':id') patch(@Param('id') id:string,@Body() body:Partial<CategoryDto>){return this.prisma.category.update({ where: { id }, data: body });}
  @UseGuards(AuthGuard,RolesGuard) @Roles('ADMIN') @Delete(':id') del(@Param('id') id:string){return this.prisma.category.delete({ where: { id } });}
}
