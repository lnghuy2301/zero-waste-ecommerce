import {Module} from "@nestjs/common";
import {AccountController} from "../account/account.controller";
import {AccountService} from "../account/account.service";
import {CustomerProfileService} from "./customer_profile.service";
import {CustomerProfileHelper} from "./customer_profile.helper";
import {CustomerProfileRepository} from "./customer_profile.repository";
import {AccountRepository} from "../account/account.repository";
import {PrismaService} from "../../prisma/prisma.service";
import {AccountHelper} from "../account/account.helper";
import {CustomerProfileController} from "./customer_profile.controller";

@Module({
    controllers: [CustomerProfileController],
    providers: [AccountService, AccountRepository, AccountHelper, PrismaService, CustomerProfileService, CustomerProfileHelper, CustomerProfileRepository],
    exports: [AccountService, AccountRepository, AccountHelper, PrismaService, CustomerProfileService, CustomerProfileHelper, CustomerProfileRepository],
})
export class CustomerProfileModule {}