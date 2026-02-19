import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultController } from './key-result.controller';
import { KeyResultService } from './key-result.service';
import { KeyResultDto } from './dto/key-result.dto';

// Mock KeyResultService
jest.mock('./key-result.service', () => ({
  KeyResultService: class MockKeyResultService { },
}));

describe('KeyResultController', () => {
  let controller: KeyResultController;
  let service: KeyResultService;

  const serviceMock = {
    getByObjectiveId: jest.fn(),
    isObjectiveCompleted: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultController],
      providers: [
        { provide: KeyResultService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<KeyResultController>(KeyResultController);
    service = module.get<KeyResultService>(KeyResultService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getByObjectiveId', () => {
    it('should return key results', async () => {
      const result = [{ id: '1', description: 'KR' }];
      (serviceMock.getByObjectiveId as jest.Mock).mockResolvedValue(result);
      expect(await controller.getByObjecitveId('1')).toEqual(result);
    });
  });
});
