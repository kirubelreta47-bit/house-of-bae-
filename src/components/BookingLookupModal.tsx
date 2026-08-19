import React, { useState } from "react";
import { Booking } from "../types";
import { Search, X } from "lucide-react";

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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "text-emerald-300 border-emerald-500/30";
      case "Completed":
        return "text-blue-300 border-blue-500/30";
      case "Cancelled":
        return "text-red-300 border-red-500/30";
      default:
        return "text-[#C7A45A] border-[#C7A45A]/30";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A09]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-[#11110F] border border-[#C7A45A]/30 max-w-lg w-full p-6 sm:p-8 relative animate-fade-in text-left shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#A9A399] hover:text-[#C7A45A] transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 bg-[#0A0A09] flex-shrink-0">
            <img
              src="/house_of_bae_logo.png"
              alt="House of Bae Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="space-y-0.5">
            <div className="editorial-label text-[9px] tracking-[0.3em] text-[#C7A45A]">
              Client Concierge · Lideta
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EBDD] font-normal leading-tight">
              Check Your Appointment
            </h3>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Reference code or phone..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-4 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#C7A45A] text-[#0A0A09] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#D9B86C] transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {loading && <div className="text-center text-xs text-[#C7A45A] py-3">Searching database...</div>}

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-200 text-xs text-center mb-4 font-light">
            {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {results.map((b) => (
              <div
                key={b.id}
                className="bg-[#0A0A09] border border-[#C7A45A]/20 p-4 text-xs space-y-2 font-light"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-wider uppercase text-[#C7A45A] font-medium">
                      {b.referenceCode}
                    </span>
                    <h4 className="font-serif text-base text-[#F3EBDD] mt-0.5 font-normal">
                      {b.serviceName}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A9A399] pt-1 border-t border-[#F3EBDD]/5">
                  <div>
                    <span className="text-[#F3EBDD]/60">Date:</span> {b.date}
                  </div>
                  <div>
                    <span className="text-[#F3EBDD]/60">Time:</span> {b.timeSlot}
                  </div>
                  <div>
                    <span className="text-[#F3EBDD]/60">Client:</span> {b.customerName}
                  </div>
                  <div>
                    <span className="text-[#F3EBDD]/60">Price:</span> {b.price.toLocaleString()} ETB
                  </div>
                </div>

                {b.nailShape && (
                  <div className="text-[10px] text-[#A9A399]/70 pt-1">
                    Style: {b.nailShape} · {b.nailLength} length
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-[#F3EBDD]/10 text-center text-[11px] text-[#A9A399]/70 font-light">
          Need assistance or rescheduling? Call us at <span className="text-[#F3EBDD]">0926 795 498</span>.
        </div>
      </div>
    </div>
  );
};
