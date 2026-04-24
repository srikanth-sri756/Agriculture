-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'farmer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "state" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "mandal" TEXT NOT NULL DEFAULT '',
    "village" TEXT NOT NULL DEFAULT '',
    "hamlet" TEXT NOT NULL DEFAULT '',
    "pincode" TEXT NOT NULL DEFAULT '',
    "farmingExperienceYears" INTEGER NOT NULL DEFAULT 0,
    "isOrganicFarmer" TEXT NOT NULL DEFAULT 'no',
    "organicSinceYears" INTEGER NOT NULL DEFAULT 0,
    "weedsData" TEXT NOT NULL DEFAULT '{}',
    "waterSource" TEXT NOT NULL DEFAULT '',
    "irrigationType" TEXT NOT NULL DEFAULT '',
    "ownsEquipment" TEXT NOT NULL DEFAULT 'no',
    "equipmentDetails" TEXT NOT NULL DEFAULT '',
    "nearestEquipmentKm" REAL NOT NULL DEFAULT 0,
    "bankName" TEXT NOT NULL DEFAULT '',
    "branchName" TEXT NOT NULL DEFAULT '',
    "accountNumber" TEXT NOT NULL DEFAULT '',
    "ifscCode" TEXT NOT NULL DEFAULT '',
    "upiId" TEXT NOT NULL DEFAULT '',
    "consentGiven" TEXT NOT NULL DEFAULT 'no',
    "consentDate" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Land" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyNo" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL DEFAULT '',
    "mandal" TEXT NOT NULL DEFAULT '',
    "village" TEXT NOT NULL DEFAULT '',
    "acreage" REAL NOT NULL DEFAULT 0,
    "landType" TEXT NOT NULL DEFAULT '',
    "soilType" TEXT NOT NULL DEFAULT '',
    "hasSoilReport" TEXT NOT NULL DEFAULT 'no',
    "soilReportUrl" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "Land_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "season" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "acreage" REAL NOT NULL DEFAULT 0,
    "variety" TEXT NOT NULL DEFAULT '',
    "yearlyYield" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "Crop_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Economics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesticideCostPerYear" REAL NOT NULL DEFAULT 0,
    "fertilizerCostPerYear" REAL NOT NULL DEFAULT 0,
    "seedCostPerYear" REAL NOT NULL DEFAULT 0,
    "laborWagesPerYear" REAL NOT NULL DEFAULT 0,
    "totalIncomePerYear" REAL NOT NULL DEFAULT 0,
    "marketDistance" REAL NOT NULL DEFAULT 0,
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "Economics_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
