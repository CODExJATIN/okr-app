import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
    private readonly ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_API_KEY,
        });
    }

    async generateContent(
        model: string,
        config: any,
        contents: any,
    ): Promise<string> {
        const response = await this.ai.models.generateContent({
            model,
            config,
            contents,
        });

        return response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
}
