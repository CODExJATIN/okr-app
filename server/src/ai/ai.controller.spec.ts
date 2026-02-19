
jest.mock('./ai.service', () => ({
  AiService: class MockAiService { },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

describe('AiController', () => {
  let controller: AiController;
  let service: AiService;

  const serviceMock = {
    send: jest.fn(),
    generateOkr: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        { provide: AiService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should call aiService.send', async () => {
      const chatDto = [{ role: 'user', parts: [{ text: 'Hello' }] }];
      (serviceMock.send as jest.Mock).mockResolvedValue('response');

      const result = await controller.sendMessage(chatDto);

      expect(result).toBe('response');
      expect(service.send).toHaveBeenCalledWith(chatDto);
    });
  });

  describe('generateOkr', () => {
    it('should call aiService.generateOkr', async () => {
      const dto = { title: 'Test' };
      const mockResult = { title: 'Test', keyResults: [] };
      (serviceMock.generateOkr as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.generateOkr(dto);

      expect(result).toEqual(mockResult);
      expect(service.generateOkr).toHaveBeenCalledWith(dto);
    });
  });
});
