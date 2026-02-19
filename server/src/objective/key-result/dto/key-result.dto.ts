import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export class KeyResultDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Description of the Key Result',
        example: 'Increase NPS score from 30 to 50',
    })
    description: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Current progress of the Key Result (0-100)',
        example: 0,
        minimum: 0,
        maximum: 100,
    })
    progress: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Target value for the Key Result',
        example: 100,
        default: 100,
    })
    target?: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'Unit of measurement for tracking progress',
        example: 'percentage',
        default: 'percentage',
    })
    metric?: string;
}