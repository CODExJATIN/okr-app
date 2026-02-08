import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ObjectiveService} from './objective.service';


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
        this.objectiveService.getById(id);
    }

    @Post()
    createObjective(@Body() objectiveDto: ObjectiveDto) {

    }
}
