import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const role = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];
    if (!userId) throw new UnauthorizedException('Missing user context');
    if (role !== 'ADMIN') throw new ForbiddenException('Admin only');
    return true;
  }
}
