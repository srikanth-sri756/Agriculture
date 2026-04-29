"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useLang } from "@/components/providers";
import { t } from "@/lib/i18n";
import LanguageToggle from "@/components/language-toggle";
import PageBackground from "@/components/page-background";
import * as XLSX from "xlsx";
import {
  Sprout, LogOut, Search, Filter, Download, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Users, Landmark, MapPin, BarChart3, CheckCircle, XCircle, Clock, Edit, Eye,
} from "lucide-react";
import FarmerDetailModal from "@/components/farmer-detail-modal";
import type { FarmerLike } from "@/lib/farmer-pdf";

interface FarmerRow {
  id: string;
  farmerId: string;
  name: string;
  mobile: string;
  fatherName: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  farmingExperienceYears: number;
  isOrganicFarmer: string;
  waterSource: string;
  bankName: string;
  consentGiven: string;
  status: string;
  createdAt: string;
  lands: { surveyNo: string; acreage: string; landType: string; soilType: string; district: string }[];
  crops: { season: string; cropName: string; acreage: string }[];
  economics: { pesticideCostPerYear: number; fertilizerCostPerYear: number; laborWagesPerYear: number; totalIncomePerYear: number } | null;
}

const columnHelper = createColumnHelper<FarmerRow>();

// Acreage is stored as a range string ("<1", "1-3", "3-5", "5-10", "10+").
// Convert to a numeric midpoint estimate so we can sum/sort it.
function acreageToNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value !== "string") return 0;
  const v = value.trim();
  if (!v) return 0;
  if (v.startsWith("<")) {
    const n = parseFloat(v.slice(1));
    return Number.isFinite(n) ? n / 2 : 0;
  }
  if (v.endsWith("+")) {
    const n = parseFloat(v.slice(0, -1));
    return Number.isFinite(n) ? n * 1.2 : 0;
  }
  if (v.includes("-")) {
    const [a, b] = v.split("-").map((s) => parseFloat(s));
    if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
  }
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

