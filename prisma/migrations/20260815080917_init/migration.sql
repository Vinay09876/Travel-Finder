-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "galleryImages" TEXT[],
    "vibe" TEXT[],
    "bestSeason" TEXT NOT NULL,
    "bestMonths" TEXT[],
    "weatherNotes" TEXT NOT NULL,
    "distanceKm" JSONB NOT NULL,
    "infoSafety" TEXT NOT NULL,
    "infoConnectivity" TEXT NOT NULL,
    "infoNearestStation" TEXT NOT NULL,
    "infoNearestAirport" TEXT NOT NULL,
    "infoCashNote" TEXT NOT NULL,
    "travelTips" TEXT[],
    "mustTryFood" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostMultiplier" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "foodBudget" INTEGER NOT NULL,
    "foodStandard" INTEGER NOT NULL,
    "foodComfort" INTEGER NOT NULL,
    "localScooterOrAuto" INTEGER NOT NULL,
    "localCabs" INTEGER NOT NULL,

    CONSTRAINT "CostMultiplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportRoute" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL,
    "costPerPersonRoundTrip" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "recommended" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TransportRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "costPerNightPerRoom" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "costPerPerson" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuratedItineraryDay" (
    "id" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "morningActivity" TEXT NOT NULL,
    "morningDescription" TEXT NOT NULL,
    "morningCost" INTEGER NOT NULL,
    "morningTip" TEXT,
    "afternoonActivity" TEXT NOT NULL,
    "afternoonDescription" TEXT NOT NULL,
    "afternoonCost" INTEGER NOT NULL,
    "afternoonFoodRec" TEXT,
    "eveningActivity" TEXT NOT NULL,
    "eveningDescription" TEXT NOT NULL,
    "eveningCost" INTEGER NOT NULL,
    "eveningSunsetSpot" TEXT,

    CONSTRAINT "CuratedItineraryDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedTrip" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "searchParams" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiItinerary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "preferences" JSONB NOT NULL,
    "generatedContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CostMultiplier_destinationId_key" ON "CostMultiplier"("destinationId");

-- CreateIndex
CREATE INDEX "TransportRoute_originCity_destinationId_idx" ON "TransportRoute"("originCity", "destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "CuratedItineraryDay_destinationId_dayNumber_key" ON "CuratedItineraryDay"("destinationId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SavedTrip_userId_destinationId_key" ON "SavedTrip"("userId", "destinationId");

-- AddForeignKey
ALTER TABLE "CostMultiplier" ADD CONSTRAINT "CostMultiplier_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRoute" ADD CONSTRAINT "TransportRoute_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuratedItineraryDay" ADD CONSTRAINT "CuratedItineraryDay_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrip" ADD CONSTRAINT "SavedTrip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrip" ADD CONSTRAINT "SavedTrip_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiItinerary" ADD CONSTRAINT "AiItinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiItinerary" ADD CONSTRAINT "AiItinerary_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
