import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, DataSource } from 'typeorm';
import { Parcel } from './entities/parcel.entity';
import { TrackingCounter } from '../tracking/entities/tracking-counter.entity';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelDto } from './dto/update-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class ParcelsService {
  constructor(
    @InjectRepository(Parcel)
    private parcelsRepository: Repository<Parcel>,
    @InjectRepository(TrackingCounter)
    private trackingCounterRepository: Repository<TrackingCounter>,
    private pricingService: PricingService,
    private dataSource: DataSource,
  ) {}

  async create(createParcelDto: CreateParcelDto): Promise<Parcel> {
    const trackingNumber = await this.generateTrackingNumber();
    
    const price = await this.pricingService.calculatePrice(
      createParcelDto.destinationCountry,
      createParcelDto.weight,
    );

    const parcel = this.parcelsRepository.create({
      ...createParcelDto,
      trackingNumber,
      price,
    });

    return this.parcelsRepository.save(parcel);
  }

  private async generateTrackingNumber(): Promise<string> {
    return this.dataSource.transaction(async (manager) => {
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      
      let counter = await manager.findOne(TrackingCounter, {
        where: { date: today },
        lock: { mode: 'pessimistic_write' },
      });

      if (!counter) {
        counter = manager.create(TrackingCounter, { date: today, counter: 1 });
      } else {
        counter.counter += 1;
      }

      await manager.save(counter);
      
      const paddedCounter = String(counter.counter).padStart(3, '0');
      return `TZX-${today}-${paddedCounter}`;
    });
  }

  async findAll(search?: string, status?: string): Promise<Parcel[]> {
    const where: any = {};
    
    if (search) {
      where.trackingNumber = ILike(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }

    return this.parcelsRepository.find({
      where,
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Parcel> {
    const parcel = await this.parcelsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    return parcel;
  }

  async findByTracking(trackingNumber: string): Promise<Parcel> {
    const parcel = await this.parcelsRepository.findOne({
      where: { trackingNumber },
      relations: ['client'],
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    return parcel;
  }

  async update(id: string, updateParcelDto: UpdateParcelDto): Promise<Parcel> {
    const parcel = await this.findOne(id);

    if (updateParcelDto.weight || updateParcelDto.destinationCountry) {
      const weight = updateParcelDto.weight || parcel.weight;
      const country = updateParcelDto.destinationCountry || parcel.destinationCountry;
      
      parcel.price = await this.pricingService.calculatePrice(country, weight);
    }

    Object.assign(parcel, updateParcelDto);
    return this.parcelsRepository.save(parcel);
  }

  async updateStatus(id: string, updateStatusDto: UpdateParcelStatusDto): Promise<Parcel> {
    const parcel = await this.findOne(id);
    parcel.status = updateStatusDto.status;
    return this.parcelsRepository.save(parcel);
  }

  async remove(id: string): Promise<void> {
    const parcel = await this.findOne(id);
    await this.parcelsRepository.remove(parcel);
  }
}
