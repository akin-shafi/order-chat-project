/* eslint-disable prettier/prettier */
// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // console.log('Payload received:', payload);
    if (!payload.sub || !payload.email || !payload.role) {
      console.error('Invalid token payload');
      throw new Error('Invalid token payload');
    }
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
  
}

