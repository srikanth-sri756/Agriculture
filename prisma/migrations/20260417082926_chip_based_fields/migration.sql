-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Crop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "season" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "acreage" TEXT NOT NULL DEFAULT '',
    "variety" TEXT NOT NULL DEFAULT '',
    "yearlyYield" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "Crop_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Crop" ("acreage", "cropName", "farmerId", "id", "season", "variety", "yearlyYield") SELECT "acreage", "cropName", "farmerId", "id", "season", "variety", "yearlyYield" FROM "Crop";
DROP TABLE "Crop";
ALTER TABLE "new_Crop" RENAME TO "Crop";
CREATE TABLE "new_Economics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesticideCostPerYear" TEXT NOT NULL DEFAULT '',
    "fertilizerCostPerYear" TEXT NOT NULL DEFAULT '',
    "seedCostPerYear" TEXT NOT NULL DEFAULT '',
    "laborWagesPerYear" TEXT NOT NULL DEFAULT '',
    "totalIncomePerYear" TEXT NOT NULL DEFAULT '',
    "marketDistance" TEXT NOT NULL DEFAULT '',
    "farmerId" TEXT NOT NULL,
    CONSTRAINT "Economics_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Economics" ("farmerId", "fertilizerCostPerYear", "id", "laborWagesPerYear", "marketDistance", "pesticideCostPerYear", "seedCostPerYear", "totalIncomePerYear") SELECT "farmerId", "fertilizerCostPerYear", "id", "laborWagesPerYear", "marketDistance", "pesticideCostPerYear", "seedCostPerYear", "totalIncomePerYear" FROM "Economics";
DROP TABLE "Economics";
ALTER TABLE "new_Economics" RENAME TO "Economics";
CREATE UNIQUE INDEX "Economics_farmerId_key" ON "Economics"("farmerId");
CREATE TABLE "new_Farmer" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Farmer" ("aadhar", "accountNumber", "bankName", "branchName", "caste", "consentDate", "consentGiven", "createdAt", "district", "dob", "education", "equipmentDetails", "farmerId", "farmingExperienceYears", "fatherName", "gender", "hamlet", "id", "ifscCode", "irrigationType", "isOrganicFarmer", "mandal", "mobile", "name", "nearestEquipmentKm", "organicSinceYears", "ownsEquipment", "pincode", "state", "status", "updatedAt", "upiId", "userId", "village", "waterSource", "weedsData", "whatsapp") SELECT "aadhar", "accountNumber", "bankName", "branchName", "caste", "consentDate", "consentGiven", "createdAt", "district", "dob", "education", "equipmentDetails", "farmerId", "farmingExperienceYears", "fatherName", "gender", "hamlet", "id", "ifscCode", "irrigationType", "isOrganicFarmer", "mandal", "mobile", "name", "nearestEquipmentKm", "organicSinceYears", "ownsEquipment", "pincode", "state", "status", "updatedAt", "upiId", "userId", "village", "waterSource", "weedsData", "whatsapp" FROM "Farmer";
DROP TABLE "Farmer";
ALTER TABLE "new_Farmer" RENAME TO "Farmer";
CREATE UNIQUE INDEX "Farmer_farmerId_key" ON "Farmer"("farmerId");
CREATE UNIQUE INDEX "Farmer_mobile_key" ON "Farmer"("mobile");
CREATE UNIQUE INDEX "Farmer_userId_key" ON "Farmer"("userId");
CREATE TABLE "new_Land" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "Land_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Land" ("acreage", "district", "farmerId", "hasSoilReport", "id", "landType", "mandal", "soilReportUrl", "soilType", "state", "surveyNo", "village") SELECT "acreage", "district", "farmerId", "hasSoilReport", "id", "landType", "mandal", "soilReportUrl", "soilType", "state", "surveyNo", "village" FROM "Land";
DROP TABLE "Land";
ALTER TABLE "new_Land" RENAME TO "Land";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
