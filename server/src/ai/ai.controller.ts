import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from "./ai.service";
import { ChatDto } from "./chatDto";
import { ObjectiveDto } from "../objective/dto/Objective.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ChatResponseDto, GeneratedOkrDto } from "../common/dto/response.dto";

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    @ApiOperation({
        summary: 'Chat with AI assistant',
        description: 'Send a conversation history to the AI assistant. It uses RAG (Retrieval-Augmented Generation) to find relevant OKRs via semantic search and provides contextual responses about your Objectives and Key Results.',
    })
    @ApiBody({
        type: [ChatDto],
        description: 'Array of chat messages forming the conversation history',
        examples: {
            simple: {
                summary: 'Simple greeting',
                value: [{ role: 'user', parts: [{ text: 'Hello!' }] }],
            },
            query: {
                summary: 'Query about OKRs',
                value: [
                    { role: 'user', parts: [{ text: 'What is the progress on customer satisfaction?' }] },
                ],
            },
            conversation: {
                summary: 'Multi-turn conversation',
                value: [
                    { role: 'user', parts: [{ text: 'Show me my OKR progress' }] },
                    { role: 'model', parts: [{ text: '{"message": "Here is your OKR progress..."}' }] },
                    { role: 'user', parts: [{ text: 'Which ones are behind schedule?' }] },
                ],
            },
        },
    })
    @ApiResponse({ status: 200, description: 'AI-generated response based on relevant OKRs.', type: ChatResponseDto })
    @ApiResponse({ status: 500, description: 'AI service error.' })
    sendMessage(@Body() chatDto: ChatDto[]) {
        return this.aiService.send(chatDto);
    }

    @Post('generate')
    @ApiOperation({
        summary: 'Generate OKR with AI',
        description: 'Given an Objective title, the AI generates a complete OKR with measurable Key Results following SMART criteria.',
    })
    @ApiBody({
        type: ObjectiveDto,
        description: 'Objective with a title to generate Key Results for',
        examples: {
            fitness: {
                summary: 'Fitness goal',
                value: { title: 'Run a marathon' },
            },
            business: {
                summary: 'Business goal',
                value: { title: 'Increase quarterly revenue' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Generated OKR with title and Key Results.', type: GeneratedOkrDto })
    @ApiResponse({ status: 400, description: 'Validation failed - title is required.' })
    @ApiResponse({ status: 500, description: 'AI generation failed.' })
    generateOkr(@Body() objectiveDto: ObjectiveDto) {
        return this.aiService.generateOkr(objectiveDto);
    }
}
