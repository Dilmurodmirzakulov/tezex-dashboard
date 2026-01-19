import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from '../parcels/entities/parcel.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Parcel)
    private parcelsRepository: Repository<Parcel>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async getDashboardStats() {
    const totalParcels = await this.parcelsRepository.count();
    const totalClients = await this.clientsRepository.count();

    const statusCounts = await this.parcelsRepository
      .createQueryBuilder('parcel')
      .select('parcel.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('parcel.status')
      .getRawMany();

    const totalRevenue = await this.parcelsRepository
      .createQueryBuilder('parcel')
      .select('SUM(parcel.price)', 'total')
      .getRawOne();

    const recentParcels = await this.parcelsRepository.find({
      relations: ['client'],
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      totalParcels,
      totalClients,
      totalRevenue: parseFloat(totalRevenue.total) || 0,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = parseInt(curr.count);
        return acc;
      }, {}),
      recentParcels,
    };
  }
}
