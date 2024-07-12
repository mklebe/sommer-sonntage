import { Module } from '@nestjs/common';
import { CatSchedulerService } from './cat-scheduler.service';

@Module({
  providers: [CatSchedulerService],
  exports: [CatSchedulerService],
})
export class CatSchedulerModule {}
