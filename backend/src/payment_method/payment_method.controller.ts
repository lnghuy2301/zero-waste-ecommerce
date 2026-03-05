import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import {PaymentMethodService} from "./payment.method.service";
import {Payment_methodRequestDto} from "./dto/payment_method.request.dto";
import {PaymentMethodModule} from "./payment_method.module";
import {Payment_methodResponseDto} from "./dto/payment_method.response.dto";
import {List_payment_methodRequestDto} from "./dto/list_payment_method.request.dto";

@Controller('payment_method')
export class PaymentMethodController {
    constructor(private readonly paymentService: PaymentMethodService) {}

    @Post()
    async createPaymentMethod(@Body() payment: Payment_methodRequestDto): Promise<PaymentMethodModule> {
        return this.paymentService.createPayment(payment);
    }

    @Put(':id/payment_method')
    async updatePaymentMethod(@Param('id', ParseIntPipe) id: number, @Body() payment: Payment_methodRequestDto): Promise<PaymentMethodModule> {
        return this.paymentService.updatePayment(id, payment);
    }

    @Get(':id/payment_method')
    async getPaymentMethodById(@Param('id', ParseIntPipe) id: number): Promise<PaymentMethodModule | null> {
        return this.paymentService.getPaymentMethod(id);
    }

    @Get()
    async getAllPaymentMethods(): Promise<PaymentMethodModule[]> {
        return this.paymentService.getAllPaymentMethod();
    }

    @Delete(':id/payment_method')
    async deletePaymentMethodById(@Param('id', ParseIntPipe) id: number): Promise<Payment_methodResponseDto | null> {
        return this.paymentService.deletePayment(id);
    }

    @Delete()
    async deleteListPaymentMethod(@Body() payment: List_payment_methodRequestDto): Promise<{count: number}> {
        return this.paymentService.deleteListPaymentMethod(payment);
    }
}