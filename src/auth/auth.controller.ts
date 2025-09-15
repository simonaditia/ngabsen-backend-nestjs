import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // TODO: Implement user validation and login
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }
}
