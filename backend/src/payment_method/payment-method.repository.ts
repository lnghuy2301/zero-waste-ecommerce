import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentMethodRequestDto } from './dto/payment-method.request.dto';
import { PaymentMethodResponseDto } from './dto/payment-method.response.dto';
import { DeleteListPaymentMethodDto } from './dto/delete-list-payment-method.dto';

@Injectable()
export class PaymentMethodRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: PaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.prisma.paymentMethod.create({
      data: {
        name: dto.name,
        code: dto.code,
        isActive: dto.isActive,
      },
    });
  }

  async update(
    id: number,
    dto: PaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        isActive: dto.isActive,
      },
    });
  }

  async getById(id: number): Promise<PaymentMethodResponseDto | null> {
    return this.prisma.paymentMethod.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<PaymentMethodResponseDto[]> {
    return this.prisma.paymentMethod.findMany();
  }

  async delete(id: number): Promise<PaymentMethodResponseDto> {
    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }

  async deleteList(
    dto: DeleteListPaymentMethodDto,
  ): Promise<{ count: number }> {
    const result = await this.prisma.paymentMethod.deleteMany({
      where: { id: { in: dto.Ids } },
    });
    return { count: result.count };
  }
}
