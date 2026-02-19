import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { KeyResultService } from './key-result.service';
import { KeyResultDto } from "./dto/key-result.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { KeyResultResponseDto, CompletionStatusDto } from "../../common/dto/response.dto";


@ApiTags('Key Results')
@Controller('/objective/:objectiveId/key-result')
export class KeyResultController {
  constructor(private readonly keyResultService: KeyResultService) { }

  @Get()
  @ApiOperation({ summary: 'Get Key Results by Objective', description: 'Retrieves all Key Results belonging to a specific Objective.' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiResponse({ status: 200, description: 'List of Key Results for the Objective.', type: [KeyResultResponseDto] })
  getByObjecitveId(@Param('objectiveId') objectiveId: string) {
    return this.keyResultService.getByObjectiveId(objectiveId);
  }

  @Get('/status')
  @ApiOperation({ summary: 'Get Objective completion status', description: 'Calculates whether all Key Results are complete and returns the average progress. Also updates the Objective\'s completion state in the database.' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the Objective to check', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiResponse({ status: 200, description: 'Completion status with average progress.', type: CompletionStatusDto })
  @ApiResponse({ status: 404, description: 'Objective not found.' })
  isCompleted(@Param('objectiveId') objectiveId: string) {
    return this.keyResultService.isObjectiveCompleted(objectiveId);
  }

  @Get('/:keyResultId')
  @ApiOperation({ summary: 'Get Key Result by ID', description: 'Retrieves a single Key Result by its unique ID.' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiParam({ name: 'keyResultId', description: 'UUID of the Key Result', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiResponse({ status: 200, description: 'The Key Result.', type: KeyResultResponseDto })
  @ApiResponse({ status: 404, description: 'Key Result not found.' })
  getById(@Param('keyResultId') keyResultId: string) {
    return this.keyResultService.getById(keyResultId);
  }

  @Post()
  @ApiOperation({ summary: 'Create Key Result', description: 'Creates a new Key Result under the specified Objective.' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiBody({ type: KeyResultDto })
  @ApiResponse({ status: 201, description: 'Key Result created successfully.', type: KeyResultResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(@Body() keyResultDto: KeyResultDto, @Param('objectiveId') objectiveId: string) {
    return this.keyResultService.create(keyResultDto, objectiveId);
  }

  @Patch('/:keyResultId')
  @ApiOperation({ summary: 'Update Key Result', description: 'Partially updates a Key Result (e.g., progress, description, metric, target).' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiParam({ name: 'keyResultId', description: 'UUID of the Key Result to update', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiBody({ type: KeyResultDto, description: 'Partial Key Result fields to update' })
  @ApiResponse({ status: 200, description: 'Key Result updated successfully.', type: KeyResultResponseDto })
  @ApiResponse({ status: 404, description: 'Key Result not found.' })
  update(@Body() keyResultToUpdate: Partial<KeyResultDto>, @Param('keyResultId') keyResultId: string) {
    return this.keyResultService.update(keyResultId, keyResultToUpdate);
  }

  @Delete('/:keyResultId')
  @ApiOperation({ summary: 'Delete Key Result', description: 'Deletes a Key Result by its ID.' })
  @ApiParam({ name: 'objectiveId', description: 'UUID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
  @ApiParam({ name: 'keyResultId', description: 'UUID of the Key Result to delete', example: '550e8400-e29b-41d4-a716-446655440002' })
  @ApiResponse({ status: 200, description: 'Key Result deleted successfully.', type: KeyResultResponseDto })
  @ApiResponse({ status: 404, description: 'Key Result not found.' })
  delete(@Param('keyResultId') keyResultId: string) {
    return this.keyResultService.delete(keyResultId);
  }
}
