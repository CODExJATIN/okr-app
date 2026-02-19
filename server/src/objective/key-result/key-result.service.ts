import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "../../prisma.service";
import { KeyResultDto } from "./dto/key-result.dto";
import { Logger } from '@nestjs/common';

@Injectable()
export class KeyResultService {
    constructor(private readonly prismaService: PrismaService) {
    }

    getByObjectiveId(objectiveId: string) {
        return this.prismaService.keyResult.findMany({
            where: {
                objectiveId: objectiveId,
            }
        });
    }

    getById(keyResultId: string) {
        return this.prismaService.keyResult.findUnique({
            where: {
                id: keyResultId,
            }
        })
    }

    create(keyResultDto: KeyResultDto, objectiveId: string) {
        return this.prismaService.keyResult.create({
            data: {
                ...keyResultDto,
                objectiveId: objectiveId
            }
        })
    }

    async isObjectiveCompleted(ObjectiveId: string) {

        const res = await this.prismaService.objective.findUnique({
            where: {
                id: ObjectiveId
            },
            include: {
                keyResults: true
            }
        })


        let progress = 0;
        let isCompleted = true;


        if (!res) {
            console.log('OBJECTIVE NOT FOUND');
            throw new NotFoundException('objective not found')
        }

        for (const keyResult of res.keyResults) {
            progress += keyResult.progress;
            if (keyResult.progress != 100) {
                isCompleted = false;
            }
        }

        progress = res.keyResults.length > 0 ? progress / res.keyResults.length : 100;

        await this.prismaService.objective.update({
            where: {
                id: ObjectiveId
            },
            data: {
                isCompleted: isCompleted,
                progress: progress
            }
        })
        return { isCompleted, progress };
    }

    update(keyResultId: string, keyResultToUpdate: Partial<KeyResultDto>) {
        return this.prismaService.keyResult.update({
            data: {
                ...keyResultToUpdate
            },
            where: {
                id: keyResultId,
            }
        })
    }

    delete(keyResultId: string) {
        return this.prismaService.keyResult.delete({
            where: {
                id: keyResultId,
            }
        })
    }
}
