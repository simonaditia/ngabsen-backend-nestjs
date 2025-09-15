import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('jwt'), AdminGuard())
  @Post('employees')
  async addEmployee(@Body() body: any, @Request() req) {
    // TODO: Validasi dan role check jika perlu
    return this.adminService.addEmployee(body);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard())
  @Post('employees/update')
  async updateEmployee(@Body() body: { id: number; data: any }, @Request() req) {
    // TODO: Validasi dan role check jika perlu
    return this.adminService.updateEmployee(body.id, body.data);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard())
  @Get('attendance')
  async getAttendance(@Query('employee') employee: string, @Query('start') start: string, @Query('end') end: string, @Request() req) {
    const employeeId = employee ? Number(employee) : undefined;
    return this.adminService.getAttendance(employeeId, start, end);
  }
}
