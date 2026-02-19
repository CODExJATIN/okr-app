import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { ObjectiveDto } from "./dto/Objective.dto";
import { EmbeddingService } from "../ai/embedding.service";

@Injectable()
export class ObjectiveService {
    constructor(private readonly prismaService: PrismaService,
        private readonly embeddingService: EmbeddingService) {
    }

    getAll() {
        return this.prismaService.objective.findMany({
            include: {
                keyResults: true,
            }
        })
    }

    getById(id: string) {
        return this.prismaService.objective.findUnique(
            {
                where: {
                    id: id,
                },
                include: {
                    keyResults: true,
                }
            }
        )
    }

    async create(objectiveDto: ObjectiveDto) {
        const objective = await this.prismaService.objective.create({
            data: objectiveDto,
            include: {
                keyResults: true,
            }
        });
        console.log(objective);
        this.embeddingService.storeEmbedding(objective.id, JSON.stringify(objective)).catch(() => { });
        return objective;
    }

    update(objectiveDto: ObjectiveDto, id: string) {
        return this.prismaService.objective.update({
            data: objectiveDto,
            where: {
                id: id
            },
            include: {
                keyResults: true,
            }
        });
    }

    delete(id: string) {
        return this.prismaService.objective.delete({
            where: {
                id: id,
            },
            include: {
                keyResults: true,
            }
        })
    }
}
