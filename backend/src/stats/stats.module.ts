import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Parcel } from '../parcels/entities/parcel.entity';
import { Client } from '../clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcel, Client])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
