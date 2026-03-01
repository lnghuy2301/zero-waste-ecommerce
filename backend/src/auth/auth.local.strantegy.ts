import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "./dto/auth.login.dto";

@Injectable()
export class AuthLocalStrantegy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({usernameField: 'email'});
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validate({email, password});
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}