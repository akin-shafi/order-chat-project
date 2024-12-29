/* eslint-disable prettier/prettier */
// jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    // console.log('Authorization Header..:', authorizationHeader); // Log header details

    if (!authorizationHeader) {
      console.error('No Authorization header found');
      return false;
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      console.error('No token found in the Authorization header');
      return false;
    }
    return super.canActivate(context);
  }
}




