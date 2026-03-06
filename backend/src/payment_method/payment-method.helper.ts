import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodRequestDto } from './dto/payment-method.request.dto';
import { PaymentMethodResponseDto } from './dto/payment-method.response.dto';

@Injectable()
export class PaymentMethodHelper {
  constructor(private prisma: PrismaService) {}

  async checkExists(id: number): Promise<PaymentMethodResponseDto> {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });
    if (!method) {
      throw new NotFoundException('Phương thức thanh toán không tồn tại');
    }
    return method;
  }

  async checkCodeUnique(dto: PaymentMethodRequestDto): Promise<void> {
    const existing = await this.prisma.paymentMethod.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Mã phương thức thanh toán đã tồn tại');
    }
  }
}
