import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { DataStore } from '../common/data.store';
@Module({ controllers:[NotificationsController], providers:[DataStore] })
export class NotificationsModule {}
