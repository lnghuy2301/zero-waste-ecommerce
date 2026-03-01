import { IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class GreenCertificateRequestDto {
  @IsNotEmpty({ message: 'Tên chứng nhận không được bỏ trống' })
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
