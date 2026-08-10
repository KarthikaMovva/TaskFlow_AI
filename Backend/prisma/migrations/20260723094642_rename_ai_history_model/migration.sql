/*
  Warnings:

  - You are about to drop the `AIHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIHistory" DROP CONSTRAINT "AIHistory_userId_fkey";

-- DropTable
DROP TABLE "AIHistory";

-- CreateTable
CREATE TABLE "AiHistory" (
    "id" TEXT NOT NULL,
    "type" "AIType" NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiHistory" ADD CONSTRAINT "AiHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
