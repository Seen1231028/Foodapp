-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "username" TEXT,
    "userRole" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_entity_idx" ON "activity_logs"("entity");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");
