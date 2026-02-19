import { Module } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveController } from './objective.controller';
import { KeyResultModule } from './key-result/key-result.module';
import { PrismaService } from "../prisma.service";
import { EmbeddingService } from "../ai/embedding.service";

@Module({
  controllers: [ObjectiveController],
  providers: [ObjectiveService, PrismaService , EmbeddingService],
  imports: [KeyResultModule],
})
export class ObjectiveModule { }
