import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { DataStore } from '../common/data.store';
class WatchRuleDto { @IsString() productId!: string; @IsOptional() @IsNumber() targetPrice?: number; @IsOptional() @IsBoolean() active?: boolean; }
@Controller('watch-rules') @UseGuards(AuthGuard)
export class WatchRulesController { constructor(private ds:DataStore){}
 @Get() list(@Req() req:any){ return this.ds.watchRules.filter((w:any)=>w.userId===req.user.id); }
 @Post() add(@Req() req:any,@Body() body:WatchRuleDto){ const w={id:`w${Date.now()}`,userId:req.user.id,...body,active:true}; this.ds.watchRules.push(w); return w; }
 @Patch(':id') patch(@Req() req:any,@Param('id') id:string,@Body() body:Partial<WatchRuleDto>){const w=this.ds.watchRules.find((x:any)=>x.id===id&&x.userId===req.user.id); Object.assign(w,body); return w;}
 @Delete(':id') del(@Req() req:any,@Param('id') id:string){ this.ds.watchRules=this.ds.watchRules.filter((x:any)=>!(x.id===id&&x.userId===req.user.id)); return {ok:true}; }
}
