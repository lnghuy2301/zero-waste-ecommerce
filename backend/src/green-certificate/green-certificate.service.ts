import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GreenCertificateRepository } from './green-certificate.repository';
import { GreenCertificateHelper } from './green-certificate.helper';
import { GreenCertificateRequestDto } from './dto/green-certificate.request.dto';
import { GreenCertificateResponseDto } from './dto/green-certificate.response.dto';
import { DeleteListGreenCertificateDto } from './dto/list-green-certificate-delete.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class GreenCertificateService {
  constructor(
    private greenCertificateRepository: GreenCertificateRepository,
    private greenCertificateHelper: GreenCertificateHelper,
    private accountHelper: AccountHelper,
  ) {}

  async createGreenCertificate(
    dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    try {
      return await this.greenCertificateRepository.createGreenCertificate(dto);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async updateGreenCertificate(
    id: number,
    dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    try {
      await this.greenCertificateHelper.checkGreenCertificate(id);
      return await this.greenCertificateRepository.updateGreenCertificate(
        id,
        dto,
      );
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getGreenCertificateById(
    id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    try {
      const cert =
        await this.greenCertificateRepository.getGreenCertificateById(id);
      if (!cert) {
        throw new NotFoundException('Chứng nhận xanh không tồn tại');
      }
      return cert;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async getAllGreenCertificates(): Promise<GreenCertificateResponseDto[]> {
    try {
      const certs =
        await this.greenCertificateRepository.getAllGreenCertificates();
      if (certs.length === 0) {
        throw new BadRequestException('Không có chứng nhận xanh nào tồn tại');
      }
      return certs;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteGreenCertificate(
    id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    try {
      await this.greenCertificateHelper.checkGreenCertificate(id);
      return await this.greenCertificateRepository.deleteGreenCertificate(id);
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }

  async deleteListGreenCertificates(
    dto: DeleteListGreenCertificateDto,
  ): Promise<{ count: number }> {
    try {
      const result =
        await this.greenCertificateRepository.deleteListGreenCertificates(dto);
      if (result.count === 0) {
        throw new NotFoundException(
          'Không tìm thấy chứng nhận xanh nào để xóa',
        );
      }
      return result;
    } catch (error) {
      this.accountHelper.handleError(error);
    }
  }
}
