import { Controller } from '@nestjs/common';
import { KeyResultService } from './key-result.service';

@Controller('key-result')
export class KeyResultController {
  constructor(private readonly keyResultService: KeyResultService) {}
}
