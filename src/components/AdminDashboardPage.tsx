import React, { useState, useEffect } from "react";
import { Booking, ExpenseItem, WeeklyDayData, AdminStats } from "../types";
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  Phone,
  BarChart3,
  PieChart,
  Tag,
  Activity,
} from "lucide-react";

interface AdminDashboardPageProps {
  onNavigateHome?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateHome }) => {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Tab state: "bookings" | "financials"
  const [activeView, setActiveView] = useState<"bookings" | "financials">("bookings");

  // Booking filters
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Expense form state
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseItem["category"]>("Supplies");
  const [expensePrice, setExpensePrice] = useState("");
  const [expensePurchased, setExpensePurchased] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "bae109" || passcode === "admin" || passcode === "1234") {
      setAuthenticated(true);
    } else {
      alert("Incorrect passcode. Try 'bae109'");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resB, resSt, resE] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/stats"),
        fetch("/api/expenses"),
      ]);

      const dataB = await resB.json();
      const dataSt = await resSt.json();
      const dataE = await resE.json();

      if (dataB.success) setBookings(dataB.bookings);
      if (dataSt.success) setStats(dataSt.stats);
      if (dataE.success) setExpenses(dataE.expenses);
    } catch (err) {
      console.error("Error loading admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchAdminData();
    }
  }, [authenticated]);

  // Handle Accept or Decline action
  const handleUpdateBookingStatus = async (id: string, newStatus: "Confirmed" | "Cancelled") => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.error || "Failed to update booking status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Network error updating booking status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Expense handlers
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expensePrice) return;

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: expenseName,
          category: expenseCategory,
          price: Number(expensePrice),
          isPurchased: expensePurchased,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExpenseName("");
        setExpensePrice("");
        setExpensePurchased(false);
        fetchAdminData();
      }
    } catch (err) {
      alert("Error adding expense item");
    }
  };

  const handleToggleExpense = async (id: string, currentPurchased: boolean) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPurchased: !currentPurchased }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert("Error updating expense item");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to remove this expense item?")) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert("Error deleting expense item");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const statusMatch =
      statusFilter === "all"
        ? true
        : statusFilter === "pending"
        ? b.status === "Pending"
        : statusFilter === "confirmed"
        ? b.status === "Confirmed" || b.status === "Completed"
        : b.status === "Cancelled";

    const searchMatch =
      !searchQuery ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const acceptedBookings = bookings.filter((b) => b.status === "Confirmed" || b.status === "Completed");
  const acceptedCount = acceptedBookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // Financial metrics
  const totalRevenue = stats?.totalRevenueETB ?? acceptedBookings.reduce((acc, b) => acc + (b.price || 0), 0);
  const thisMonthRevenue = stats?.thisMonthRevenueETB ?? 0;
  const thisWeekRevenue = stats?.thisWeekRevenueETB ?? 0;
  const todayRevenue = stats?.todayRevenueETB ?? 0;

  const totalSpentExpenses = stats?.totalExpensesETB ?? expenses.filter((e) => e.isPurchased).reduce((acc, e) => acc + e.price, 0);
  const plannedExpenses = stats?.plannedExpensesETB ?? expenses.filter((e) => !e.isPurchased).reduce((acc, e) => acc + e.price, 0);
  const netProfit = stats?.netProfitETB ?? (totalRevenue - totalSpentExpenses);

  const weeklyData: WeeklyDayData[] = stats?.weeklyBreakdown || [
    { day: "Mon", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Tue", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Wed", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Thu", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Fri", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Sat", fullDate: "", revenue: 0, bookingCount: 0 },
    { day: "Sun", fullDate: "", revenue: 0, bookingCount: 0 },
  ];

  const maxWeeklyRevenue = Math.max(...weeklyData.map((d) => d.revenue), 1000);

  // SVG Smooth Cubic Spline Wave Graph Calculation
  const graphPoints = weeklyData.map((item, idx) => {
    const x = 50 + idx * 100;
    const ratio = item.revenue / maxWeeklyRevenue;
    const y = 145 - ratio * 100; // Y from 45 to 145
    return { x, y, ...item };
  });

  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(graphPoints);
  const areaPath = linePath ? `${linePath} L 650,170 L 50,170 Z` : "";

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F3EBDD] font-sans selection:bg-[#C7A45A] selection:text-[#0A0A09] relative pb-24">
      
      {/* Top Bar Header */}
      <header className="border-b border-[#F3EBDD]/15 bg-[#0E0E0C]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (onNavigateHome) onNavigateHome();
                else window.location.href = "/";
              }}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A9A399] hover:text-[#C7A45A] transition-colors py-1.5 px-3 border border-[#F3EBDD]/15 rounded-sm bg-[#0A0A09]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Studio</span>
            </button>

            <div className="h-4 w-[1px] bg-[#F3EBDD]/15 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 bg-[#0A0A09] hidden sm:block">
                <img src="/house_of_bae_logo.png" alt="House of Bae" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <div className="editorial-label text-[9px] tracking-[0.25em] text-[#C7A45A]">House of Bae Atelier</div>
                <h1 className="font-serif text-lg sm:text-xl text-[#F3EBDD] font-normal leading-none mt-0.5">
                  Studio Admin Dashboard
                </h1>
              </div>
            </div>
          </div>

          {authenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="p-2 border border-[#F3EBDD]/20 text-[#A9A399] hover:text-[#C7A45A] hover:border-[#C7A45A] transition-colors rounded-sm bg-[#0A0A09]"
                title="Refresh Studio Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C7A45A]" : ""}`} />
              </button>

              <button
                onClick={() => setAuthenticated(false)}
                className="text-xs text-[#A9A399] hover:text-red-400 px-3 py-2 border border-[#F3EBDD]/15 rounded-sm transition-colors bg-[#0A0A09]"
              >
                Lock Portal
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {!authenticated ? (
          /* Passcode Screen */
          <div className="max-w-md mx-auto my-16 p-8 bg-[#11110F] border border-[#F3EBDD]/15 rounded-sm shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C7A45A] p-1 mx-auto bg-[#0A0A09] shadow-[0_0_20px_rgba(199,164,90,0.25)]">
              <img src="/house_of_bae_logo.png" alt="House of Bae" className="w-full h-full object-cover rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="editorial-label text-[10px] tracking-[0.3em] text-[#C7A45A]">Restricted Staff Portal</div>
              <h2 className="font-serif text-3xl text-[#F3EBDD] font-normal">Studio Admin Login</h2>
              <p className="text-xs text-[#A9A399] font-light mt-2">
                Enter your staff passcode to review appointments, manage accept/decline statuses, and view studio revenue.
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4 pt-2">
              <input
                type="password"
                placeholder="Passcode (Default: bae109)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#0A0A09] border border-[#F3EBDD]/20 text-center text-[#F3EBDD] px-4 py-3 text-sm focus:outline-none focus:border-[#C7A45A] transition-colors rounded-sm tracking-widest"
              />
              <button
                type="submit"
                className="w-full bg-[#C7A45A] text-[#0A0A09] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D9B86C] hover:shadow-[0_0_20px_rgba(199,164,90,0.3)] transition-all rounded-sm"
              >
                Access Dashboard →
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-8 animate-fade-in">
            
            {/* View Selection Tabs */}
            <div className="flex border-b border-[#F3EBDD]/15 pb-4 items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#11110F] border border-[#F3EBDD]/15 p-1 rounded-sm">
                <button
                  onClick={() => setActiveView("bookings")}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all flex items-center gap-2.5 ${
                    activeView === "bookings"
                      ? "bg-[#C7A45A] text-[#0A0A09] shadow-md font-semibold"
                      : "text-[#A9A399] hover:text-[#F3EBDD]"
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#C7A45A] fill-[#C7A45A]/20" />
                  <span>Appointments ({pendingCount} pending)</span>
                </button>

                <button
                  onClick={() => setActiveView("financials")}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-medium rounded-sm transition-all flex items-center gap-2.5 ${
                    activeView === "financials"
                      ? "bg-[#C7A45A] text-[#0A0A09] shadow-md font-semibold"
                      : "text-[#A9A399] hover:text-[#F3EBDD]"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-[#C7A45A]" />
                  <span>Revenue Suite & Wave Graph</span>
                </button>
              </div>

              <div className="text-xs text-[#C7A45A] font-serif italic hidden md:block">
                House of Bae Atelier · Studio Control Room
              </div>
            </div>

            {/* TAB VIEW 1: APPOINTMENTS MANAGER */}
            {activeView === "bookings" ? (
              <div className="space-y-8">
                
                {/* APPOINTMENTS TABLE LIST */}
                <div className="bg-[#11110F] border border-[#F3EBDD]/15 p-6 rounded-sm shadow-xl space-y-6">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#F3EBDD]/10 pb-5">
                    <div>
                      <div className="editorial-label text-[10px] tracking-[0.25em] text-[#C7A45A]">Client Reservations</div>
                      <h3 className="font-serif text-2xl text-[#F3EBDD] font-normal mt-0.5">
                        Accept or Decline Appointments
                      </h3>
                    </div>

                    {/* Search & Status Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#A9A399] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search client, phone, ref..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#C7A45A] rounded-sm"
                        />
                      </div>

                      <div className="flex items-center bg-[#0A0A09] border border-[#F3EBDD]/15 rounded-sm p-1 gap-1">
                        <button
                          onClick={() => setStatusFilter("all")}
                          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-sm transition-all ${
                            statusFilter === "all" ? "bg-[#C7A45A] text-[#0A0A09]" : "text-[#A9A399] hover:text-[#F3EBDD]"
                          }`}
                        >
                          All ({bookings.length})
                        </button>

                        <button
                          onClick={() => setStatusFilter("pending")}
                          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-sm transition-all ${
                            statusFilter === "pending" ? "bg-amber-500 text-[#0A0A09]" : "text-[#A9A399] hover:text-[#F3EBDD]"
                          }`}
                        >
                          Pending ({pendingCount})
                        </button>

                        <button
                          onClick={() => setStatusFilter("confirmed")}
                          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-sm transition-all ${
                            statusFilter === "confirmed" ? "bg-emerald-600 text-white" : "text-[#A9A399] hover:text-[#F3EBDD]"
                          }`}
                        >
                          Accepted ({acceptedCount})
                        </button>

                        <button
                          onClick={() => setStatusFilter("cancelled")}
                          className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-sm transition-all ${
                            statusFilter === "cancelled" ? "bg-red-700 text-white" : "text-[#A9A399] hover:text-[#F3EBDD]"
                          }`}
                        >
                          Declined ({bookings.filter((b) => b.status === "Cancelled").length})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  {filteredBookings.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#A9A399] space-y-2 font-light">
                      <p className="text-base font-serif text-[#F3EBDD]">No matching reservations found</p>
                      <p>Try clearing your search term or choosing a different filter tab.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#F3EBDD]/15 text-[#A9A399] uppercase tracking-[0.18em] text-[10px]">
                            <th className="py-3 px-4 font-light flex items-center gap-1.5 text-[#C7A45A]">
                              <Calendar className="w-3.5 h-3.5 text-[#C7A45A] fill-[#C7A45A]/20" /> Ref & Time
                            </th>
                            <th className="py-3 px-4 font-light">Client Info</th>
                            <th className="py-3 px-4 font-light">Service & Fee</th>
                            <th className="py-3 px-4 font-light">Nail Shape & Notes</th>
                            <th className="py-3 px-4 font-light">Status</th>
                            <th className="py-3 px-4 font-light text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3EBDD]/10">
                          {filteredBookings.map((b) => {
                            const isPending = b.status === "Pending";
                            const isAccepted = b.status === "Confirmed" || b.status === "Completed";
                            const isDeclined = b.status === "Cancelled";
                            const isUpdating = actionLoadingId === b.id;

                            return (
                              <tr key={b.id} className="hover:bg-[#0A0A09]/50 transition-colors">
                                <td className="py-4 px-4 align-top">
                                  <div className="font-mono text-sm text-[#C7A45A] font-semibold">{b.referenceCode}</div>
                                  <div className="text-[#F3EBDD] font-medium mt-1 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-[#C7A45A]" />
                                    <span>{b.date}</span>
                                  </div>
                                  <div className="text-[#A9A399] text-[11px] font-mono mt-0.5">{b.timeSlot}</div>
                                </td>

                                <td className="py-4 px-4 align-top">
                                  <div className="font-serif text-sm text-[#F3EBDD] font-medium">{b.customerName}</div>
                                  <a
                                    href={`tel:${b.phone}`}
                                    className="inline-flex items-center gap-1 text-[#C7A45A] hover:underline text-[11px] mt-1 font-mono"
                                  >
                                    <Phone className="w-3 h-3" /> {b.phone}
                                  </a>
                                </td>

                                <td className="py-4 px-4 align-top">
                                  <div className="text-[#F3EBDD] font-medium">{b.serviceName}</div>
                                  <div className="font-serif text-sm text-[#C7A45A] mt-1 font-normal">
                                    {b.price.toLocaleString()} ETB
                                  </div>
                                </td>

                                <td className="py-4 px-4 align-top max-w-xs">
                                  <div className="text-[#F3EBDD]">
                                    Shape: <span className="text-[#C7A45A]">{b.nailShape || "Almond"}</span>
                                  </div>
                                  {b.notes && (
                                    <div className="text-[#A9A399] italic mt-1 text-[11px] line-clamp-2">
                                      "{b.notes}"
                                    </div>
                                  )}
                                </td>

                                <td className="py-4 px-4 align-top">
                                  {isPending && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-wider font-medium">
                                      <Clock className="w-3 h-3" /> Pending
                                    </span>
                                  )}
                                  {isAccepted && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-wider font-medium">
                                      <CheckCircle className="w-3 h-3" /> Accepted
                                    </span>
                                  )}
                                  {isDeclined && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-wider font-medium">
                                      <XCircle className="w-3 h-3" /> Declined
                                    </span>
                                  )}
                                </td>

                                <td className="py-4 px-4 align-top text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      disabled={isUpdating || isAccepted}
                                      onClick={() => handleUpdateBookingStatus(b.id, "Confirmed")}
                                      className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-1.5 ${
                                        isAccepted
                                          ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 opacity-80 cursor-default"
                                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 disabled:opacity-50"
                                      }`}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>{isAccepted ? "Accepted" : "Accept"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      disabled={isUpdating || isDeclined}
                                      onClick={() => handleUpdateBookingStatus(b.id, "Cancelled")}
                                      className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-1.5 ${
                                        isDeclined
                                          ? "bg-red-950/40 border border-red-500/40 text-red-300 opacity-80 cursor-default"
                                          : "bg-[#1A1A18] hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white transition-colors disabled:opacity-50"
                                      }`}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>{isDeclined ? "Declined" : "Decline"}</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              /* TAB VIEW 2: REVENUE SUITE WITH SMOOTH WAVE GRAPH & EXPENSES CALCULATOR */
              <div className="space-y-8">
                
                {/* Financial Stat Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-[#11110F] border border-[#C7A45A]/40 p-5 rounded-sm relative overflow-hidden group shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[10px] tracking-[0.2em] text-[#C7A45A]">All-Time Revenue</span>
                      <div className="w-8 h-8 rounded-full bg-[#C7A45A]/10 border border-[#C7A45A]/30 flex items-center justify-center text-[#C7A45A]">
                        <DollarSign className="w-4 h-4 text-[#C7A45A]" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-serif text-2xl sm:text-3xl text-[#F3EBDD]">
                        {totalRevenue.toLocaleString()} <span className="text-sm text-[#C7A45A]">ETB</span>
                      </div>
                      <p className="text-[11px] text-[#A9A399] mt-1 font-light">
                        From {acceptedCount} accepted bookings
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#11110F] border border-[#F3EBDD]/15 p-5 rounded-sm relative overflow-hidden group shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[10px] tracking-[0.2em] text-[#A9A399]">This Month</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-serif text-2xl sm:text-3xl text-emerald-400">
                        {thisMonthRevenue.toLocaleString()} <span className="text-sm text-emerald-500">ETB</span>
                      </div>
                      <p className="text-[11px] text-[#A9A399] mt-1 font-light">Current calendar month</p>
                    </div>
                  </div>

                  <div className="bg-[#11110F] border border-[#F3EBDD]/15 p-5 rounded-sm relative overflow-hidden group shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[10px] tracking-[0.2em] text-[#A9A399]">This Week</span>
                      <div className="w-8 h-8 rounded-full bg-[#C7A45A]/10 border border-[#C7A45A]/30 flex items-center justify-center text-[#C7A45A]">
                        <Activity className="w-4 h-4 text-[#C7A45A]" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-serif text-2xl sm:text-3xl text-[#F3EBDD]">
                        {thisWeekRevenue.toLocaleString()} <span className="text-sm text-[#C7A45A]">ETB</span>
                      </div>
                      <p className="text-[11px] text-[#A9A399] mt-1 font-light">Mon – Sun current week</p>
                    </div>
                  </div>

                  <div className="bg-[#11110F] border border-emerald-500/30 p-5 rounded-sm relative overflow-hidden group shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="editorial-label text-[10px] tracking-[0.2em] text-emerald-400">Net Profit</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-serif text-2xl sm:text-3xl text-emerald-400 font-semibold">
                        {netProfit.toLocaleString()} <span className="text-sm">ETB</span>
                      </div>
                      <p className="text-[11px] text-[#A9A399] mt-1 font-light">
                        Gross ({totalRevenue.toLocaleString()}) − Supplies ({totalSpentExpenses.toLocaleString()})
                      </p>
                    </div>
                  </div>
                </div>

                {/* REVENUE WAVE GRAPH (SMOOTH SWING GRAPH) */}
                <div className="bg-[#11110F] border border-[#C7A45A]/35 p-6 rounded-sm shadow-2xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3EBDD]/10 pb-4 gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] font-medium text-[#C7A45A]">
                        <Activity className="w-3.5 h-3.5 text-[#C7A45A]" />
                        <span>Weekly Revenue Curve</span>
                      </div>
                      <h3 className="font-serif text-2xl text-[#F3EBDD] font-normal mt-0.5">
                        Earnings Wave Graph (Mon – Sun)
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#A9A399]">
                      <span className="flex items-center gap-1.5 font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C7A45A] shadow-[0_0_8px_#C7A45A]" />
                        Weekly Total: <strong className="text-[#C7A45A]">{thisWeekRevenue.toLocaleString()} ETB</strong>
                      </span>
                    </div>
                  </div>

                  {/* SVG Spline Wave Curve Graph */}
                  <div className="relative w-full pt-4 pb-2">
                    <svg viewBox="0 0 700 200" className="w-full h-48 overflow-visible">
                      <defs>
                        <linearGradient id="revenueWaveGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C7A45A" stopOpacity="0.45" />
                          <stop offset="60%" stopColor="#C7A45A" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#C7A45A" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      <line x1="50" y1="45" x2="650" y2="45" stroke="#F3EBDD" strokeOpacity="0.06" strokeDasharray="4 4" />
                      <line x1="50" y1="95" x2="650" y2="95" stroke="#F3EBDD" strokeOpacity="0.06" strokeDasharray="4 4" />
                      <line x1="50" y1="145" x2="650" y2="145" stroke="#F3EBDD" strokeOpacity="0.08" />

                      {areaPath && <path d={areaPath} fill="url(#revenueWaveGradient)" />}

                      {linePath && (
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#C7A45A"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#glowGold)"
                          className="transition-all duration-700"
                        />
                      )}

                      {graphPoints.map((pt) => {
                        const isToday = pt.fullDate === new Date().toISOString().split("T")[0];

                        return (
                          <g key={pt.day} className="group cursor-pointer">
                            <line
                              x1={pt.x}
                              y1={pt.y}
                              x2={pt.x}
                              y2={165}
                              stroke="#C7A45A"
                              strokeOpacity="0.15"
                              strokeDasharray="2 2"
                              className="group-hover:stroke-opacity-50 transition-opacity"
                            />

                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isToday ? "7" : "5"}
                              fill="#0A0A09"
                              stroke="#C7A45A"
                              strokeWidth="2.5"
                              className="group-hover:scale-125 transition-transform"
                            />

                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="2.5"
                              fill={isToday ? "#F3EBDD" : "#C7A45A"}
                            />

                            <text
                              x={pt.x}
                              y="188"
                              textAnchor="middle"
                              className={`text-[11px] font-mono uppercase tracking-widest ${
                                isToday ? "fill-[#C7A45A] font-bold" : "fill-[#A9A399]"
                              }`}
                            >
                              {pt.day}
                            </text>

                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              <rect
                                x={pt.x - 55}
                                y={Math.max(pt.y - 42, 5)}
                                width="110"
                                height="32"
                                rx="3"
                                fill="#0A0A09"
                                stroke="#C7A45A"
                                strokeWidth="1"
                              />
                              <text
                                x={pt.x}
                                y={Math.max(pt.y - 28, 19)}
                                textAnchor="middle"
                                fill="#C7A45A"
                                fontSize="11"
                                fontWeight="bold"
                                fontFamily="monospace"
                              >
                                {pt.revenue.toLocaleString()} ETB
                              </text>
                              <text
                                x={pt.x}
                                y={Math.max(pt.y - 15, 32)}
                                textAnchor="middle"
                                fill="#A9A399"
                                fontSize="9"
                                fontFamily="sans-serif"
                              >
                                {pt.bookingCount} bookings ({pt.day})
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* STUDIO EXPENSES & PURCHASES CALCULATOR */}
                <div className="space-y-6">
                  
                  {/* Financial Calculator Cards */}
                  <div className="bg-[#11110F] border border-[#C7A45A]/40 p-6 rounded-sm shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F3EBDD]/10 pb-4 gap-2">
                      <div>
                        <div className="editorial-label text-[10px] tracking-[0.25em] text-[#C7A45A]">Financial Calculator</div>
                        <h3 className="font-serif text-2xl text-[#F3EBDD] font-normal mt-0.5">
                          Studio Supplies & Purchases Budget
                        </h3>
                      </div>
                      <div className="text-xs text-[#A9A399] font-light">
                        Track supplies to buy, check off bought items, and auto-calculate net studio profit.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-2">
                      <div className="p-4 bg-[#0A0A09] border border-[#F3EBDD]/15 rounded-sm">
                        <div className="text-[10px] uppercase tracking-wider text-[#A9A399]">Purchased Supplies (Spent)</div>
                        <div className="font-serif text-2xl text-red-400 mt-1 font-medium">
                          {totalSpentExpenses.toLocaleString()} ETB
                        </div>
                      </div>

                      <div className="p-4 bg-[#0A0A09] border border-amber-500/30 rounded-sm">
                        <div className="text-[10px] uppercase tracking-wider text-amber-400">Planned Purchases (To Buy)</div>
                        <div className="font-serif text-2xl text-amber-400 mt-1 font-medium">
                          {plannedExpenses.toLocaleString()} ETB
                        </div>
                      </div>

                      <div className="p-4 bg-[#0A0A09] border border-emerald-500/40 rounded-sm">
                        <div className="text-[10px] uppercase tracking-wider text-emerald-400">Net Studio Profit</div>
                        <div className="font-serif text-2xl text-emerald-400 mt-1 font-semibold">
                          {netProfit.toLocaleString()} ETB
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Expense Form */}
                  <div className="bg-[#11110F] border border-[#F3EBDD]/15 p-6 rounded-sm shadow-xl space-y-4">
                    <div className="editorial-label text-[10px] tracking-[0.2em] text-[#C7A45A]">
                      Add New Supply or Equipment Item
                    </div>

                    <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] tracking-wider uppercase text-[#A9A399] block font-light">
                          Item / Supply Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chrome Powders Set, UV Lamps, Acetone..."
                          value={expenseName}
                          onChange={(e) => setExpenseName(e.target.value)}
                          className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A] rounded-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] tracking-wider uppercase text-[#A9A399] block font-light">
                          Category
                        </label>
                        <select
                          value={expenseCategory}
                          onChange={(e) => setExpenseCategory(e.target.value as any)}
                          className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A] rounded-sm"
                        >
                          <option value="Supplies">Supplies</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Tools">Tools</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Rent/Utilities">Rent / Utilities</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] tracking-wider uppercase text-[#A9A399] block font-light">
                          Estimated Price (ETB) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          placeholder="e.g. 1200"
                          value={expensePrice}
                          onChange={(e) => setExpensePrice(e.target.value)}
                          className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A] rounded-sm"
                        />
                      </div>

                      <div className="sm:col-span-4 flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs text-[#F3EBDD] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={expensePurchased}
                            onChange={(e) => setExpensePurchased(e.target.checked)}
                            className="accent-[#C7A45A] w-4 h-4"
                          />
                          <span>Mark as already purchased/bought</span>
                        </label>

                        <button
                          type="submit"
                          className="bg-[#C7A45A] text-[#0A0A09] px-6 py-2.5 text-xs uppercase font-semibold tracking-wider hover:bg-[#D9B86C] transition-all rounded-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Item to Calculator</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Expense Checklist Table */}
                  <div className="bg-[#11110F] border border-[#F3EBDD]/15 p-6 rounded-sm shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-[#F3EBDD]/10 pb-4">
                      <div>
                        <div className="editorial-label text-[10px] tracking-[0.25em] text-[#C7A45A]">Shopping Checklist</div>
                        <h4 className="font-serif text-xl text-[#F3EBDD]">Items & Studio Supplies List</h4>
                      </div>

                      <div className="text-xs text-[#A9A399] font-mono">
                        {expenses.filter((e) => e.isPurchased).length} of {expenses.length} items purchased
                      </div>
                    </div>

                    {expenses.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#A9A399]">
                        No items added yet. Use the form above to list equipment and supplies to buy.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#F3EBDD]/15 text-[#A9A399] uppercase tracking-wider text-[10px]">
                              <th className="py-3 px-4 font-light">Status</th>
                              <th className="py-3 px-4 font-light">Item Name</th>
                              <th className="py-3 px-4 font-light">Category</th>
                              <th className="py-3 px-4 font-light">Price (ETB)</th>
                              <th className="py-3 px-4 font-light text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F3EBDD]/10">
                            {expenses.map((e) => (
                              <tr key={e.id} className="hover:bg-[#0A0A09]/50 transition-colors">
                                <td className="py-3.5 px-4 align-middle">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleExpense(e.id, e.isPurchased)}
                                    className="flex items-center gap-2 text-xs focus:outline-none"
                                  >
                                    {e.isPurchased ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-amber-400" />
                                    )}
                                    <span className={e.isPurchased ? "text-emerald-400 font-medium" : "text-amber-400 font-light"}>
                                      {e.isPurchased ? "Bought" : "To Buy"}
                                    </span>
                                  </button>
                                </td>

                                <td className="py-3.5 px-4 align-middle">
                                  <span className={`font-medium ${e.isPurchased ? "text-[#FAF6EF] line-through opacity-75" : "text-[#FAF6EF]"}`}>
                                    {e.name}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 align-middle">
                                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#0A0A09] border border-[#F3EBDD]/15 text-[10px] text-[#A9A399]">
                                    {e.category}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 align-middle font-serif text-sm text-[#C7A45A]">
                                  {e.price.toLocaleString()} ETB
                                </td>

                                <td className="py-3.5 px-4 align-middle text-right">
                                  <button
                                    onClick={() => handleDeleteExpense(e.id)}
                                    className="text-[#A9A399] hover:text-red-400 p-1 transition-colors"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
};
