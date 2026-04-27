-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'farmer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "aadhar" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT '',
    "dob" TEXT NOT NULL DEFAULT '',
    "caste" TEXT NOT NULL DEFAULT '',
    "education" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "mandal" TEXT NOT NULL DEFAULT '',
    "village" TEXT NOT NULL DEFAULT '',
    "hamlet" TEXT NOT NULL DEFAULT '',
    "pincode" TEXT NOT NULL DEFAULT '',
    "farmingExperienceYears" TEXT NOT NULL DEFAULT '',
    "isOrganicFarmer" TEXT NOT NULL DEFAULT 'no',
    "organicSinceYears" TEXT NOT NULL DEFAULT '',
    "weedsData" TEXT NOT NULL DEFAULT '{}',
    "waterSource" TEXT NOT NULL DEFAULT '',
    "irrigationType" TEXT NOT NULL DEFAULT '',
    "ownsEquipment" TEXT NOT NULL DEFAULT 'no',
    "equipmentDetails" TEXT NOT NULL DEFAULT '',
    "nearestEquipmentKm" TEXT NOT NULL DEFAULT '',
    "bankName" TEXT NOT NULL DEFAULT '',
    "branchName" TEXT NOT NULL DEFAULT '',
    "accountNumber" TEXT NOT NULL DEFAULT '',
    "ifscCode" TEXT NOT NULL DEFAULT '',
    "upiId" TEXT NOT NULL DEFAULT '',
    "consentGiven" TEXT NOT NULL DEFAULT 'no',
    "consentDate" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Land" (
    "id" TEXT NOT NULL,
    "surveyNo" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "mandal" TEXT NOT NULL DEFAULT '',
    "village" TEXT NOT NULL DEFAULT '',
    "acreage" TEXT NOT NULL DEFAULT '',
    "landType" TEXT NOT NULL DEFAULT '',
    "soilType" TEXT NOT NULL DEFAULT '',
    "hasSoilReport" TEXT NOT NULL DEFAULT 'no',
    "soilReportUrl" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "acreage" TEXT NOT NULL DEFAULT '',
    "variety" TEXT NOT NULL DEFAULT '',
    "yearlyYield" TEXT NOT NULL DEFAULT '',
    "photoUrl" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Economics" (
    "id" TEXT NOT NULL,
    "pesticideCostPerYear" TEXT NOT NULL DEFAULT '',
    "fertilizerCostPerYear" TEXT NOT NULL DEFAULT '',
    "seedCostPerYear" TEXT NOT NULL DEFAULT '',
    "laborWagesPerYear" TEXT NOT NULL DEFAULT '',
    "totalIncomePerYear" TEXT NOT NULL DEFAULT '',
    "marketDistance" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,

    CONSTRAINT "Economics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_farmerId_key" ON "Farmer"("farmerId");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_mobile_key" ON "Farmer"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_userId_key" ON "Farmer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Economics_farmerId_key" ON "Economics"("farmerId");

-- AddForeignKey
ALTER TABLE "Farmer" ADD CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Economics" ADD CONSTRAINT "Economics_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
