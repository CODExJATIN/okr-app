import { ApiProperty } from '@nestjs/swagger';

export class MessagePartDto {
    @ApiProperty({
        description: 'Text content of the message part',
        example: 'What is the progress on my OKRs?',
    })
    text: string;
}

export class ChatDto {
    @ApiProperty({
        description: 'Role of the message sender',
        example: 'user',
        enum: ['user', 'model'],
    })
    role: string;

    @ApiProperty({
        description: 'Message parts containing the text content',
        type: [MessagePartDto],
    })
    parts: MessagePartDto[];
}