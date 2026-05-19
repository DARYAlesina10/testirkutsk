import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { DataStore } from '../common/data.store';
import { ProductsAutofillService } from './products-autofill.service';
@Module({ controllers: [ProductsController], providers: [DataStore, ProductsAutofillService] })
export class ProductsModule {}
