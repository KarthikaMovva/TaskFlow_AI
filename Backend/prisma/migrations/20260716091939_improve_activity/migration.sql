-- CreateEnum
CREATE TYPE "ActivityEntityType" AS ENUM ('TASK', 'PROJECT', 'COMMENT', 'WORKSPACE', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "description" TEXT,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT;
