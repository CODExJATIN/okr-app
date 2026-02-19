import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectiveDto } from './Objective.dto';
import { KeyResultDto } from '../key-result/dto/key-result.dto';

export class CreateOkrDto {

    @ValidateNested()
    @Type(() => ObjectiveDto)
    @ApiProperty({
        description: 'The Objective to create',
        type: ObjectiveDto,
    })
    objective: ObjectiveDto;

    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => KeyResultDto)
    @ApiProperty({
        description: 'List of Key Results associated with the Objective',
        type: [KeyResultDto],
        minItems: 1,
    })
    keyResults: KeyResultDto[];
}