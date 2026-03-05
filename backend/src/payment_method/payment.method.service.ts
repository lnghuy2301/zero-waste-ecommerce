import {Injectable, NotFoundException} from "@nestjs/common";
import {Payment_methodRequestDto} from "./dto/payment_method.request.dto";
import {Payment_methodResponseDto} from "./dto/payment_method.response.dto";
import {PaymentMethodHelper} from "./payment_method.helper";
import {PaymentMethodRepository} from "./payment_method.repository";
import {List_payment_methodRequestDto} from "./dto/list_payment_method.request.dto";

@Injectable()
export class PaymentMethodService {
    constructor(
        private readonly paymentMethodRespository: PaymentMethodRepository,
        private readonly paymentMethodHelper: PaymentMethodHelper,
        ) {}

    async createPayment(payment: Payment_methodRequestDto): Promise<Payment_methodResponseDto>  {
        await this.paymentMethodHelper.check_code(payment);
        return this.paymentMethodRespository.createPayment(payment);
    }

    async updatePayment(id: number, payment: Payment_methodRequestDto): Promise<Payment_methodResponseDto>  {
        await this.paymentMethodHelper.checkPaymentMethod(id);
        return this.paymentMethodRespository.updatePayment(id, payment);
    }

    async getPaymentMethod(id: number): Promise<Payment_methodResponseDto | null>  {
        await this.paymentMethodHelper.checkPaymentMethod(id);
        return this.paymentMethodRespository.getPaymentById(id);
    }

    async getAllPaymentMethod(): Promise<Payment_methodResponseDto[]>  {
        const payment = await this.paymentMethodRespository.getAllPayment();
        if(payment.length == 0) {
            throw new NotFoundException("Không có phương thức thanh toán nào được tìm thấy.");
        }
        return payment;
    }

    async deletePayment(id: number): Promise<Payment_methodResponseDto> {
        await this.paymentMethodHelper.checkPaymentMethod(id);
        return this.paymentMethodRespository.deletePayment(id);
    }

    async deleteListPaymentMethod(payment: List_payment_methodRequestDto): Promise<{count: number}>  {
        return this.paymentMethodRespository.List_Payment_methods(payment);
    }
}