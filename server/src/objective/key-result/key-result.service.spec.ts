import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultService } from './key-result.service';
// import {describe} from "node:test";
import {PrismaService} from "../../prisma.service";


describe('KeyResultService', () => {
  let service: KeyResultService;

  const mockPrismaService = {
    objective : {
      findUnique : jest.fn(),
      update : jest.fn(),
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyResultService , {
        provide: PrismaService,
        useValue: mockPrismaService,
      }],
    }).compile();

    service = module.get<KeyResultService>(KeyResultService);
  });




 describe('isCompleted', () => {
    function getMockObjective(progresses :Number[]){
     return {
       objectiveId : '1',
       description : "",
       isCompleted: false,
       keyResults : progresses.map((progress)=>{
         return {
           title : 'abc',
           progress : progress,
         }
       })
     }
   }

   it('Should return false when any one of the key results is not completed', async() => {
     const mockObjective = getMockObjective([10]);
     mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);
     mockPrismaService.objective.update.mockResolvedValue(mockObjective);

     const result  = await service.isObjectiveCompleted('1');
     expect(result.isCompleted).toBeFalsy();
     expect(result.progress).toBeLessThan(100)
   })

   it('should return true when no key result found', async() => {
     const mockObjective = getMockObjective([]);

     mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);
     mockPrismaService.objective.update.mockResolvedValue(mockObjective);

     const result  = await service.isObjectiveCompleted('1');

     expect(result.isCompleted).toBeTruthy();
     expect(result.progress).toEqual(100);

   })

   it('should return true when only one key result with progress 100% is there', async() => {
     const mockObjective = getMockObjective([100]);

     mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);
     mockPrismaService.objective.update.mockResolvedValue(mockObjective);

     const result  = await service.isObjectiveCompleted('1');

     expect(result.isCompleted).toBeTruthy();
     expect(result.progress).toEqual(100);
   })

   it('should return true when all keyResults with progress 100% are there', async() => {
     const mockObjective = getMockObjective([100,100,100]);


     mockPrismaService.objective.findUnique.mockResolvedValue(mockObjective);
     mockPrismaService.objective.update.mockResolvedValue(mockObjective);

     const result  = await service.isObjectiveCompleted('1');

     expect(result.isCompleted).toBeTruthy();
     expect(result.progress).toEqual(100);
   })



 })






});
