import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async clockIn(userId: number) {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Cek apakah sudah clock-in hari ini
    const existing = await this.prisma.attendance.findFirst({
      where: { employeeId: userId, date: dateOnly },
    });
    if (existing && existing.clockIn) {
      return { error: 'Already clocked in today' };
    }
    if (existing) {
      // Sudah ada record, update clockIn
      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: { clockIn: today, status: 'present' },
      });
    }
    // Belum ada record, buat baru
    return this.prisma.attendance.create({
      data: {
        employeeId: userId,
        date: dateOnly,
        clockIn: today,
        status: 'present',
      },
    });
  }

  async clockOut(userId: number) {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const attendance = await this.prisma.attendance.findFirst({
      where: { employeeId: userId, date: dateOnly },
    });
    if (!attendance || !attendance.clockIn) {
      return { error: 'Clock-in required before clock-out' };
    }
    if (attendance.clockOut) {
      return { error: 'Already clocked out today' };
    }
    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: today },
    });
  }

  async getSummary(userId: number, start?: string, end?: string) {
    const where: any = { employeeId: userId };
    if (start && end) {
      where.date = {
        gte: new Date(start),
        lte: new Date(end),
      };
    } else {
      // Default: bulan ini
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      where.date = {
        gte: firstDay,
        lte: lastDay,
      };
    }
    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }
}
