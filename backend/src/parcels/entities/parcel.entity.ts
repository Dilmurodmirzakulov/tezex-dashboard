import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('parcels')
export class Parcel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  trackingNumber: string;

  @Column('uuid')
  clientId: string;

  @ManyToOne(() => Client, (client) => client.parcels)
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column()
  senderName: string;

  @Column()
  senderPhone: string;

  @Column({ type: 'text' })
  senderAddress: string;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column({ type: 'text' })
  receiverAddress: string;

  @Column()
  destinationCountry: string;

  @Column('decimal', { precision: 10, scale: 2 })
  weight: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
