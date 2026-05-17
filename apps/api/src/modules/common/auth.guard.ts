import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.headers['x-user-id'];
    const role = req.headers['x-user-role'] ?? 'USER';
    if (!userId) throw new UnauthorizedException('Missing x-user-id');
    req.user = { id: String(userId), role: String(role) };
    return true;
  }
}
