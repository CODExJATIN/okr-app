import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import {KeyResultDto} from "./dto/key-result.dto";


@Controller('/objective/:objectiveId/key-result')
export class KeyResultController {
  constructor(private readonly keyResultService: KeyResultService) {}

  @Get()
  getByObjecitveId(@Param('objectiveId') objectiveId: string) {
    return this.keyResultService.getByObjectiveId(objectiveId);
  }

@Get('/status')
  isCompleted(@Param('objectiveId') objectiveId: string) {
    return this.keyResultService.isObjectiveCompleted(objectiveId);

  }


  @Get('/:keyResultId')
  getById(@Param('keyResultId') keyResultId: string) {
    return this.keyResultService.getById(keyResultId);
  }

  @Post()
  create(@Body() keyResultDto : KeyResultDto, @Param('objectiveId') objectiveId: string) {
    return this.keyResultService.create(keyResultDto, objectiveId);
  }

  @Patch('/:keyResultId')
  update(@Body() keyResultToUpdate:Partial<KeyResultDto>, @Param('keyResultId') keyResultId: string) {
    return this.keyResultService.update(keyResultId, keyResultToUpdate);
  }

  @Delete('/:keyResultId')
  delete(@Param('keyResultId') keyResultId: string) {
    return this.keyResultService.delete(keyResultId);
  }


}
function isCompleted() {
    throw new Error("Function not implemented.");
}

