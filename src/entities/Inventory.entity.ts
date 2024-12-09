import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Perfume } from './Perfume.entity';
import { ApiTags } from '@nestjs/swagger';

export enum PerfumeSize {
  SMALL = '50',
  MEDIUM = '100',
  LARGE = '200',
}

@Entity()
@ApiTags('Inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Perfume, (perfume) => perfume.inventory)
  perfume: Perfume;

  @Column({
    type: 'enum',
    enum: PerfumeSize,
  })
  size: PerfumeSize;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
