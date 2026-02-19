jest.mock('../ai/embedding.service', () => ({
  EmbeddingService: class MockEmbeddingService { },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveService } from './objective.service';
import { PrismaService } from '../prisma.service';
import { ObjectiveDto } from './dto/Objective.dto';
import { KeyResultDto } from './key-result/dto/key-result.dto';
import { EmbeddingService } from '../ai/embedding.service';

describe('ObjectiveService', () => {
  let service: ObjectiveService;
  let prismaService: PrismaService;
  let embeddingService: EmbeddingService;

  const prismaMock = {
    objective: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const embeddingMock = {
    storeEmbedding: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectiveService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: EmbeddingService, useValue: embeddingMock },
      ],
    }).compile();

    service = module.get<ObjectiveService>(ObjectiveService);
    prismaService = module.get<PrismaService>(PrismaService);
    embeddingService = module.get<EmbeddingService>(EmbeddingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of objectives', async () => {
      const result = [{ id: '1', title: 'Test', keyResults: [] }];
      (prismaService.objective.findMany as jest.Mock).mockResolvedValue(result);

      expect(await service.getAll()).toEqual(result);
      expect(prismaService.objective.findMany).toHaveBeenCalledWith({
        include: { keyResults: true },
      });
    });
  });

  describe('getById', () => {
    it('should return a single objective', async () => {
      const result = { id: '1', title: 'Test', keyResults: [] };
      (prismaService.objective.findUnique as jest.Mock).mockResolvedValue(result);

      expect(await service.getById('1')).toEqual(result);
      expect(prismaService.objective.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { keyResults: true },
      });
    });
  });

  describe('create', () => {
    it('should create an objective and store embedding', async () => {
      const dto: ObjectiveDto = { title: 'New Objective' };
      const result = { id: '1', ...dto, keyResults: [] };
      (prismaService.objective.create as jest.Mock).mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(prismaService.objective.create).toHaveBeenCalledWith({
        data: dto,
        include: { keyResults: true },
      });
      expect(embeddingService.storeEmbedding).toHaveBeenCalledWith('1', JSON.stringify(result));
    });
  });

  describe('update', () => {
    it('should update an objective', async () => {
      const dto: ObjectiveDto = { title: 'Updated Title' };
      const result = { id: '1', ...dto, keyResults: [] };
      (prismaService.objective.update as jest.Mock).mockResolvedValue(result);

      expect(await service.update(dto, '1')).toEqual(result);
      expect(prismaService.objective.update).toHaveBeenCalledWith({
        data: dto,
        where: { id: '1' },
        include: { keyResults: true },
      });
    });
  });

  describe('delete', () => {
    it('should delete an objective', async () => {
      const result = { id: '1', title: 'Deleted', keyResults: [] };
      (prismaService.objective.delete as jest.Mock).mockResolvedValue(result);

      expect(await service.delete('1')).toEqual(result);
      expect(prismaService.objective.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { keyResults: true },
      });
    });
  });

  describe('createWithKR', () => {
    it('should create an objective with key results', async () => {
      const objectiveDto: ObjectiveDto = { title: 'O with KR' };
      const keyResultsDto: KeyResultDto[] = [{ description: 'KR1', progress: 0, target: 100, metric: 'number' }];
      const result = { id: '1', title: 'O with KR', keyResults: keyResultsDto };

      (prismaService.objective.create as jest.Mock).mockResolvedValue(result);

      expect(await service.createWithKR(objectiveDto, keyResultsDto)).toEqual(result);
      expect(prismaService.objective.create).toHaveBeenCalledWith({
        data: {
          title: objectiveDto.title,
          keyResults: { create: keyResultsDto },
        },
        include: { keyResults: true },
      });
      expect(embeddingService.storeEmbedding).toHaveBeenCalled();
    });
  });
});
