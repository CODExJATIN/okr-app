CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE "OKREmbedding" (
    id SERIAL PRIMARY KEY,
    "objectiveId" TEXT NOT NULL,
    embedding VECTOR(3072),

    CONSTRAINT "Document_objectiveId_fkey"
        FOREIGN KEY ("objectiveId")
        REFERENCES "Objective"(id)
        ON DELETE CASCADE
);
