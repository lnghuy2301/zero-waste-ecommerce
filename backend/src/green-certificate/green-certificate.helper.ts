import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GreenCertificateResponseDto } from './dto/green-certificate.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GreenCertificateHelper {
  constructor(private prismaService: PrismaService) {}

  async checkGreenCertificate(
    id: number,
  ): Promise<GreenCertificateResponseDto> {
    const cert = await this.prismaService.greenCertificate.findUnique({
      where: { id },
    });

    if (!cert) {
      throw new NotFoundException('Chứng nhận xanh không tồn tại');
    }

    return plainToInstance(GreenCertificateResponseDto, cert);
  }
}
