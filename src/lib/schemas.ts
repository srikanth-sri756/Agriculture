import { z } from "zod";

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit WhatsApp number required"),
  aadhar: z.string().regex(/^\d{12}$/, "Valid 12-digit Aadhar number required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required"),
  caste: z.string().min(1, "Caste category is required"),
  education: z.string().min(1, "Education is required"),
});

// Step 2: Address
export const addressSchema = z.object({
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  mandal: z.string().min(1, "Mandal is required"),
  village: z.string().min(1, "Village is required"),
  hamlet: z.string().min(1, "Hamlet is required"),
  pincode: z.string().regex(/^\d{6}$/, "Valid 6-digit pincode required"),
});

// Step 3: Land Details
export const landSchema = z.object({
  lands: z.array(z.object({
    surveyNo: z.string().min(1, "Survey number required"),
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    mandal: z.string().min(1, "Mandal is required"),
    village: z.string().min(1, "Village is required"),
    acreage: z.string().min(1, "Acreage is required"),
    landType: z.string().min(1, "Land type is required"),
    soilType: z.string().min(1, "Soil type is required"),
    hasSoilReport: z.string().min(1, "Soil report status required"),
  })).min(1, "At least one land parcel required"),
});

// Step 4-6: Crops (per season)
export const cropSchema = z.object({
  crops: z.array(z.object({
    season: z.string(),
    cropName: z.string().min(1, "Crop name required"),
    acreage: z.string().min(1, "Acreage is required"),
    variety: z.string().min(1, "Variety is required"),
    yearlyYield: z.string().min(1, "Yearly yield is required"),
  })).min(1, "At least one crop required"),
});

// Step 7: Farming Experience
export const experienceSchema = z.object({
  farmingExperienceYears: z.string().min(1, "Experience is required"),
  isOrganicFarmer: z.string().min(1, "Please select yes or no"),
  organicSinceYears: z.string().min(1, "Years required"),
});

// Step 8: Weeds
export const weedEntrySchema = z.object({
  weedType: z.string().min(1, "Weed type required"),
  percentage: z.string().min(1, "Coverage required"),
});

export const weedsSchema = z.object({
  weeds: z.array(weedEntrySchema).min(1, "At least one weed entry required"),
});

// Step 9: Water Source
export const waterSchema = z.object({
  waterSource: z.string().min(1, "Water source required"),
  irrigationType: z.string().min(1, "Irrigation type is required"),
});

// Step 10: Equipment
export const equipmentSchema = z.object({
  ownsEquipment: z.string().min(1, "Please select yes or no"),
  equipmentList: z.array(z.string()).optional(),
  nearestEquipmentKm: z.string().min(1, "Distance is required"),
});

// Step 11: Economics
export const economicsSchema = z.object({
  pesticideCostPerYear: z.string().min(1, "Pesticide cost required"),
  fertilizerCostPerYear: z.string().min(1, "Fertilizer cost required"),
  seedCostPerYear: z.string().min(1, "Seed cost required"),
  laborWagesPerYear: z.string().min(1, "Labor wages required"),
  totalIncomePerYear: z.string().min(1, "Total income required"),
  marketDistance: z.string().min(1, "Market distance required"),
});

// Step 12: Banking
export const bankingSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  branchName: z.string().min(1, "Branch name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Valid IFSC code required (e.g., SBIN0001234)"),
  upiId: z.string().min(1, "UPI ID is required"),
});

// Step 13: Consent
export const consentSchema = z.object({
  consentGiven: z.literal("yes", { message: "Consent is required" }),
});

// Export types
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type LandData = z.infer<typeof landSchema>;
export type CropData = z.infer<typeof cropSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type WeedsData = z.infer<typeof weedsSchema>;
export type WaterData = z.infer<typeof waterSchema>;
export type EquipmentData = z.infer<typeof equipmentSchema>;
export type EconomicsData = z.infer<typeof economicsSchema>;
export type BankingData = z.infer<typeof bankingSchema>;
export type ConsentData = z.infer<typeof consentSchema>;

// Login
export const loginSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
