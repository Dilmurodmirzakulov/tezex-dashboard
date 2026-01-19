import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('country_pricing')
export class CountryPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  country: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price05kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price1kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price2kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price3kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price4kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price5kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price10kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price15kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price20kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price25kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price30kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price35kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price40kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price45kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price50kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price55kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price60kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price65kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price70kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerKgAbove70: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
