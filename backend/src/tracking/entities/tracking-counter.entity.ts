import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tracking_counter')
export class TrackingCounter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  date: string;

  @Column({ default: 0 })
  counter: number;
}
