import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class KeyResultResponseDto {
    @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ description: 'Description of the Key Result', example: 'Increase NPS score from 30 to 50' })
    description: string;

    @ApiProperty({ description: 'Current progress (0-100)', example: 45 })
    progress: number;

    @ApiProperty({ description: 'ID of the parent Objective', example: '550e8400-e29b-41d4-a716-446655440001' })
    objectiveId: string;

    @ApiProperty({ description: 'Metric type for measurement', example: 'percentage' })
    metric: string;

    @ApiProperty({ description: 'Target value', example: 100 })
    target: number;
}

export class ObjectiveResponseDto {
    @ApiProperty({ description: 'Unique identifier', example: '550e8400-e29b-41d4-a716-446655440001' })
    id: string;

    @ApiProperty({ description: 'Title of the Objective', example: 'Improve customer satisfaction' })
    title: string;

    @ApiProperty({ description: 'Whether the Objective is completed', example: false })
    isCompleted: boolean;

    @ApiProperty({ description: 'Overall progress percentage', example: 45 })
    progress: number;

    @ApiProperty({ description: 'Associated Key Results', type: [KeyResultResponseDto] })
    keyResults: KeyResultResponseDto[];
}

export class CompletionStatusDto {
    @ApiProperty({ description: 'Whether all Key Results are at 100%', example: false })
    isCompleted: boolean;

    @ApiProperty({ description: 'Average progress across all Key Results', example: 66.5 })
    progress: number;
}

export class ChatResponseDto {
    @ApiProperty({ description: 'AI-generated response message', example: 'Based on your OKRs, your team is making good progress on customer satisfaction...' })
    message: string;
}

export class GeneratedOkrDto {
    @ApiProperty({ description: 'Generated Objective title', example: 'Improve team productivity' })
    title: string;

    @ApiProperty({
        description: 'Generated Key Results',
        example: [
            { description: 'Reduce average task completion time by 20%', target: 20, progress: 0, metric: 'percentage' },
            { description: 'Implement 3 automation tools', target: 3, progress: 0, metric: 'number' },
        ],
    })
    keyResults: any[];
}
