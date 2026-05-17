import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealScoreService } from './deal-score.service';
import { DataStore } from '../common/data.store';
@Module({ controllers:[DealsController], providers:[DealScoreService,DataStore] })
export class DealsModule {}
