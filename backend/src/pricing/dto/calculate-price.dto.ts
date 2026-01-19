import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CalculatePriceDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  @Min(0.1)
  weight: number;
}