async function fetchFarmers(): Promise<FarmerRow[]> {
  const res = await fetch("/api/farmers");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [districtFilter, setDistrictFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [landTypeFilter, setLandTypeFilter] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerLike | null>(null);

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["farmers"],
    queryFn: fetchFarmers,
    enabled: status === "authenticated",
  });

  // Edit request mutations
  const handleEditAction = useMutation({
    mutationFn: async ({ farmerId, action }: { farmerId: string; action: "approve_edit" | "reject_edit" }) => {
      const res = await fetch("/api/farmers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmerId, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["farmers"] }),
  });

  // Pending edit requests
  const pendingRequests = useMemo(() => farmers.filter(f => f.status === "edit_requested"), [farmers]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Apply custom filters
  const filteredData = useMemo(() => {
    let data = farmers;
    if (districtFilter) {
      data = data.filter(f => f.district.toLowerCase().includes(districtFilter.toLowerCase()) || f.lands.some(l => l.district.toLowerCase().includes(districtFilter.toLowerCase())));
    }
    if (cropFilter) {
      data = data.filter(f => f.crops.some(c => c.cropName.toLowerCase().includes(cropFilter.toLowerCase())));
    }
    if (landTypeFilter) {
      data = data.filter(f => f.lands.some(l => l.landType === landTypeFilter));
    }
    return data;
  }, [farmers, districtFilter, cropFilter, landTypeFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalFarmers = farmers.length;
    const totalAcres = farmers.reduce((sum, f) => sum + f.lands.reduce((s, l) => s + acreageToNumber(l.acreage), 0), 0);
    const districts = new Set(farmers.map(f => f.district).filter(Boolean));
    const organic = farmers.filter(f => f.isOrganicFarmer === "yes").length;
    return { totalFarmers, totalAcres: totalAcres.toFixed(1), districts: districts.size, organic };
  }, [farmers]);

  const columns = useMemo(() => [
    columnHelper.accessor("farmerId", {
      header: "Farmer ID",
      cell: (info) => <span className="font-mono text-xs font-medium text-green-800">{info.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: t("field.name", lang),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor("mobile", { header: t("field.mobile", lang) }),
    columnHelper.accessor("district", { header: t("field.district", lang) }),
    columnHelper.accessor("mandal", { header: t("field.mandal", lang) }),
    columnHelper.accessor("village", { header: t("field.village", lang) }),
    columnHelper.accessor((row) => row.lands.reduce((s, l) => s + acreageToNumber(l.acreage), 0), {
      id: "totalAcreage",
      header: t("field.acreage", lang),
      cell: (info) => <span>{info.getValue().toFixed(1)}</span>,
    }),
    columnHelper.accessor((row) => row.crops.map(c => c.cropName).join(", "), {
      id: "crops",
      header: lang === "en" ? "Crops" : "పంటలు",
      cell: (info) => <span className="text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("isOrganicFarmer", {
      header: lang === "en" ? "Organic" : "సేంద్రీయ",
      cell: (info) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === "yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
        }`}>
          {info.getValue() === "yes" ? "Yes" : "No"}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: lang === "en" ? "Status" : "స్థితి",
      cell: (info) => {
        const s = info.getValue();
        const cfg: Record<string, string> = {
          draft: "bg-gray-100 text-gray-600",
          submitted: "bg-green-100 text-green-700",
          edit_requested: "bg-amber-100 text-amber-700",
          edit_approved: "bg-blue-100 text-blue-700",
        };
        const labels: Record<string, string> = { draft: "Draft", submitted: "Submitted", edit_requested: "Edit Requested", edit_approved: "Edit Approved" };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg[s] || cfg.draft}`}>{labels[s] || s}</span>;
      },
    }),
    columnHelper.accessor("consentGiven", {
      header: lang === "en" ? "Consent" : "సమ్మతి",
      cell: (info) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === "yes" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
        }`}>
          {info.getValue() === "yes" ? "✓" : "✗"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: lang === "en" ? "Actions" : "చర్యలు",
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFarmer(row.original as unknown as FarmerLike);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-700 text-white text-xs font-medium hover:bg-green-600 transition"
          title={lang === "en" ? "View & download as PDF" : "చూడు & PDF డౌన్‌లోడ్"}
        >
          <Eye className="w-3.5 h-3.5" />
          {lang === "en" ? "View" : "చూడు"}
        </button>
      ),
    }),
  ], [lang]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, sorting, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.farmerId.toLowerCase().includes(search) ||
        row.original.mobile.includes(search)
      );
    },
    initialState: { pagination: { pageSize: 20 } },
  });

  // Excel Export
  const handleExport = () => {
    const flatData = farmers.map((f) => ({
      "Farmer ID": f.farmerId,
      "Name": f.name,
      "Father Name": f.fatherName,
      "Mobile": f.mobile,
      "State": f.state,
      "District": f.district,
      "Mandal": f.mandal,
      "Village": f.village,
      "Experience (Years)": f.farmingExperienceYears,
      "Organic Farmer": f.isOrganicFarmer,
      "Water Source": f.waterSource,
      "Land Survey Nos": f.lands.map(l => l.surveyNo).join("; "),
      "Total Acreage": f.lands.reduce((s, l) => s + acreageToNumber(l.acreage), 0),
      "Land Types": f.lands.map(l => l.landType).join("; "),
      "Soil Types": f.lands.map(l => l.soilType).join("; "),
      "Kharif Crops": f.crops.filter(c => c.season === "kharif").map(c => c.cropName).join("; "),
      "Rabi Crops": f.crops.filter(c => c.season === "rabi").map(c => c.cropName).join("; "),
      "Perennial Crops": f.crops.filter(c => c.season === "perennial").map(c => c.cropName).join("; "),
      "Pesticide Cost/Year": f.economics?.pesticideCostPerYear ?? "",
      "Fertilizer Cost/Year": f.economics?.fertilizerCostPerYear ?? "",
      "Labor Wages/Year": f.economics?.laborWagesPerYear ?? "",
      "Total Income/Year": f.economics?.totalIncomePerYear ?? "",
      "Bank Name": f.bankName,
      "Consent": f.consentGiven,
      "Registered": f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "",
    }));

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Farmers");

    // Auto-size columns
    const maxWidths = Object.keys(flatData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...flatData.map(row => String(row[key as keyof typeof row] ?? "").length))
    }));
    ws["!cols"] = maxWidths;

    XLSX.writeFile(wb, `OCF-SPIN-Farmers-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <PageBackground />
        <div className="text-green-800 text-lg animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <PageBackground />
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center ring-pulse">
              <Sprout className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-900">{t("admin.dashboard", lang)}</h1>
              <p className="text-xs text-green-600">OCF-SPIN Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/login";
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t("action.logout", lang)}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Users className="w-5 h-5" />} label={t("admin.totalFarmers", lang)} value={stats.totalFarmers} color="green" />
          <StatCard icon={<Landmark className="w-5 h-5" />} label={t("admin.totalLand", lang)} value={stats.totalAcres} color="emerald" />
          <StatCard icon={<MapPin className="w-5 h-5" />} label={t("admin.districts", lang)} value={stats.districts} color="amber" />
          <StatCard icon={<BarChart3 className="w-5 h-5" />} label={lang === "en" ? "Organic Farmers" : "సేంద్రీయ రైతులు"} value={stats.organic} color="teal" />
        </div>

        {/* Pending Edit Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
            <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-amber-900">{t("admin.pendingRequests", lang)} ({pendingRequests.length})</h2>
            </div>
            <div className="divide-y divide-amber-100">
              {pendingRequests.map((f) => (
                <div key={f.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-green-900">{f.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{f.farmerId}</span>
                    <span className="text-xs text-gray-500 ml-2">{f.district}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditAction.mutate({ farmerId: f.id, action: "approve_edit" })}
                      disabled={handleEditAction.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t("admin.approve", lang)}
                    </button>
                    <button
                      onClick={() => handleEditAction.mutate({ farmerId: f.id, action: "reject_edit" })}
                      disabled={handleEditAction.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t("admin.reject", lang)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="p-4 border-b border-green-100 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("action.search", lang)}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-200 bg-green-50/50 text-green-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    showFilters ? "bg-green-800 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {t("action.filter", lang)}
                </button>
                <button
                  onClick={handleExport}
                  disabled={farmers.length === 0}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {t("action.export", lang)}
                </button>
              </div>
            </div>

            {/* Filter Row */}
            {showFilters && (
              <div className="flex flex-wrap gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">{t("field.district", lang)}</label>
                  <input
                    type="text"
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    placeholder={lang === "en" ? "Filter district..." : "జిల్లా ఫిల్టర్..."}
                    className="px-3 py-1.5 rounded-lg border border-green-200 text-sm w-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">{lang === "en" ? "Crop" : "పంట"}</label>
                  <input
                    type="text"
                    value={cropFilter}
                    onChange={(e) => setCropFilter(e.target.value)}
                    placeholder={lang === "en" ? "Filter crop..." : "పంట ఫిల్టర్..."}
                    className="px-3 py-1.5 rounded-lg border border-green-200 text-sm w-40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">{t("field.landType", lang)}</label>
                  <select
                    value={landTypeFilter}
                    onChange={(e) => setLandTypeFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-green-200 text-sm w-40"
                  >
                    <option value="">All</option>
                    <option value="dry">Dry</option>
                    <option value="wet">Wet</option>
                    <option value="irrigated">Irrigated</option>
                  </select>
                </div>
                <button
                  onClick={() => { setDistrictFilter(""); setCropFilter(""); setLandTypeFilter(""); }}
                  className="self-end px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-green-50 border-b border-green-100">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wide cursor-pointer hover:bg-green-100 transition whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="w-3 h-3" />,
                            desc: <ChevronDown className="w-3 h-3" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                      {lang === "en" ? "No farmers found" : "రైతులు కనుగొనబడలేదు"}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedFarmer(row.original as unknown as FarmerLike)}
                      className="border-b border-green-50 hover:bg-green-50/50 transition cursor-pointer"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-green-900 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-green-100 flex items-center justify-between text-sm">
            <span className="text-green-600">
              {lang === "en" ? "Showing" : "చూపిస్తున్నది"} {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} {lang === "en" ? "of" : "/"} {filteredData.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-lg hover:bg-green-100 disabled:opacity-30 text-green-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-green-800 font-medium">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-lg hover:bg-green-100 disabled:opacity-30 text-green-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedFarmer && (
        <FarmerDetailModal
          farmer={selectedFarmer}
          initialLang={lang}
          onClose={() => setSelectedFarmer(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    teal: "bg-teal-50 border-teal-200 text-teal-800",
  };

  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2 opacity-70">{icon}<span className="text-xs font-medium">{label}</span></div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
