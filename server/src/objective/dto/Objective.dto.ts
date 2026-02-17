import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';


export class ObjectiveDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({description:'Objective name'})
    title: string;
}
