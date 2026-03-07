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
import { DeleteListGreenCertificateDto } from './dto/delete-list-green-certificate.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';
import { RolesGuard } from '../auth/auth.role.guard';
import { Roles } from '../auth/auth.role.decorator';
import { Role } from '@prisma/client';

@Controller('green-certificate')
export class GreenCertificateController {
  constructor(
    private readonly greenCertificateService: GreenCertificateService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    return this.greenCertificateService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GreenCertificateRequestDto,
  ): Promise<GreenCertificateResponseDto> {
    return this.greenCertificateService.update(id, dto);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    return this.greenCertificateService.getById(id);
  }

  @Get()
  async getAll(): Promise<GreenCertificateResponseDto[]> {
    return this.greenCertificateService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GreenCertificateResponseDto | null> {
    return this.greenCertificateService.delete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete()
  async deleteList(
    @Body() dto: DeleteListGreenCertificateDto,
  ): Promise<{ count: number }> {
    return this.greenCertificateService.deleteList(dto);
  }
}
