import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from './prisma.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, NotificationService],
})
export class EmployeeModule {}
