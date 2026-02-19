import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('OKR Tracker API')
        .setDescription('API for managing Objectives and Key Results (OKRs) with AI-powered features including chat assistance, OKR generation, and semantic search via RAG.')
        .setVersion('1.0')
        .addTag('Objectives', 'CRUD operations for Objectives')
        .addTag('Key Results', 'CRUD operations for Key Results under an Objective')
        .addTag('AI', 'AI-powered chat, OKR generation, and semantic search')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);
    await app.listen(process.env.PORT ?? 3000);

}

bootstrap();
