import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {Payment_methodRequestDto} from "./dto/payment_method.request.dto";
import {Payment_methodResponseDto} from "./dto/payment_method.response.dto";
import {List_payment_methodRequestDto} from "./dto/list_payment_method.request.dto";

@Injectable()
export class PaymentMethodRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async createPayment(payment: Payment_methodRequestDto): Promise<Payment_methodResponseDto> {
        return this.prismaService.paymentMethod.create({
            data: {
                name: payment.name,
                code: payment.code,
                isActive: payment.isActive,
            },
        });
    }

    async updatePayment(id: number, payment: Payment_methodRequestDto): Promise<Payment_methodResponseDto> {
        return this.prismaService.paymentMethod.update({
            where: {
                id: id,
            },
            data: {
                name: payment.name,
                code: payment.code,
                isActive: payment.isActive,
            },
        });
    }

    async getPaymentById(id: number): Promise<Payment_methodResponseDto | null> {
        return this.prismaService.paymentMethod.findUnique({
            where: {
                id: id,
            }
        });
    }

    async getAllPayment(): Promise<Payment_methodResponseDto[]> {
        return this.prismaService.paymentMethod.findMany({});
    }

    async deletePayment(id: number): Promise<Payment_methodResponseDto> {
        return this.prismaService.paymentMethod.delete({
            where: {
                id: id,
            },
        });
    }

    async List_Payment_methods(payment: List_payment_methodRequestDto): Promise<{count: number}> {
        return this.prismaService.paymentMethod.deleteMany({
            where: {
                id: {
                    in: payment.Ids,
                }
            }
        });
    }
}
