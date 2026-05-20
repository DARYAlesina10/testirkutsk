import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { DataStore } from '../common/data.store';
@Module({ controllers:[FavoritesController], providers:[DataStore] })
export class FavoritesModule {}
