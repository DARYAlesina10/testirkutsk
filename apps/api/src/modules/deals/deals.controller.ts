import { Controller, Get, Param } from '@nestjs/common';
import { DataStore } from '../common/data.store';
import { DealScoreService } from './deal-score.service';
@Controller('deals')
export class DealsController { constructor(private ds:DataStore, private sc:DealScoreService){}
 @Get() all(){ return this.ds.products.map(p=> ({...p, deal:this.sc.calc(p.currentPrice,p.oldPrice,this.ds.priceHistory.filter(h=>h.productId===p.id).map(h=>h.price))})); }
 @Get('top') top(){ return this.all().sort((a,b)=>b.deal.score-a.deal.score).slice(0,10); }
 @Get('daily') daily(){ return this.top(); }
 @Get('category/:slug') byCategory(@Param('slug') slug:string){const c=this.ds.categories.find(x=>x.slug===slug); return this.all().filter(p=>p.categoryId===c?.id);} }
