import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private requiredRole: string) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || user.role !== this.requiredRole) {
      throw new ForbiddenException('Forbidden: insufficient role');
    }
    return true;
  }
}

export function AdminGuard() {
  return new RolesGuard('admin');
}
