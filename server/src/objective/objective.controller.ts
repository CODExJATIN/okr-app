import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ObjectiveService} from './objective.service';
import {ObjectiveDto} from "./dto/Objective.dto";


@Controller('objective')
export class ObjectiveController {
    constructor(private readonly objectiveService: ObjectiveService) {
    }

    @Get()
    getAllObjectives() {
        return this.objectiveService.getAll();
    }

    @Get(':id')
    getObjectiveById(@Param('id') id: string) {
        return this.objectiveService.getById(id);
    }

    @Post()
    createObjective(@Body() objectiveDto: ObjectiveDto) {
        return this.objectiveService.create(objectiveDto);
    }

    @Patch(':id')
    updateObjective(@Param('id') id: string, @Body() objectiveDto: ObjectiveDto) {
        return this.objectiveService.update(objectiveDto,id);
    }

    @Delete(':id')
    deleteObjective(@Param('id') id: string) {
        return this.objectiveService.delete(id);
    }
}
