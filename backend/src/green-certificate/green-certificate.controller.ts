import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GreenCertificateService } from './green-certificate.service';
import { GreenCertificateRequestDto } from './dto/green-certificate.request.dto';
import { GreenCertificateResponseDto } from './dto/green-certificate.response.dto';
import { DeleteListGreenCertificateDto } from './dto/list-green-certificate-delete.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@Controller('green-certificate')
export class GreenCertificateController {
  constructor(
    private readonly greenCertificateService: GreenCertificateService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGreenCertificate(
    @Body() dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    return this.greenCertificateService.createGreenCertificate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateGreenCertificate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    return this.greenCertificateService.updateGreenCertificate(id, dto);
  }

  @Get(':id')
  async getGreenCertificateById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    return this.greenCertificateService.getGreenCertificateById(id);
  }

  @Get()
  async getAllGreenCertificates(): Promise<GreenCertificateResponseDto[]> {
    return this.greenCertificateService.getAllGreenCertificates();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteGreenCertificate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    return this.greenCertificateService.deleteGreenCertificate(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteListGreenCertificates(
    @Body() dto: DeleteListGreenCertificateDto,
  ): Promise<{ count: number }> {
    return this.greenCertificateService.deleteListGreenCertificates(dto);
  }
}
