import {Module} from "@nestjs/common";
import {AccountController} from "./account.controller";
import {AccountService} from "./account.service";
import {AccountRepository} from "./account.repository";
import {PrismaService} from "../../prisma/prisma.service";
import {AccountHelper} from "./account.helper";

@Module({
    controllers: [AccountController],
    providers: [AccountService, AccountRepository, AccountHelper, PrismaService],
    exports: [AccountService,AccountRepository, AccountHelper, PrismaService],
})

export class AccountModule {}