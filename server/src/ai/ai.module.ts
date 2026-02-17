import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import {ObjectiveService} from "../objective/objective.service";
import {PrismaService} from "../prisma.service";

@Module({
  controllers: [AiController],
  providers: [AiService,ObjectiveService,PrismaService],
})
export class AiModule {}
