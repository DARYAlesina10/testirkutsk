import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { DataStore } from '../common/data.store';
@Module({ controllers:[CategoriesController], providers:[DataStore] })
export class CategoriesModule {}
