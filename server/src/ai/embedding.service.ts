import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';
import { PrismaVectorStore } from '@langchain/community/vectorstores/prisma';
import { PrismaService } from '../prisma.service';
import { Prisma, OKREmbedding } from '../../generated/prisma/client';

@Injectable()
export class EmbeddingService {
    private readonly logger = new Logger(EmbeddingService.name);
    private vectorStore;

    constructor(private readonly prismaService: PrismaService) {
        const embedder = new GoogleGenerativeAIEmbeddings({
            model: "gemini-embedding-001",
            taskType: TaskType.RETRIEVAL_DOCUMENT,
        });

        this.vectorStore = PrismaVectorStore.withModel<OKREmbedding>(this.prismaService).create(embedder, {
            prisma: Prisma,
            tableName: "OKREmbedding",
            vectorColumnName: "embedding",
            columns: {
                id: PrismaVectorStore.IdColumn,
                content: PrismaVectorStore.ContentColumn,
            },
        });
    }

    async storeEmbedding(objectiveId: string, text: string): Promise<void> {
        // First delete any existing embedding for this objective
        await this.prismaService.oKREmbedding.deleteMany({
            where: { objectiveId },
        });

        // Use addModels to store — create the row first, then let PrismaVectorStore add the vector
        await this.vectorStore.addModels(
            await this.prismaService.$transaction([
                this.prismaService.oKREmbedding.create({
                    data: { objectiveId, content: text },
                }),
            ]),
        );

        this.logger.log(`Stored embedding for objective ${objectiveId}`);
    }

    async findSimilar(query: string, topK: number = 5) {
        const results = await this.vectorStore.similaritySearch(query, topK);

        this.logger.log(`Found ${results.length} similar results for query`);
        return results;
    }
}
