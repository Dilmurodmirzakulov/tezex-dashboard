import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateParcelDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ example: 'John Sender' })
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @ApiProperty({ example: '123 Sender St, City' })
  @IsString()
  @IsNotEmpty()
  senderAddress: string;

  @ApiProperty({ example: 'Jane Receiver' })
  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @ApiProperty({ example: '+0987654321' })
  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  @ApiProperty({ example: '456 Receiver Ave, City' })
  @IsString()
  @IsNotEmpty()
  receiverAddress: string;

  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsNotEmpty()
  destinationCountry: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  @Min(0.1)
  weight: number;

  @ApiProperty({ example: 'Fragile items', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
