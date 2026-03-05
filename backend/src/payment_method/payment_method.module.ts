import {Module} from "@nestjs/common";
import {PrismaModule} from "../../prisma/prisma.module";
import {PaymentMethodController} from "./payment_method.controller";
import {PaymentMethodHelper} from "./payment_method.helper";
import {PaymentMethodRepository} from "./payment_method.repository";
import {PaymentMethodService} from "./payment.method.service";
import {PrismaService} from "../../prisma/prisma.service";

@Module({
    imports: [PrismaModule],
    controllers: [PaymentMethodController],
    providers: [PaymentMethodHelper, PaymentMethodRepository, PaymentMethodService, PrismaService],
    exports: [PaymentMethodHelper, PaymentMethodRepository, PaymentMethodService, PrismaService],
})

export class PaymentMethodModule {}