import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, Check, Lock, Sparkles } from "lucide-react";
import { TimeSlotStatus } from "../types";

interface TimeDropdownProps {
  value: string;
  onChange: (time: string) => void;
  availableSlots: TimeSlotStatus[];
  loadingSlots?: boolean;
  theme?: "gold" | "editorial";
}

export const TimeDropdown: React.FC<TimeDropdownProps> = ({
  value,
  onChange,
  availableSlots,
  loadingSlots = false,
  theme = "gold",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const goldPrimary = theme === "gold" ? "#D4AF37" : "#C7A45A";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedSlot = availableSlots.find((s) => s.time === value);

  return (
    <div className="relative w-full text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#0a0a0a] border transition-all duration-300 rounded-sm px-4 py-3 text-left flex items-center justify-between group focus:outline-none ${
          isOpen
            ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            : value
            ? "border-[#D4AF37]/60 text-[#FAF6EF] bg-[#0e0e0e]"
            : "border-[#D4AF37]/35 text-[#FAF6EF]/70 hover:border-[#D4AF37] bg-[#0a0a0a]"
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
          <div className="flex flex-col">
            <span className={`text-xs sm:text-sm font-medium tracking-wide ${value ? "text-[#FAF6EF]" : "text-[#FAF6EF]/60"}`}>
              {loadingSlots
                ? "Checking available times..."
                : value
                ? value
                : "Select appointment time (9:00 AM – 8:00 PM)..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedSlot && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
              <Sparkles className="w-2.5 h-2.5" /> Selected
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[#D4AF37]" : ""
            }`}
          />
        </div>
      </button>

      {/* Hidden native select for accessibility / fallback form interaction */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        className="sr-only"
        aria-label="Select appointment time"
      >
        <option value="">Select time...</option>
        {availableSlots.map((s) => (
          <option key={s.time} value={s.time} disabled={!s.available}>
            {s.time} {!s.available ? "(Booked)" : ""}
          </option>
        ))}
      </select>

      {/* Luxury Black & Gold Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-[#0c0c0c] border border-[#D4AF37]/60 shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.2)] rounded-sm overflow-hidden animate-in fade-in duration-200">
          
          {/* Menu Header */}
          <div className="px-4 py-2.5 bg-[#141414] border-b border-[#D4AF37]/25 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#D4AF37]">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              <span>Available Times · 9 AM – 8 PM</span>
            </div>
            <span className="text-[10px] text-[#FAF6EF]/50 font-mono">
              {availableSlots.filter((s) => s.available).length} slots open
            </span>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
            {availableSlots.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#FAF6EF]/60">
                {loadingSlots ? "Loading time slots..." : "No time slots found."}
              </div>
            ) : (
              availableSlots.map((slot) => {
                const isSelected = value === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => {
                      if (slot.available) {
                        onChange(slot.time);
                        setIsOpen(false);
                      }
                    }}
                    className={`w-full px-4 py-2.5 rounded-sm text-xs flex items-center justify-between transition-all duration-200 ${
                      isSelected
                        ? "bg-[#D4AF37] text-[#0a0a0a] font-semibold shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
                        : slot.available
                        ? "text-[#FAF6EF] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/30 cursor-pointer"
                        : "text-[#FAF6EF]/30 bg-[#121212]/60 border border-transparent cursor-not-allowed line-through"
                    }`}
                  >
                    <span className="font-mono text-sm tracking-wide">{slot.time}</span>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold">
                          <Check className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : slot.available ? (
                        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] opacity-80 font-medium">
                          Available
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-red-400/60 no-underline font-normal">
                          <Lock className="w-3 h-3" /> Booked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Menu Footer */}
          <div className="px-4 py-2 bg-[#090909] border-t border-[#D4AF37]/15 text-center text-[10px] text-[#FAF6EF]/40 font-light">
            All appointments are subject to chair availability
          </div>
        </div>
      )}
    </div>
  );
};
