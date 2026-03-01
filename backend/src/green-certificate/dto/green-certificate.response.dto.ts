import { Expose } from 'class-transformer';

export class GreenCertificateResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string | null;

  @Expose()
  description: string | null;
}
