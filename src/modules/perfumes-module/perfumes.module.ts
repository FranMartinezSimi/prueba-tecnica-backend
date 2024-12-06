import { Module, Logger } from '@nestjs/common';
import { PerfumesService } from './services/perfumes.service';
import { PerfumesRepository } from './repository/perfumes.repository';
import { PerfumesController } from './controller/perfumes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfume } from '@/entities/Perfume.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Perfume])],
  providers: [PerfumesService, PerfumesRepository, Logger, {
    provide: 'PERFUMES_REPOSITORY',
    useClass: PerfumesRepository,
  }],
  controllers: [PerfumesController],
})
export class PerfumesModuleModule {}
