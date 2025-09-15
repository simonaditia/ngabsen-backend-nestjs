import { Controller, Get, Patch, Body, Request, UseGuards, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeService } from './employee.service';
import { NotificationService } from '../notification/notification.service';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly notificationService: NotificationService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePhoto(@UploadedFile() file: any, @Request() req) {
  const userId = req.user?.userId;
  if (!userId) return { error: 'Unauthorized' };
  // Upload ke Cloudinary
  const photoUrl = await this.notificationService.uploadPhotoToCloudinary(file, userId);
  // Update photoUrl di database
  await this.employeeService.updateProfile(userId, { photoUrl });
  return { photoUrl };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    // Ambil userId dari JWT payload
  const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.employeeService.getProfile(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(@Body() body: any, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    const result = await this.employeeService.updateProfile(userId, body);

    // Ambil deviceToken dan id admin dari database
    const adminUser = await this.employeeService.getAdminUser();
    const deviceToken = adminUser?.deviceToken;
    if (deviceToken && adminUser?.id) {
      await this.notificationService.sendFirebaseNotification(
        'Profile Updated',
        `Employee ${result.name} updated profile`,
        deviceToken,
        adminUser.id // <-- targetId untuk simpan notifikasi
      );
    }

    // Trigger log ke RabbitMQ
    const log = {
      employeeId: userId,
      action: 'profile_update',
      timestamp: new Date(),
      details: body,
    };
    await this.notificationService.sendRabbitLog(log);
    return result;
  }

  // Endpoint untuk admin menyimpan deviceToken FCM
  @UseGuards(AuthGuard('jwt'))
  @Post('device-token')
  async saveDeviceToken(@Body() body: { deviceToken: string }, @Request() req) {
    const userId = req.user?.userId;
    if (!userId) return { error: 'Unauthorized' };
    return this.employeeService.updateProfile(userId, { deviceToken: body.deviceToken });
  }
}
