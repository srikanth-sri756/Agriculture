// Generates an English-only PDF of a farmer's enrollment form,
// matching the OCF-SPIN Farmer Enrollment & Baseline Form layout.

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { labelFor, cropLabel, weedLabel, equipLabel, plain } from "./farmer-labels";

interface Land {
  surveyNo?: string; state?: string; district?: string; mandal?: string;
  village?: string; acreage?: string; landType?: string; soilType?: string;
  hasSoilReport?: string;
}
interface Crop {
  season?: string; cropName?: string; acreage?: string;
  variety?: string; yearlyYield?: string;
}
interface Economics {
  pesticideCostPerYear?: string; fertilizerCostPerYear?: string;
  seedCostPerYear?: string; laborWagesPerYear?: string;
  totalIncomePerYear?: string; marketDistance?: string;
}
export interface FarmerLike {
  farmerId?: string;
  name?: string; fatherName?: string; mobile?: string; whatsapp?: string;
  aadhar?: string; gender?: string; dob?: string; caste?: string; education?: string;
  state?: string; district?: string; mandal?: string; village?: string;
  hamlet?: string; pincode?: string;
  farmingExperienceYears?: string; isOrganicFarmer?: string;
  organicSinceYears?: string; farmingType?: string;
  weedsData?: string;
  waterSource?: string; irrigationType?: string;
  ownsEquipment?: string; equipmentDetails?: string; nearestEquipmentKm?: string;
  bankName?: string; branchName?: string; accountNumber?: string;
  ifscCode?: string; upiId?: string;
  consentGiven?: string; consentDate?: string;
  status?: string; createdAt?: string;
  lands?: Land[]; crops?: Crop[]; economics?: Economics | null;
}

