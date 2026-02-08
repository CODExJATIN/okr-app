import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma.service";
import {KeyResultDto} from "./dto/key-result.dto";

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
            data:{
                ...keyResultDto,
                objectiveId: objectiveId
            }
        })
    }

    update(keyResultId: string, keyResultToUpdate: Partial<KeyResultDto>) {
        return this.prismaService.keyResult.update({
            data:{
                ...keyResultToUpdate
            },
            where:{
                id:keyResultId,
            }
        })
    }

    delete(keyResultId: string) {
        return this.prismaService.keyResult.delete({
            where:{
                id:keyResultId,
            }
        })
    }
}
