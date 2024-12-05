import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Brand } from './Brand.entity';
import { Inventory } from './Inventory.entity';

@Entity()
export class Perfume {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Brand, (brand) => brand.perfumes)
  brand: Brand;

  @OneToMany(() => Inventory, (inventory) => inventory.perfume)
  inventory: Inventory[];
}
