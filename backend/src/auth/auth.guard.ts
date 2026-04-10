import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

type AccessTokenPayload = { id: number; email: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();

    const header = req.headers.authorization;

    if (!header) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const token = header.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Unauthorized');
      }
      const decoded = this.jwtService.verify<AccessTokenPayload>(token);

      if (decoded?.id == null || decoded.email == null) {
        throw new UnauthorizedException('Unauthorized');
      }

      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
