import {Injectable} from '@nestjs/common';
import {ChatDto} from "./chatDto";
import {GoogleGenAI, ThinkingLevel, Type,} from '@google/genai';
import {ObjectiveService} from "../objective/objective.service";
import * as yup from 'yup';
import {convertSchema} from '@sodaru/yup-to-json-schema';
import {ObjectiveDto} from "../objective/dto/Objective.dto";

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
    private  readonly ai : GoogleGenAI;
    constructor(private readonly objectiveService: ObjectiveService) {
        this.ai = new GoogleGenAI({
            apiKey: process.env['GEMINI_API_KEY'],
        });
    }

    async send(chatDto: ChatDto[]) {
        const okrs = await this.objectiveService.getAll();
        const config = {
            temperature: 0.35,
            thinkingConfig: {
                thinkingBudget: -1,
            },
            responseSchema: {
                type: Type.OBJECT,
                required: ["message"],
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
- Provide insights, summaries, suggestions, progress analysis, or improvements strictly based on the available OKRs.

Scope Rules:
- If the query is related to OKRs, respond helpfully using the provided data.
- If the query is unrelated to OKRs, respond with:
  "This request is outside my scope. I can only assist with Objectives and Key Results."
- You may respond to greetings naturally and politely.

Here is the complete list of Objectives and their respective Key Results:
${JSON.stringify(okrs, null, 2)}
`
                }
            ],
        };
        const model = 'gemini-flash-latest';
        const contents = chatDto

        const response = await this.ai.models.generateContent({
            model,
            config,
            contents,
        });

        return response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    }

    async generateOkr(objectiveDto: ObjectiveDto) {
        const config = {
            thinkingConfig: {
                thinkingLevel: ThinkingLevel.MINIMAL,
            },
            responseMimeType: 'application/json',
            responseSchema: convertSchema(okrSchema),
            systemInstruction: [
                {
                    text: `You are an expert OKR (Objectives and Key Results) generator. Your task is to accept a user's rough goal and convert it into a structured, high-quality OKR object.

            Rules:
            
            SMART Criteria: Ensure Key Results are Specific, Measurable, and Time-bound. If the user input is vague, infer reasonable metrics to create a complete example. also make sure to use valid matrics such as number percentage days or any quantative attribute that suits the key result 
            
            key results should be very specific tiny goals type and practically achievable assuming that user is just an average person trying to achieving that objective`,
                },
            ],
        };
        const model = 'gemini-3-flash-preview';
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: `title: ${objectiveDto.title}  `,
                    },
                ],
            },
        ];

        const response = await this.ai.models.generateContent({
            model,
            config,
            contents,
        });
        const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            throw new Error("Couldn't find any content from the ai.");
        }
        const json = await JSON.parse(rawText);
        try {
            const match = await okrSchema.validate(json);
            console.log(match);
        } catch (e) {
            console.error(e);
            throw new Error(e.toString());
        }
        return json;
    }
}
