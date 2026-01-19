import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelsService } from './parcels.service';
import { ParcelsController } from './parcels.controller';
import { Parcel } from './entities/parcel.entity';
import { TrackingCounter } from '../tracking/entities/tracking-counter.entity';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Parcel, TrackingCounter]),
    PricingModule,
  ],
  controllers: [ParcelsController],
  providers: [ParcelsService],
  exports: [ParcelsService],
})
export class ParcelsModule {}
