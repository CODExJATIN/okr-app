import { Module } from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { KeyResultController } from './key-result.controller';

@Module({
  controllers: [KeyResultController],
  providers: [KeyResultService],
})
export class KeyResultModule {}
