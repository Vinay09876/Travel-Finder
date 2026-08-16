-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "ip" TEXT,
    "userId" TEXT,
    "endpoint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimit_ip_endpoint_createdAt_idx" ON "RateLimit"("ip", "endpoint", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimit_userId_endpoint_createdAt_idx" ON "RateLimit"("userId", "endpoint", "createdAt");
