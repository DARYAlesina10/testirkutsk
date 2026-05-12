import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { AuthGuard } from '../common/auth.guard';
import { DataStore } from '../common/data.store';
class TestDto { @IsString() message!: string; }
@Controller('notifications') @UseGuards(AuthGuard)
export class NotificationsController { constructor(private ds:DataStore){}
 @Get() list(@Req() req:any){ return this.ds.notifications.filter((n:any)=>n.userId===req.user.id); }
 @Patch(':id/read') read(@Req() req:any,@Param('id') id:string){ const n=this.ds.notifications.find((x:any)=>x.id===id&&x.userId===req.user.id); if(n) n.status='READ'; return n; }
 @Post('test') test(@Req() req:any,@Body() body:TestDto){ const n={id:`n${Date.now()}`,userId:req.user.id,message:body.message,status:'SENT'}; this.ds.notifications.push(n); return n; }
}
