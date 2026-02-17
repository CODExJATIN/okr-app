import {INestApplication} from "@nestjs/common";
import {AppModule} from "../src/app.module";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../src/prisma.service";
import {ObjectiveService} from "../src/objective/objective.service";
import request from "supertest";

describe('Objective', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    beforeEach(async () => {
        const module = await Test
            .createTestingModule({
                imports: [AppModule],
            }).compile();

        app = module.createNestApplication();
        await app.init();
        prismaService = app.get(PrismaService);
        await prismaService.objective.deleteMany({});
    })

    describe('GET /objective', () => {

        it('should return an array of Objectives', async () => {


            const obj = {
                title: "Objective 1"
            }

            const createdObjective = await prismaService.objective.create({
                data: obj,
                include: {
                    keyResults: true
                }
            });

            return request(app.getHttpServer()).get('/objective').expect(200).expect(
                [
                    {
                        id: createdObjective.id,
                        title: obj.title,
                        keyResults: [],
                        isCompleted: false,
                        progress: 0,
                    }

                ]);
        })


    })
})