import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ObjectiveDto} from "./dto/Objective.dto";

@Injectable()
export class ObjectiveService {
    constructor(private readonly prismaService: PrismaService) {
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

    create(objectiveDto: ObjectiveDto) {
        return this.prismaService.objective.create({
            data: objectiveDto,
            include: {
                keyResults: true,
            }
        });
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
