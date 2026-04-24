-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Farmer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Farmer" ("aadhar", "accountNumber", "bankName", "branchName", "caste", "consentDate", "consentGiven", "createdAt", "district", "dob", "education", "equipmentDetails", "farmerId", "farmingExperienceYears", "fatherName", "gender", "hamlet", "id", "ifscCode", "irrigationType", "isOrganicFarmer", "mandal", "mobile", "name", "nearestEquipmentKm", "organicSinceYears", "ownsEquipment", "pincode", "state", "updatedAt", "upiId", "userId", "village", "waterSource", "weedsData", "whatsapp") SELECT "aadhar", "accountNumber", "bankName", "branchName", "caste", "consentDate", "consentGiven", "createdAt", "district", "dob", "education", "equipmentDetails", "farmerId", "farmingExperienceYears", "fatherName", "gender", "hamlet", "id", "ifscCode", "irrigationType", "isOrganicFarmer", "mandal", "mobile", "name", "nearestEquipmentKm", "organicSinceYears", "ownsEquipment", "pincode", "state", "updatedAt", "upiId", "userId", "village", "waterSource", "weedsData", "whatsapp" FROM "Farmer";
DROP TABLE "Farmer";
ALTER TABLE "new_Farmer" RENAME TO "Farmer";
CREATE UNIQUE INDEX "Farmer_farmerId_key" ON "Farmer"("farmerId");
CREATE UNIQUE INDEX "Farmer_mobile_key" ON "Farmer"("mobile");
CREATE UNIQUE INDEX "Farmer_userId_key" ON "Farmer"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
