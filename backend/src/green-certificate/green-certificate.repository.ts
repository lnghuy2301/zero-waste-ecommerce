import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GreenCertificateRequestDto } from './dto/green-certificate.request.dto';
import { GreenCertificateResponseDto } from './dto/green-certificate.response.dto';
import { DeleteListGreenCertificateDto } from './dto/delete-list-green-certificate.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GreenCertificateRepository {
  constructor(private prismaService: PrismaService) {}

  async createGreenCertificate(
    data: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    const created = await this.prismaService.greenCertificate.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });
    return plainToInstance(GreenCertificateResponseDto, created);
  }

  async updateGreenCertificate(
    id: number,
    data: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    const updated = await this.prismaService.greenCertificate.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
      },
    });
    return plainToInstance(GreenCertificateResponseDto, updated);
  }

  async getGreenCertificateById(
    id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    const cert = await this.prismaService.greenCertificate.findUnique({
      where: { id },
    });
    return cert ? plainToInstance(GreenCertificateResponseDto, cert) : null;
  }

  async getAllGreenCertificates(): Promise<GreenCertificateResponseDto[]> {
    const certs = await this.prismaService.greenCertificate.findMany();
    return plainToInstance(GreenCertificateResponseDto, certs);
  }

  async deleteGreenCertificate(
    id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    const deleted = await this.prismaService.greenCertificate.delete({
      where: { id },
    });
    return plainToInstance(GreenCertificateResponseDto, deleted);
  }

  async deleteListGreenCertificates(
    dto: DeleteListGreenCertificateDto,
  ): Promise<{ count: number }> {
    return this.prismaService.greenCertificate.deleteMany({
      where: { id: { in: dto.Ids } },
    });
  }
}
