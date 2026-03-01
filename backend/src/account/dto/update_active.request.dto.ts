import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateActiveRequestDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
