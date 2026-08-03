import React, { useState } from "react";
import { Booking } from "../types";
import { Search, X, Calendar, Clock, CheckCircle, AlertCircle, Phone } from "lucide-react";

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/lookup?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.bookings);
        if (data.bookings.length === 0) {
          setError("No appointments found matching this reference code or phone number.");
        }
      } else {
        setError(data.error || "Error searching appointments");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
      case "Completed":
        return "bg-blue-950/80 text-blue-300 border-blue-500/40";
      case "Cancelled":
        return "bg-red-950/80 text-red-300 border-red-500/40";
      default:
        return "bg-amber-950/80 text-amber-300 border-amber-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0e0b0a]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171211] border border-[#c7a252]/40 max-w-lg w-full rounded-sm p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#f7f1e6]/60 hover:text-[#e8cd8a]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="eyebrow text-[10px]">Client Lookup</div>
          <h3 className="font-serif-display text-2xl italic text-[#f7f1e6] mt-1">
            Check Your Appointment
          </h3>
          <p className="text-xs text-[#f7f1e6]/60 font-light mt-1">
            Enter your Phone Number (e.g. 0911234567) or Reference Code (e.g. HOB-1042).
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Reference code or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#0e0b0a] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#c7a252] text-[#0e0b0a] px-4 py-2.5 text-xs font-medium uppercase tracking-wider rounded hover:bg-[#e8cd8a] transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {loading && <div className="text-center text-xs text-[#c7a252] py-4">Searching database...</div>}

        {error && (
          <div className="p-3 bg-red-950/30 border border-red-500/30 rounded text-red-200 text-xs text-center mb-4">
            {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {results.map((b) => (
              <div
                key={b.id}
                className="bg-[#0e0b0a] border border-[#c7a252]/20 p-4 rounded text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[#e8cd8a] font-medium">{b.referenceCode}</span>
                  <span
                    className={`px-2 py-0.5 border rounded-full text-[10px] font-medium uppercase ${getStatusColor(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="font-serif-display text-sm text-[#f7f1e6] italic">
                  {b.serviceName}
                </div>

                <div className="flex justify-between text-[#f7f1e6]/70 pt-1 border-t border-[#c7a252]/10">
                  <span>
                    📅 {b.date} at {b.timeSlot}
                  </span>
                  <span className="text-[#e8cd8a]">{b.price.toLocaleString()} ETB</span>
                </div>

                <div className="text-[11px] text-[#f7f1e6]/50">
                  Client: {b.customerName} ({b.phone}) · {b.nailShape} ({b.nailLength})
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-[#c7a252]/20 text-center text-[11px] text-[#f7f1e6]/50">
          Need to reschedule? Call us directly at <span className="text-[#e8cd8a]">0926 795 498</span>.
        </div>
      </div>
    </div>
  );
};
