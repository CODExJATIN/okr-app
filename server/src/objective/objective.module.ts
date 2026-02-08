import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { KeyResultModule } from './key-result/key-result.module';
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [ObjectiveController],
  providers: [ObjectiveService,PrismaService],
  imports: [KeyResultModule],
})
export class ObjectiveModule {}
