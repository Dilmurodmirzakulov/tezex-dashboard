import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateParcelStatusDto {
  @ApiProperty({ 
    example: 'in-transit',
    enum: ['pending', 'processing', 'in-transit', 'delivered', 'cancelled']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'processing', 'in-transit', 'delivered', 'cancelled'])
  status: string;
}
