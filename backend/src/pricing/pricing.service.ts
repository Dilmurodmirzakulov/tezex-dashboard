import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryPricing } from './entities/country-pricing.entity';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(CountryPricing)
    private pricingRepository: Repository<CountryPricing>,
  ) {}

  async create(createPricingDto: CreatePricingDto): Promise<CountryPricing> {
    const pricing = this.pricingRepository.create(createPricingDto);
    return this.pricingRepository.save(pricing);
  }

  async findAll(): Promise<CountryPricing[]> {
    return this.pricingRepository.find({
      order: { country: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CountryPricing> {
    const pricing = await this.pricingRepository.findOne({ where: { id } });
    if (!pricing) {
      throw new NotFoundException('Pricing not found');
    }
    return pricing;
  }

  async findByCountry(country: string): Promise<CountryPricing> {
    const pricing = await this.pricingRepository.findOne({ where: { country } });
    if (!pricing) {
      throw new NotFoundException(`Pricing for ${country} not found`);
    }
    return pricing;
  }

  async update(id: string, updatePricingDto: UpdatePricingDto): Promise<CountryPricing> {
    const pricing = await this.findOne(id);
    Object.assign(pricing, updatePricingDto);
    return this.pricingRepository.save(pricing);
  }

  async remove(id: string): Promise<void> {
    const pricing = await this.findOne(id);
    await this.pricingRepository.remove(pricing);
  }

  async calculatePrice(country: string, weight: number): Promise<number> {
    const pricing = await this.findByCountry(country);

    if (weight <= 0.5) return pricing.price05kg;
    if (weight <= 1) return pricing.price1kg;
    if (weight <= 2) return pricing.price2kg;
    if (weight <= 3) return pricing.price3kg;
    if (weight <= 4) return pricing.price4kg;
    if (weight <= 5) return pricing.price5kg;
    if (weight <= 10) return pricing.price10kg;
    if (weight <= 15) return pricing.price15kg;
    if (weight <= 20) return pricing.price20kg;
    if (weight <= 25) return pricing.price25kg;
    if (weight <= 30) return pricing.price30kg;
    if (weight <= 35) return pricing.price35kg;
    if (weight <= 40) return pricing.price40kg;
    if (weight <= 45) return pricing.price45kg;
    if (weight <= 50) return pricing.price50kg;
    if (weight <= 55) return pricing.price55kg;
    if (weight <= 60) return pricing.price60kg;
    if (weight <= 65) return pricing.price65kg;
    if (weight <= 70) return pricing.price70kg;

    const extraWeight = weight - 70;
    return pricing.price70kg + (extraWeight * pricing.pricePerKgAbove70);
  }

  async importFromCsv(fileBuffer: Buffer): Promise<{ success: number; failed: number }> {
    const results = [];
    const stream = Readable.from(fileBuffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          let success = 0;
          let failed = 0;

          for (const row of results) {
            try {
              const pricing = this.pricingRepository.create({
                country: row.country,
                price05kg: parseFloat(row.price05kg),
                price1kg: parseFloat(row.price1kg),
                price2kg: parseFloat(row.price2kg),
                price3kg: parseFloat(row.price3kg),
                price4kg: parseFloat(row.price4kg),
                price5kg: parseFloat(row.price5kg),
                price10kg: parseFloat(row.price10kg),
                price15kg: parseFloat(row.price15kg),
                price20kg: parseFloat(row.price20kg),
                price25kg: parseFloat(row.price25kg),
                price30kg: parseFloat(row.price30kg),
                price35kg: parseFloat(row.price35kg),
                price40kg: parseFloat(row.price40kg),
                price45kg: parseFloat(row.price45kg),
                price50kg: parseFloat(row.price50kg),
                price55kg: parseFloat(row.price55kg),
                price60kg: parseFloat(row.price60kg),
                price65kg: parseFloat(row.price65kg),
                price70kg: parseFloat(row.price70kg),
                pricePerKgAbove70: parseFloat(row.pricePerKgAbove70),
              });
              await this.pricingRepository.save(pricing);
              success++;
            } catch (error) {
              failed++;
            }
          }

          resolve({ success, failed });
        })
        .on('error', reject);
    });
  }

  async importFromExcel(fileBuffer: Buffer): Promise<{ success: number; failed: number }> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let success = 0;
    let failed = 0;

    for (const row of data) {
      try {
        const pricing = this.pricingRepository.create({
          country: row['country'],
          price05kg: parseFloat(row['price05kg']),
          price1kg: parseFloat(row['price1kg']),
          price2kg: parseFloat(row['price2kg']),
          price3kg: parseFloat(row['price3kg']),
          price4kg: parseFloat(row['price4kg']),
          price5kg: parseFloat(row['price5kg']),
          price10kg: parseFloat(row['price10kg']),
          price15kg: parseFloat(row['price15kg']),
          price20kg: parseFloat(row['price20kg']),
          price25kg: parseFloat(row['price25kg']),
          price30kg: parseFloat(row['price30kg']),
          price35kg: parseFloat(row['price35kg']),
          price40kg: parseFloat(row['price40kg']),
          price45kg: parseFloat(row['price45kg']),
          price50kg: parseFloat(row['price50kg']),
          price55kg: parseFloat(row['price55kg']),
          price60kg: parseFloat(row['price60kg']),
          price65kg: parseFloat(row['price65kg']),
          price70kg: parseFloat(row['price70kg']),
          pricePerKgAbove70: parseFloat(row['pricePerKgAbove70']),
        });
        await this.pricingRepository.save(pricing);
        success++;
      } catch (error) {
        failed++;
      }
    }

    return { success, failed };
  }
}
