import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { ObjectiveDto } from './Objective.dto';
import { KeyResultDto } from '../key-result/dto/key-result.dto';

export class CreateOkrDto {

    @ValidateNested()
    @Type(() => ObjectiveDto)
    objective: ObjectiveDto;

    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => KeyResultDto)
    keyResults: KeyResultDto[];
}