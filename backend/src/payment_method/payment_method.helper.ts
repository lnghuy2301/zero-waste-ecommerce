import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Payment_methodResponseDto} from "./dto/payment_method.response.dto";
import {Payment_methodRequestDto} from "./dto/payment_method.request.dto";

@Injectable()
export class PaymentMethodHelper {
    constructor(private readonly prismaService: PrismaService) {}

    async checkPaymentMethod(id: number): Promise<Payment_methodResponseDto> {
        const check_payment = await this.prismaService.paymentMethod.findUnique({
            where: {
                id: id,
            }
        });
        if (!check_payment) {
            throw new NotFoundException(`Phương thức thanh toán không tìm thấy`);
        }
        return check_payment;
    }

    async check_code(payment: Payment_methodRequestDto): Promise<Payment_methodResponseDto | null> {
        const checkcode = await this.prismaService.paymentMethod.findFirst({
            where: {
                code: payment.code,
            }
        });
        if(checkcode){
            throw new BadRequestException('Mã phương thức thanh toán đã tồn tại');
        }
        return checkcode;
    }
}