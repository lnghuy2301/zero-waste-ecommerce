import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || '8f4c2e9a7b1d5f3e6c8a0b2d4f7e9a1c3b5d7f9e0a2c4b6d8f1e3a5c7b9d0e2f',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
