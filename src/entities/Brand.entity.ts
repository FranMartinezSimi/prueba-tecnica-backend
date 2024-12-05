import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Perfume } from './Perfume.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ nullable: false })
  logo: string;

  @OneToMany(() => Perfume, (perfume) => perfume.brand)
  perfumes: Perfume[];
}
