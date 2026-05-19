import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { DataStore } from '../common/data.store';
@Controller('favorites') @UseGuards(AuthGuard)
export class FavoritesController { constructor(private ds:DataStore){}
 @Get() list(@Req() req:any){ return this.ds.favorites.filter(f=>f.userId===req.user.id); }
 @Post(':productId') add(@Req() req:any,@Param('productId') productId:string){ const f={id:`f${Date.now()}`,userId:req.user.id,productId}; this.ds.favorites.push(f); return f; }
 @Delete(':productId') del(@Req() req:any,@Param('productId') productId:string){ this.ds.favorites=this.ds.favorites.filter(f=>!(f.userId===req.user.id&&f.productId===productId)); return {ok:true}; }
}
