import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: number) {
    return this.prisma.employee.findUnique({ where: { id: userId } });
  }

  async updateProfile(userId: number, data: Partial<{ photoUrl: string; phone: string; password: string; deviceToken?: string }>) {
    const updateData: any = {};
    if (data.photoUrl) updateData.photoUrl = data.photoUrl;
    if (data.phone) updateData.phone = data.phone;
    if (data.deviceToken) updateData.deviceToken = data.deviceToken;
    if (data.password) {
      const bcrypt = require('bcrypt');
      updateData.passwordHash = bcrypt.hashSync(data.password, 10);
    }
    return this.prisma.employee.update({ where: { id: userId }, data: updateData });
  }

  async getAdminUser() {
    return this.prisma.employee.findFirst({ where: { role: 'admin' } });
  }
}
