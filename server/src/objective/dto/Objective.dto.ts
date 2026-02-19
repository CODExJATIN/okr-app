import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ObjectiveDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @ApiProperty({
        description: 'Title of the Objective',
        example: 'Improve customer satisfaction',
        maxLength: 100,
    })
    title: string;
}
