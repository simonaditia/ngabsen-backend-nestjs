import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async addEmployee(data: { name: string; email: string; password: string; position: string; phone?: string; role?: string }) {
    const bcrypt = require('bcrypt');
    return this.prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: bcrypt.hashSync(data.password, 10),
        position: data.position,
        phone: data.phone,
        role: data.role ?? 'staff',
      },
    });
  }

  async updateEmployee(id: number, data: Partial<{ name: string; email: string; position: string; phone: string; password: string }>) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.position) updateData.position = data.position;
    if (data.phone) updateData.phone = data.phone;
    if (data.password) {
      const bcrypt = require('bcrypt');
      updateData.passwordHash = bcrypt.hashSync(data.password, 10);
    }
    return this.prisma.employee.update({ where: { id }, data: updateData });
  }

  async getAttendance(employeeId?: number, start?: string, end?: string) {
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (start && end) {
      where.date = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }
    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'asc' },
      include: { employee: true },
    });
  }
}
