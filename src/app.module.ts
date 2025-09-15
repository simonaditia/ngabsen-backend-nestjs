import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [AuthModule, EmployeeModule, AttendanceModule, AdminModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
