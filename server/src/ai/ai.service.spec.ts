// Mock modules with ESM dependencies to prevent Jest parse errors
jest.mock('./embedding.service', () => ({
  EmbeddingService: class MockEmbeddingService { },
}));
jest.mock('../gemini.service', () => ({
  GeminiService: class MockGeminiService { },
}));
jest.mock('../objective/objective.service', () => ({
  ObjectiveService: class MockObjectiveService { },
}));
jest.mock('@google/genai', () => ({
  ThinkingLevel: { MINIMAL: 'MINIMAL' },
  Type: { OBJECT: 'OBJECT', STRING: 'STRING' },
}));
jest.mock('@sodaru/yup-to-json-schema', () => ({
  convertSchema: jest.fn().mockReturnValue({}),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { ObjectiveService } from '../objective/objective.service';
import { GeminiService } from '../gemini.service';
import { EmbeddingService } from './embedding.service';

describe('AiService', () => {
  let service: AiService;

  const objectiveServiceMock = {
    getAll: jest.fn(),
  };

  const geminiServiceMock = {
    generateContent: jest.fn(),
  };

  const embeddingServiceMock = {
    storeEmbedding: jest.fn().mockResolvedValue(undefined),
    findSimilar: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ObjectiveService, useValue: objectiveServiceMock },
        { provide: GeminiService, useValue: geminiServiceMock },
        { provide: EmbeddingService, useValue: embeddingServiceMock },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should call geminiService.generateContent', async () => {
      const chatDto = [{ role: 'user', parts: [{ text: 'Hello' }] }];
      (geminiServiceMock.generateContent as jest.Mock).mockResolvedValue('response');

      const result = await service.send(chatDto);

      expect(result).toBe('response');
      expect(geminiServiceMock.generateContent).toHaveBeenCalled();
    });
  });

  describe('generateOkr', () => {
    it('should generate and validate an OKR', async () => {
      const objectiveDto = { title: 'Test Objective' };
      const mockOkr = {
        title: 'Test Objective',
        keyResults: [
          { description: 'KR1', target: 100, progress: 0, metric: 'percentage' },
          { description: 'KR2', target: 50, progress: 0, metric: 'number' },
        ],
      };

      (geminiServiceMock.generateContent as jest.Mock).mockResolvedValue(JSON.stringify(mockOkr));

      const result = await service.generateOkr(objectiveDto);

      expect(result).toEqual(mockOkr);
      expect(geminiServiceMock.generateContent).toHaveBeenCalled();
    });
  });
});
