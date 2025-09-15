import { Controller, Post, Get, Body, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('clock-in')
  async clockIn(@Request() req) {
    const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.attendanceService.clockIn(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('clock-out')
  async clockOut(@Request() req) {
    const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.attendanceService.clockOut(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('summary')
  async getSummary(@Query('start') start: string, @Query('end') end: string, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.attendanceService.getSummary(userId, start, end);
  }
}
