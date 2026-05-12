import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { DataStore } from '../common/data.store';
@Module({ controllers: [ProductsController], providers: [DataStore] })
export class ProductsModule {}
