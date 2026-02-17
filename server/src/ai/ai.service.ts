import {Injectable} from '@nestjs/common';
import {ChatDto} from "./chatDto";
import {
    GoogleGenAI, Type,
} from '@google/genai';
import {ObjectiveService} from "../objective/objective.service";

@Injectable()
export class AiService {
    constructor(private readonly objectiveService: ObjectiveService) {
    }

    async send(chatDto: ChatDto[]) {
        const ai = new GoogleGenAI({
            apiKey: process.env['GEMINI_API_KEY'],
        });
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

        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        const text =
            response?.candidates?.[0]?.content?.parts?.[0]?.text || "";


        return text;

    }
}
