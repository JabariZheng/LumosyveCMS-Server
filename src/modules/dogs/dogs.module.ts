import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { DogsController } from './dogs.controller';
import { CatsModule } from '../cats/cats.module';

@Module({
  imports: [CatsModule],
  controllers: [DogsController],
  providers: [DogsService],
})
export class DogsModule {}
