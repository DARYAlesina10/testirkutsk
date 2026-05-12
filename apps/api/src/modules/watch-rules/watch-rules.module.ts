import { Module } from '@nestjs/common';
import { WatchRulesController } from './watch-rules.controller';
import { DataStore } from '../common/data.store';
@Module({ controllers:[WatchRulesController], providers:[DataStore] })
export class WatchRulesModule {}
