import { Injectable } from '@nestjs/common';
@Injectable()
export class DealScoreService {
  calc(currentPrice:number, oldPrice:number|undefined, series:number[]){
    if(series.length<3) return { currentPrice, oldPrice, discountPercent:0, minPrice7d:null, minPrice30d:null, minPrice90d:null, avgPrice30d:null, score:0, verdict:'NOT_ENOUGH_DATA' };
    const min = (n:number)=>Math.min(...series.slice(0,n));
    const avg30 = series.slice(0,30).reduce((a,b)=>a+b,0)/Math.min(series.length,30);
    const discountPercent = oldPrice ? Math.round(((oldPrice-currentPrice)/oldPrice)*100) : 0;
    let verdict='WEAK_DISCOUNT'; let score=discountPercent;
    if(currentPrice<=min(30)) { verdict='BEST_PRICE_30D'; score+=25; }
    else if(discountPercent>=20) { verdict='REAL_DISCOUNT'; score+=15; }
    else if(discountPercent<5) { verdict='SUSPICIOUS'; score-=10; }
    return { currentPrice, oldPrice, discountPercent, minPrice7d:min(7), minPrice30d:min(30), minPrice90d:min(90), avgPrice30d:Math.round(avg30), score, verdict };
  }
}
