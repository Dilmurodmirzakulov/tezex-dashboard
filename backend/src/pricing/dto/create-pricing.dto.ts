import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePricingDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 10.00 })
  @IsNumber()
  @Min(0)
  price05kg: number;

  @ApiProperty({ example: 15.00 })
  @IsNumber()
  @Min(0)
  price1kg: number;

  @ApiProperty({ example: 20.00 })
  @IsNumber()
  @Min(0)
  price2kg: number;

  @ApiProperty({ example: 25.00 })
  @IsNumber()
  @Min(0)
  price3kg: number;

  @ApiProperty({ example: 30.00 })
  @IsNumber()
  @Min(0)
  price4kg: number;

  @ApiProperty({ example: 35.00 })
  @IsNumber()
  @Min(0)
  price5kg: number;

  @ApiProperty({ example: 60.00 })
  @IsNumber()
  @Min(0)
  price10kg: number;

  @ApiProperty({ example: 85.00 })
  @IsNumber()
  @Min(0)
  price15kg: number;

  @ApiProperty({ example: 110.00 })
  @IsNumber()
  @Min(0)
  price20kg: number;

  @ApiProperty({ example: 135.00 })
  @IsNumber()
  @Min(0)
  price25kg: number;

  @ApiProperty({ example: 160.00 })
  @IsNumber()
  @Min(0)
  price30kg: number;

  @ApiProperty({ example: 185.00 })
  @IsNumber()
  @Min(0)
  price35kg: number;

  @ApiProperty({ example: 210.00 })
  @IsNumber()
  @Min(0)
  price40kg: number;

  @ApiProperty({ example: 235.00 })
  @IsNumber()
  @Min(0)
  price45kg: number;

  @ApiProperty({ example: 260.00 })
  @IsNumber()
  @Min(0)
  price50kg: number;

  @ApiProperty({ example: 285.00 })
  @IsNumber()
  @Min(0)
  price55kg: number;

  @ApiProperty({ example: 310.00 })
  @IsNumber()
  @Min(0)
  price60kg: number;

  @ApiProperty({ example: 335.00 })
  @IsNumber()
  @Min(0)
  price65kg: number;

  @ApiProperty({ example: 360.00 })
  @IsNumber()
  @Min(0)
  price70kg: number;

  @ApiProperty({ example: 5.00 })
  @IsNumber()
  @Min(0)
  pricePerKgAbove70: number;
}
