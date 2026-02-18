import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import {ObjectiveService} from "../objective/objective.service";
import {PrismaService} from "../prisma.service";
import {GeminiService} from "../gemini.service";

@Module({
  controllers: [AiController],
  providers: [AiService,ObjectiveService,PrismaService,GeminiService],
})
export class AiModule {}
