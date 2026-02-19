-- Restore vector column to 3072 dimensions to match gemini-embedding-001 output
ALTER TABLE "OKREmbedding" ALTER COLUMN embedding TYPE vector(3072);
