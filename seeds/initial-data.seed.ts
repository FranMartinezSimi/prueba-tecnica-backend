import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Brand } from '../src/entities/Brand.entity';
import { Perfume } from '../src/entities/Perfume.entity';
import { Inventory, PerfumeSize } from '../src/entities/Inventory.entity';
import { User } from '../src/entities/User.entity';
import * as bcrypt from 'bcrypt';

export default class CreateInitialData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const adminRepo = connection.getRepository(User);
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    await adminRepo.save({
      email: 'amanda@mail.com',
      password: hashedPassword,
    });

    const brandRepo = connection.getRepository(Brand);
    const brands = await brandRepo.save([
      { name: 'Carolina Herrera' },
      { name: 'Chanel' },
      { name: 'Dior' },
      { name: 'Paco Rabanne' },
      { name: 'Hugo Boss' },
    ]);

    const perfumeRepo = connection.getRepository(Perfume);
    const perfumes = await perfumeRepo.save([
      {
        name: 'Good Girl',
        description: 'Fragancia oriental floral para mujer',
        imageUrl: 'good-girl.jpg',
        brand: brands[0], // Carolina Herrera
      },
      {
        name: 'Bad Boy',
        description: 'Fragancia oriental especiada para hombre',
        imageUrl: 'bad-boy.jpg',
        brand: brands[0], // Carolina Herrera
      },
      {
        name: 'N°5',
        description: 'Fragancia floral aldehydic icónica',
        imageUrl: 'n5.jpg',
        brand: brands[1],
      },
      {
        name: 'Sauvage',
        description: 'Fragancia aromática fresca',
        imageUrl: 'sauvage.jpg',
        brand: brands[2],
      },
      {
        name: '1 Million',
        description: 'Fragancia oriental especiada',
        imageUrl: '1-million.jpg',
        brand: brands[3],
      },
    ]);

    const inventoryRepo = connection.getRepository(Inventory);
    const inventoryData = [];

    for (const perfume of perfumes) {
      Object.values(PerfumeSize).forEach((size) => {
        const basePrice =
          size === PerfumeSize.SMALL
            ? 50
            : size === PerfumeSize.MEDIUM
              ? 80
              : 120;

        inventoryData.push({
          perfume,
          size,
          price: basePrice + Math.random() * 20,
          stock: Math.floor(Math.random() * 20) + 5,
        });
      });
    }

    await inventoryRepo.save(inventoryData);
  }
}
