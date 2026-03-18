import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || '876021013983-6sdt8v330dtc2sh57433rgk19orb80ee.apps.googleusercontent.com',         // Lấy từ Google Cloud Console
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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', // Lấy từ Google Cloud Console
            callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        // Bóc tách dữ liệu Google trả về
        const user = {
            email: emails[0].value,
            fullName: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}