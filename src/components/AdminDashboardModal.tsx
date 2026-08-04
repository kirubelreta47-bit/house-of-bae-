import React, { useState, useEffect } from "react";
import { Booking, Service, InquiryMessage, AdminStats } from "../types";
import {
  X,
  ShieldCheck,
  Calendar,
  DollarSign,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshServices: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onRefreshServices,
}) => {
  const [passcode, setPasscode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "analytics" | "messages">("bookings");

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<InquiryMessage[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Filter state for bookings
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState<any>("manicure");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("45");
  const [newServiceDesc, setNewServiceDesc] = useState("");

  const handleClose = () => {
    setPasscode("");
    setAuthenticated(false);
    onClose();
  };

  if (!isOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "bae109" || passcode === "admin" || passcode === "1234") {
      setAuthenticated(true);
      fetchAdminData();
    } else {
      alert("Incorrect passcode. Try 'bae109'");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resB, resS, resM, resSt] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/services"),
        fetch("/api/messages"),
        fetch("/api/stats"),
      ]);

      const dataB = await resB.json();
      const dataS = await resS.json();
      const dataM = await resM.json();
      const dataSt = await resSt.json();

      if (dataB.success) setBookings(dataB.bookings);
      if (dataS.success) setServices(dataS.services);
      if (dataM.success) setMessages(dataM.messages);
      if (dataSt.success) setStats(dataSt.stats);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newServiceName,
          category: newServiceCategory,
          price: Number(newServicePrice),
          durationMinutes: Number(newServiceDuration),
          description: newServiceDesc,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewServiceName("");
        setNewServicePrice("");
        setNewServiceDesc("");
        fetchAdminData();
        onRefreshServices();
      }
    } catch (err) {
      alert("Error adding service");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        onRefreshServices();
      }
    } catch (err) {
      alert("Error deleting service");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0b0a]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171211] border border-[#c7a252] max-w-4xl w-full rounded-sm p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#f7f1e6]/60 hover:text-[#e8cd8a]"
        >
          <X className="w-6 h-6" />
        </button>

        {!authenticated ? (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#c7a252]/20 border border-[#c7a252] rounded-full flex items-center justify-center mx-auto text-[#e8cd8a]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <div className="eyebrow text-xs">Studio Owner & Staff</div>
              <h3 className="font-serif-display text-3xl italic text-[#f7f1e6] mt-1">
                Studio Management Portal
              </h3>
              <p className="text-xs text-[#f7f1e6]/60 mt-2 font-light">
                Please enter your staff passcode to access appointments, revenue metrics, and menu configuration.
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="password"
                placeholder="Passcode (Default: bae109)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#0e0b0a] border border-[#c7a252]/40 text-center text-[#f7f1e6] px-4 py-3 rounded text-sm focus:outline-none focus:border-[#c7a252]"
              />
              <button
                type="submit"
                className="w-full bg-[#c7a252] text-[#0e0b0a] py-3 text-xs uppercase font-medium tracking-widest rounded hover:bg-[#e8cd8a]"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#c7a252]/20 pb-4 gap-4">
              <div>
                <div className="eyebrow text-[10px]">House of Bae Staff Portal</div>
                <h2 className="font-serif-display text-2xl sm:text-3xl italic text-[#f7f1e6]">
                  Studio Operations
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAdminData}
                  className="p-2 border border-[#c7a252]/30 text-[#e8cd8a] rounded hover:bg-[#c7a252]/10"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={() => setAuthenticated(false)}
                  className="text-xs text-[#f7f1e6]/50 hover:text-red-400 px-3 py-2 border border-red-950 rounded"
                >
                  Lock Portal
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#c7a252]/10 pb-2">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded font-medium transition-colors ${
                  activeTab === "bookings"
                    ? "bg-[#c7a252] text-[#0e0b0a]"
                    : "text-[#f7f1e6]/70 hover:text-[#e8cd8a]"
                }`}
              >
                Appointments ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded font-medium transition-colors ${
                  activeTab === "services"
                    ? "bg-[#c7a252] text-[#0e0b0a]"
                    : "text-[#f7f1e6]/70 hover:text-[#e8cd8a]"
                }`}
              >
                Menu & Pricing ({services.length})
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded font-medium transition-colors ${
                  activeTab === "analytics"
                    ? "bg-[#c7a252] text-[#0e0b0a]"
                    : "text-[#f7f1e6]/70 hover:text-[#e8cd8a]"
                }`}
              >
                Revenue & Stats
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded font-medium transition-colors ${
                  activeTab === "messages"
                    ? "bg-[#c7a252] text-[#0e0b0a]"
                    : "text-[#f7f1e6]/70 hover:text-[#e8cd8a]"
                }`}
              >
                Messages ({messages.length})
              </button>
            </div>

            {/* TAB 1: BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Search className="w-4 h-4 text-[#c7a252]" />
                    <input
                      type="text"
                      placeholder="Search client, phone or ref..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#0e0b0a] border border-[#c7a252]/20 text-[#f7f1e6] px-3 py-1.5 text-xs rounded focus:outline-none focus:border-[#c7a252] w-full sm:w-64"
                    />
                  </div>

                  <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
                    {["all", "Pending", "Confirmed", "Completed", "Cancelled"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded border ${
                          statusFilter === st
                            ? "border-[#c7a252] text-[#e8cd8a] bg-[#c7a252]/10"
                            : "border-transparent text-[#f7f1e6]/50"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-[#c7a252]/10 border-y border-[#c7a252]/10 max-h-96 overflow-y-auto">
                  {filteredBookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#f7f1e6]/40">No bookings match your filter.</div>
                  ) : (
                    filteredBookings.map((b) => (
                      <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[#e8cd8a] font-medium">{b.referenceCode}</span>
                            <span className="text-[#f7f1e6] font-medium text-sm">{b.customerName}</span>
                            <a
                              href={`tel:${b.phone}`}
                              className="text-[#c7a252] hover:underline font-mono"
                            >
                              ({b.phone})
                            </a>
                          </div>
                          <div className="text-[#f7f1e6]/80 font-serif-display italic">
                            {b.serviceName} — <span className="text-[#e8cd8a]">{b.price.toLocaleString()} ETB</span>
                          </div>
                          <div className="text-[#f7f1e6]/60 text-[11px]">
                            📅 {b.date} at {b.timeSlot} · Shape: {b.nailShape} ({b.nailLength})
                          </div>
                          {b.notes && <div className="text-[#f7f1e6]/50 italic">Note: "{b.notes}"</div>}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-[10px] uppercase font-mono border ${
                              b.status === "Confirmed"
                                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                                : b.status === "Completed"
                                ? "bg-blue-950/60 border-blue-500/40 text-blue-300"
                                : b.status === "Cancelled"
                                ? "bg-red-950/60 border-red-500/40 text-red-300"
                                : "bg-amber-950/60 border-amber-500/40 text-amber-300"
                            }`}
                          >
                            {b.status}
                          </span>

                          <div className="flex items-center gap-1">
                            {b.status === "Pending" && (
                              <button
                                onClick={() => updateBookingStatus(b.id, "Confirmed")}
                                className="p-1.5 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 rounded"
                                title="Mark Confirmed"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {b.status !== "Completed" && (
                              <button
                                onClick={() => updateBookingStatus(b.id, "Completed")}
                                className="p-1.5 bg-blue-900/40 hover:bg-blue-800 text-blue-200 rounded"
                                title="Mark Completed"
                              >
                                Done
                              </button>
                            )}

                            {b.status !== "Cancelled" && (
                              <button
                                onClick={() => updateBookingStatus(b.id, "Cancelled")}
                                className="p-1.5 bg-red-900/40 hover:bg-red-800 text-red-200 rounded"
                                title="Cancel"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <a
                              href={`https://wa.me/251${b.phone.replace(/^0/, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-[#25D366]/20 hover:bg-[#25D366] hover:text-[#0e0b0a] text-[#25D366] rounded"
                              title="Chat WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & PRICING */}
            {activeTab === "services" && (
              <div className="space-y-6">
                {/* Add Service Form */}
                <form onSubmit={handleAddService} className="p-4 bg-[#0e0b0a] border border-[#c7a252]/20 rounded space-y-3">
                  <div className="text-xs font-serif-display italic text-[#e8cd8a]">Add New Service to Menu</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      required
                      className="bg-[#171211] border border-[#c7a252]/30 px-3 py-2 text-[#f7f1e6] rounded"
                    />
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="bg-[#171211] border border-[#c7a252]/30 px-3 py-2 text-[#f7f1e6] rounded"
                    >
                      <option value="manicure">Manicure</option>
                      <option value="extensions">Gel-X / Extensions</option>
                      <option value="art">Art & Finish</option>
                      <option value="pedicure">Pedicure</option>
                      <option value="treatment">Treatment</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price in ETB"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      required
                      className="bg-[#171211] border border-[#c7a252]/30 px-3 py-2 text-[#f7f1e6] rounded"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    className="w-full bg-[#171211] border border-[#c7a252]/30 px-3 py-2 text-xs text-[#f7f1e6] rounded"
                  />
                  <button
                    type="submit"
                    className="bg-[#c7a252] text-[#0e0b0a] px-4 py-2 text-xs font-medium uppercase tracking-wider rounded flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Service
                  </button>
                </form>

                {/* List Services */}
                <div className="divide-y divide-[#c7a252]/10 border-y border-[#c7a252]/10 max-h-72 overflow-y-auto">
                  {services.map((s) => (
                    <div key={s.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="text-[#f7f1e6] font-medium">{s.name}</div>
                        <div className="text-[#f7f1e6]/50">{s.description}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif-display text-[#e8cd8a] text-sm">{s.price.toLocaleString()} ETB</span>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STATS */}
            {activeTab === "analytics" && stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                <div className="bg-[#0e0b0a] p-4 rounded border border-[#c7a252]/20">
                  <div className="text-[10px] text-[#f7f1e6]/50 uppercase font-mono">Estimated Revenue</div>
                  <div className="font-serif-display text-2xl text-[#e8cd8a] italic mt-1">
                    {stats.totalRevenueETB.toLocaleString()} ETB
                  </div>
                </div>

                <div className="bg-[#0e0b0a] p-4 rounded border border-[#c7a252]/20">
                  <div className="text-[10px] text-[#f7f1e6]/50 uppercase font-mono">Total Bookings</div>
                  <div className="font-serif-display text-2xl text-[#f7f1e6] italic mt-1">
                    {stats.totalBookings}
                  </div>
                </div>

                <div className="bg-[#0e0b0a] p-4 rounded border border-[#c7a252]/20">
                  <div className="text-[10px] text-[#f7f1e6]/50 uppercase font-mono">Pending Review</div>
                  <div className="font-serif-display text-2xl text-amber-300 italic mt-1">
                    {stats.pendingCount}
                  </div>
                </div>

                <div className="bg-[#0e0b0a] p-4 rounded border border-[#c7a252]/20">
                  <div className="text-[10px] text-[#f7f1e6]/50 uppercase font-mono">Confirmed Sets</div>
                  <div className="font-serif-display text-2xl text-emerald-300 italic mt-1">
                    {stats.confirmedCount}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MESSAGES */}
            {activeTab === "messages" && (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#f7f1e6]/40">No messages received yet.</div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="p-4 bg-[#0e0b0a] border border-[#c7a252]/20 rounded text-xs space-y-1">
                      <div className="flex justify-between items-center text-[#e8cd8a]">
                        <span className="font-medium">{m.name} ({m.phone})</span>
                        <span className="text-[10px] text-[#f7f1e6]/40">{new Date(m.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#f7f1e6]/80 font-light">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