export function downloadFarmerPdf(f: FarmerLike) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 36;
  let y = margin;

  const ensureSpace = (h: number) => {
    if (y + h > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string) => {
    ensureSpace(36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setFillColor(34, 94, 53);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, y, pageW - margin * 2, 18, "F");
    doc.text(text, margin + 6, y + 13);
    doc.setTextColor(0, 0, 0);
    y += 26;
  };

  const kv = (rows: Array<[string, string]>) => {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, textColor: 20 },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [240, 247, 240], cellWidth: 160 },
        1: { cellWidth: "auto" },
      },
      body: rows,
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Organic Carbon Farming with SPIN", pageW / 2, y, { align: "center" });
  y += 18;
  doc.setFontSize(13);
  doc.text("Farmer Enrollment & Baseline Form", pageW / 2, y, { align: "center" });
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(
    `Farmer ID: ${plain(f.farmerId)}    |    Generated: ${new Date().toLocaleString()}`,
    pageW / 2,
    y,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);
  y += 16;

  // SECTION 1: Know Your Farmer
  heading("SECTION 1: Know Your Farmer (KYF)");
  kv([
    ["Full Name", plain(f.name)],
    ["Father's / Husband's Name", plain(f.fatherName)],
    ["Mobile Number", plain(f.mobile)],
    ["WhatsApp Number", plain(f.whatsapp)],
    ["Aadhar Number", plain(f.aadhar)],
    ["Gender", labelFor("gender", f.gender || "", "en")],
    ["Date of Birth", plain(f.dob)],
    ["Caste Category", plain(f.caste)],
    ["Education", labelFor("education", f.education || "", "en")],
    ["Farming Practice", labelFor("farmingType", f.farmingType || "", "en")],
  ]);

  // SECTION 2: Address
  heading("SECTION 2: Address Details");
  kv([
    ["State", plain(f.state)],
    ["District", plain(f.district)],
    ["Mandal", plain(f.mandal)],
    ["Village", plain(f.village)],
    ["Hamlet", plain(f.hamlet)],
    ["Pincode", plain(f.pincode)],
  ]);

  // SECTION 3: Reference (placeholder, not collected separately)
  heading("SECTION 3: Reference");
  kv([
    ["Reference Person", "-"],
    ["Forwarded By", "-"],
  ]);

  // SECTION 4: Farming Experience & Organic Status
  heading("SECTION 4: Farming Experience & Organic Status");
  kv([
    ["Farming Experience (Years)", plain(f.farmingExperienceYears)],
    ["Organic Farmer?", labelFor("yesNo", f.isOrganicFarmer || "no", "en")],
    ["Organic Farming Since (Years)", plain(f.organicSinceYears)],
  ]);

  // SECTION 5: Land Details (up to 4 parcels)
  heading("SECTION 5: Land Details");
  const lands = f.lands ?? [];
  if (lands.length === 0) {
    kv([["Land Parcels", "No land parcels recorded"]]);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [34, 94, 53], textColor: 255, fontStyle: "bold" },
      head: [[
        "#", "Survey No", "State", "District", "Mandal", "Village",
        "Acreage", "Land Type", "Soil Type", "Soil Report",
      ]],
      body: lands.map((l, i) => [
        i + 1,
        plain(l.surveyNo),
        plain(l.state),
        plain(l.district),
        plain(l.mandal),
        plain(l.village),
        plain(l.acreage),
        labelFor("landType", l.landType || "", "en"),
        labelFor("soilType", l.soilType || "", "en"),
        labelFor("yesNo", l.hasSoilReport || "no", "en"),
      ]),
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  }

  // SECTION 6: Crops & Cropping Pattern
  heading("SECTION 6: Crops & Cropping Pattern");
  const crops = f.crops ?? [];
  if (crops.length === 0) {
    kv([["Crops", "No crops recorded"]]);
  } else {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [34, 94, 53], textColor: 255, fontStyle: "bold" },
      head: [["#", "Season", "Crop", "Acreage", "Variety", "Yearly Yield"]],
      body: crops.map((c, i) => [
        i + 1,
        labelFor("season", c.season || "", "en"),
        cropLabel(c.cropName || "", "en"),
        plain(c.acreage),
        labelFor("variety", c.variety || "", "en"),
        plain(c.yearlyYield),
      ]),
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
  }

  // SECTION 7: Costs & Income
  heading("SECTION 7: Costs & Income (per year)");
  const e = f.economics || {};
  kv([
    ["Pesticide Cost (₹/year)", plain(e.pesticideCostPerYear)],
    ["Fertilizer Cost (₹/year)", plain(e.fertilizerCostPerYear)],
    ["Seed Cost (₹/year)", plain(e.seedCostPerYear)],
    ["Labor Wages (₹/year)", plain(e.laborWagesPerYear)],
    ["Total Income (₹/year)", plain(e.totalIncomePerYear)],
    ["Market Distance (km)", plain(e.marketDistance)],
  ]);

  // SECTION 8: Weeds (% coverage)
  heading("SECTION 8: Weeds Management (% coverage)");
  let weedRows: Array<[string, string]> = [];
  try {
    const parsed: Record<string, string | number> = f.weedsData ? JSON.parse(f.weedsData) : {};
    weedRows = Object.entries(parsed).map(([k, v]) => [weedLabel(k, "en"), `${v}%`]);
  } catch {
    /* ignore malformed JSON */
  }
  kv(weedRows.length > 0 ? weedRows : [["Weeds", "No data recorded"]]);

  // SECTION 9: Water Source & Irrigation
  heading("SECTION 9: Water Source & Irrigation");
  kv([
    ["Water Source", labelFor("waterSource", f.waterSource || "", "en")],
    ["Irrigation Type", labelFor("irrigation", f.irrigationType || "", "en")],
  ]);

  // SECTION 10: Equipment, Mills & Market
  heading("SECTION 10: Equipment, Mills & Market");
  const equipDetails = (f.equipmentDetails || "")
    .split(",")
    .filter(Boolean)
    .map((v) => equipLabel(v.trim(), "en"))
    .join(", ");
  kv([
    ["Owns Equipment?", labelFor("yesNo", f.ownsEquipment || "no", "en")],
    ["Equipment Owned", equipDetails || "-"],
    ["Nearest Equipment Center (km)", plain(f.nearestEquipmentKm)],
    ["Market Distance (km)", plain(e.marketDistance)],
  ]);

  // SECTION 11: Banking & UPI
  heading("SECTION 11: Banking & UPI Details");
  kv([
    ["Account Holder Name", plain(f.name)],
    ["Bank Name", plain(f.bankName)],
    ["Branch", plain(f.branchName)],
    ["Account Number", plain(f.accountNumber)],
    ["IFSC Code", plain(f.ifscCode)],
    ["UPI ID", plain(f.upiId)],
  ]);

  // SECTION 12: Insurance
  heading("SECTION 12: Insurance Details");
  kv([
    ["Crop Insurance", "-"],
    ["Health Insurance", "-"],
  ]);

  // SECTION 13: Consent & Declaration
  heading("SECTION 13: Consent & Declaration");
  kv([
    ["Consent Given", labelFor("yesNo", f.consentGiven || "no", "en")],
    ["Consent Date", plain(f.consentDate)],
    ["Status", plain(f.status)],
    ["Registered On", f.createdAt ? new Date(f.createdAt).toLocaleString() : "-"],
  ]);

  ensureSpace(80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  doc.text(
    "I, the undersigned farmer, hereby give my consent for participation in the \"Organic Carbon Farming with SPIN\" programme.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 }
  );
  y += 30;
  doc.text(`Farmer ID: OCF-SPIN ${plain(f.farmerId)}`, margin, y);
  y += 16;
  doc.text("Login Password: Your Mobile Number", margin, y);
  y += 30;
  doc.text("Signature: ________________________", margin, y);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageW - margin - 160, y);
  doc.setTextColor(0, 0, 0);

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `OCF-SPIN  •  ${plain(f.farmerId)}  •  Page ${i} / ${pageCount}`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 16,
      { align: "center" }
    );
  }

  const safeId = (f.farmerId || "farmer").replace(/[^a-z0-9-]+/gi, "_");
  doc.save(`OCF-SPIN_${safeId}.pdf`);
}

