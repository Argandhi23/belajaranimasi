CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
CREATE TABLE "AnimationCategory" ("id" TEXT PRIMARY KEY, "slug" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL);
CREATE TABLE "AnimationTag" ("id" TEXT PRIMARY KEY, "name" TEXT NOT NULL UNIQUE);
CREATE TABLE "Animation" (
 "id" TEXT PRIMARY KEY, "slug" TEXT NOT NULL UNIQUE, "technicalName" TEXT NOT NULL,
 "indonesianName" TEXT NOT NULL, "shortDescription" TEXT NOT NULL, "explanation" TEXT NOT NULL,
 "difficulty" "Difficulty" NOT NULL, "categoryId" TEXT NOT NULL REFERENCES "AnimationCategory"("id"),
 "keywords" TEXT[] NOT NULL, "libraries" TEXT[] NOT NULL, "demoId" TEXT NOT NULL,
 "codeExampleId" TEXT NOT NULL, "aiPrompt" TEXT NOT NULL, "published" BOOLEAN NOT NULL DEFAULT false,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "AnimationTagRelation" (
 "animationId" TEXT NOT NULL REFERENCES "Animation"("id") ON DELETE CASCADE,
 "tagId" TEXT NOT NULL REFERENCES "AnimationTag"("id") ON DELETE CASCADE,
 PRIMARY KEY ("animationId", "tagId")
);
CREATE INDEX "Animation_published_categoryId_difficulty_idx" ON "Animation"("published","categoryId","difficulty");
