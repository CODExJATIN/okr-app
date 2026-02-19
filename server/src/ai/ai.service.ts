import { Injectable, Logger } from '@nestjs/common';
import { ChatDto } from './chatDto';
import { ObjectiveService } from '../objective/objective.service';
import { ObjectiveDto } from '../objective/dto/Objective.dto';
import { GeminiService } from '../gemini.service';
import { ThinkingLevel, Type } from '@google/genai';
import * as yup from 'yup';
import { convertSchema } from '@sodaru/yup-to-json-schema';
import { EmbeddingService } from './embedding.service';

const okrSchema = yup.object({
    title: yup.string().required(),
    keyResults: yup
        .array()
        .of(
            yup.object({
                description: yup.string().required(),
                target: yup.number().integer().required(),
                progress: yup.number().integer().default(0),
                metric: yup.string().required(),
            }),
        )
        .min(2, 'Must have at least 2 key results')
        .required(),
});

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private readonly objectiveService: ObjectiveService,
        private readonly geminiService: GeminiService,
        private readonly embeddingService: EmbeddingService,
    ) { }

    async send(chatDto: ChatDto[]) {
        const lastUserMessage = [...chatDto]
            .reverse()
            .find((msg) => msg.role === 'user');
        const queryText = lastUserMessage?.parts?.[0]?.text ?? '';

        let relevantOkrs: any[] = [];
        if (queryText) {
            try {
                const results = await this.embeddingService.findSimilar(queryText, 5);
                relevantOkrs = results;
                this.logger.log(results);
                this.logger.log(`Found ${results.length} relevant OKRs via RAG`);
            } catch (e) {
                this.logger.warn(`RAG search failed, falling back to all OKRs: ${e}`);
            }
        }

        // Fallback: if no embeddings exist yet, use all OKRs
        if (relevantOkrs.length === 0) {
            relevantOkrs = await this.objectiveService.getAll();
            this.logger.log('Using all OKRs as fallback (no RAG results)');
        }

        const config = {
            temperature: 0.35,
            responseSchema: {
                type: Type.OBJECT,
                required: ['message'],
                properties: {
                    message: {
                        type: Type.STRING,
                    },
                },
            },
            systemInstruction: [
                {
                    text: `
You are an AI assistant that has access to the user's Objectives and Key Results (OKRs).

Your role:
- Help the user only with queries related to their Objectives and Key Results.
- Use the provided OKR data to generate accurate and contextual responses.
- Provide insights strictly based on the available OKRs.

Scope Rules:
- If unrelated, respond:
  "This request is outside my scope. I can only assist with Objectives and Key Results."
- Respond politely to greetings.

Here are the most relevant Objectives and Key Results for context:
${JSON.stringify(relevantOkrs, null, 2)}
`,
                },
            ],
        };

        const rawText =await this.geminiService.generateContent(
            'gemini-2.5-flash',
            config,
            chatDto,
        );
        return {message : rawText}
    }

    async generateOkr(objectiveDto: ObjectiveDto) {
        const config = {
            responseMimeType: 'application/json',
            responseSchema: convertSchema(okrSchema),
            systemInstruction: [
                {
                    text: `
You are an expert OKR (Objectives and Key Results) generator.

Rules:
- Follow SMART criteria.
- Key Results must be specific, measurable, and time-bound.
- Use valid metrics like number, percentage, days, etc.
- Keep them small, practical, and achievable for an average person.
`,
                },
            ],
        };

        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: `title: ${objectiveDto.title}`,
                    },
                ],
            },
        ];

        const rawText = await this.geminiService.generateContent(
            'gemini-3-flash-preview',
            config,
            contents,
        );

        if (!rawText) {
            throw new Error("Couldn't find any content from AI.");
        }

        const json = JSON.parse(rawText);

        try {
            await okrSchema.validate(json);
        } catch (e) {
            throw new Error(`Invalid OKR structure: ${e}`);
        }

        return json;
    }
}