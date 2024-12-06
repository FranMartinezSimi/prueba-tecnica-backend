import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModuleModule } from './modules/auth-module/auth-module.module';
import { BrandsModuleModule } from './modules/brands-module/brands-module.module';
import { PerfumesModuleModule } from './modules/perfumes-module/perfumes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Brand } from './entities/Brand.entity';
import { Inventory } from './entities/Inventory.entity';
import { Perfume } from './entities/Perfume.entity';
import { UserModule } from './modules/user-module/user.module';

@Module({
  imports: [
    AuthModuleModule,
    BrandsModuleModule,
    PerfumesModuleModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLHOST,
      database: process.env.MYSQLDATABASE,
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      port: parseInt(process.env.MYSQLPORT),
      entities: [User, Brand, Inventory, Perfume],
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      connectTimeout: 60000,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
