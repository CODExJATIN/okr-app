import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ObjectiveService } from './objective.service';
import { ObjectiveDto } from "./dto/Objective.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from "@nestjs/swagger";
import { CreateOkrDto } from "./dto/CreateOkr.dto";
import { ObjectiveResponseDto } from "../common/dto/response.dto";

@ApiTags('Objectives')
@Controller('objective')
export class ObjectiveController {
    constructor(private readonly objectiveService: ObjectiveService) {
    }

    @Get()
    @ApiOperation({ summary: 'Get all Objectives', description: 'Retrieves all Objectives with their associated Key Results.' })
    @ApiResponse({ status: 200, description: 'List of all Objectives with Key Results.', type: [ObjectiveResponseDto] })
    getAllObjectives() {
        return this.objectiveService.getAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Objective by ID', description: 'Retrieves a single Objective by its unique ID, including its Key Results.' })
    @ApiParam({ name: 'id', description: 'UUID of the Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiResponse({ status: 200, description: 'The Objective with its Key Results.', type: ObjectiveResponseDto })
    @ApiResponse({ status: 404, description: 'Objective not found.' })
    getObjectiveById(@Param('id') id: string) {
        return this.objectiveService.getById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create Objective', description: 'Creates a new Objective. An embedding is automatically generated for semantic search.' })
    @ApiBody({ type: ObjectiveDto })
    @ApiResponse({ status: 201, description: 'Objective created successfully.', type: ObjectiveResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    createObjective(@Body() objectiveDto: ObjectiveDto) {
        return this.objectiveService.create(objectiveDto);
    }

    @Post('many')
    @ApiOperation({ summary: 'Create Objective with Key Results', description: 'Creates an Objective along with its Key Results in a single request.' })
    @ApiBody({ type: CreateOkrDto })
    @ApiResponse({ status: 201, description: 'Objective and Key Results created successfully.', type: ObjectiveResponseDto })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    createObjectiveWithKR(@Body() okr: CreateOkrDto) {
        console.log(okr);
        return this.objectiveService.createWithKR(okr.objective, okr.keyResults);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Objective', description: 'Updates the title of an existing Objective by its ID.' })
    @ApiParam({ name: 'id', description: 'UUID of the Objective to update', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiBody({ type: ObjectiveDto })
    @ApiResponse({ status: 200, description: 'Objective updated successfully.', type: ObjectiveResponseDto })
    @ApiResponse({ status: 404, description: 'Objective not found.' })
    updateObjective(@Param('id') id: string, @Body() objectiveDto: ObjectiveDto) {
        return this.objectiveService.update(objectiveDto, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Objective', description: 'Deletes an Objective and all its associated Key Results (cascade).' })
    @ApiParam({ name: 'id', description: 'UUID of the Objective to delete', example: '550e8400-e29b-41d4-a716-446655440001' })
    @ApiResponse({ status: 200, description: 'Objective deleted successfully.', type: ObjectiveResponseDto })
    @ApiResponse({ status: 404, description: 'Objective not found.' })
    deleteObjective(@Param('id') id: string) {
        return this.objectiveService.delete(id);
    }
}
