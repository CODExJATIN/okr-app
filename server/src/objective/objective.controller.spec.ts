
jest.mock('./objective.service', () => ({
  ObjectiveService: class MockObjectiveService { },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveController } from './objective.controller';
import { ObjectiveDto } from './dto/Objective.dto';
import { CreateOkrDto } from './dto/CreateOkr.dto';
import { ObjectiveService } from './objective.service';


describe('ObjectiveController', () => {
  let controller: ObjectiveController;
  let service: ObjectiveService;

  const serviceMock = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    createWithKR: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectiveController],
      providers: [
        { provide: ObjectiveService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<ObjectiveController>(ObjectiveController);
    service = module.get<ObjectiveService>(ObjectiveService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllObjectives', () => {
    it('should return an array of objectives', async () => {
      const result = [{ id: '1', title: 'Test', keyResults: [] }];
      (serviceMock.getAll as jest.Mock).mockResolvedValue(result);

      expect(await controller.getAllObjectives()).toEqual(result);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getObjectiveById', () => {
    it('should return a single objective', async () => {
      const result = { id: '1', title: 'Test', keyResults: [] };
      (serviceMock.getById as jest.Mock).mockResolvedValue(result);

      expect(await controller.getObjectiveById('1')).toEqual(result);
      expect(service.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('createObjective', () => {
    it('should create an objective', async () => {
      const dto: ObjectiveDto = { title: 'New Objective' };
      const result = { id: '1', ...dto, keyResults: [] };
      (serviceMock.create as jest.Mock).mockResolvedValue(result);

      expect(await controller.createObjective(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('createObjectiveWithKR', () => {
    it('should create an objective with key results', async () => {
      const okrDto: CreateOkrDto = {
        objective: { title: 'O with KR' },
        keyResults: [{ description: 'KR1', progress: 0, target: 100, metric: 'number' }],
      };
      const result = { id: '1', title: 'O with KR', keyResults: okrDto.keyResults };

      (serviceMock.createWithKR as jest.Mock).mockResolvedValue(result);

      expect(await controller.createObjectiveWithKR(okrDto)).toEqual(result);
      expect(service.createWithKR).toHaveBeenCalledWith(okrDto.objective, okrDto.keyResults);
    });
  });

  describe('updateObjective', () => {
    it('should update an objective', async () => {
      const dto: ObjectiveDto = { title: 'Updated Title' };
      const result = { id: '1', ...dto, keyResults: [] };
      (serviceMock.update as jest.Mock).mockResolvedValue(result);

      expect(await controller.updateObjective('1', dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(dto, '1');
    });
  });

  describe('deleteObjective', () => {
    it('should delete an objective', async () => {
      const result = { id: '1', title: 'Deleted', keyResults: [] };
      (serviceMock.delete as jest.Mock).mockResolvedValue(result);

      expect(await controller.deleteObjective('1')).toEqual(result);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
