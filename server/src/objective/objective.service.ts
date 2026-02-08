import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";

@Injectable()
export class ObjectiveService {
    constructor(private readonly prismaService: PrismaService) {
    }

    getAll() {
        this.prismaService.objective.findMany()
    }

    getById(id: string) {
        this.prismaService.objective.findUnique(
            {
                where: {
                    id: id,
                }
            }
        )
    }
}
