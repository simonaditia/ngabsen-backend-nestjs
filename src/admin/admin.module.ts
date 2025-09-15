import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from './prisma.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, NotificationService],
})
export class AdminModule {}
