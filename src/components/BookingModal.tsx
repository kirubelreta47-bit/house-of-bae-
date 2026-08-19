import React, { useState, useEffect } from "react";
import { Service, Booking } from "../types";
import { X, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { TimeDropdown } from "./TimeDropdown";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  preselectedService: Service | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  preselectedService,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [nailShape, setNailShape] = useState("Almond");
  const [nailLength, setNailLength] = useState("Medium");
  const [notes, setNotes] = useState("");

  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Set preselected service
  useEffect(() => {
    if (preselectedService) {
      setServiceId(preselectedService.id);
    } else if (services.length > 0 && !serviceId) {
      setServiceId(services[0].id);
    }
  }, [preselectedService, services]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!isOpen || !date) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${date}`);
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.slots);
          const firstAvail = data.slots.find((s: { available: boolean; time: string }) => s.available);
          if (firstAvail && !timeSlot) {
            setTimeSlot(firstAvail.time);
          }
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date, isOpen]);

  if (!isOpen) return null;

  const selectedServiceObj = services.find((s) => s.id === serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !date || !timeSlot || !customerName || !phone) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        serviceId,
        serviceName: selectedServiceObj?.name || "Nail Specialty",
        price: selectedServiceObj?.price || 0,
        date,
        timeSlot,
        customerName,
        phone,
        email: "",
        nailShape,
        nailLength,
        referenceImage: "",
        notes,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.booking);
      } else {
        setErrorMsg(data.error || "Could not complete reservation.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppUrl = (booking: Booking) => {
    const text = encodeURIComponent(
      `Hello House of Bae Atelier ✦\n\nI would like to confirm my appointment reservation:\n• Ref Code: ${booking.referenceCode}\n• Name: ${booking.customerName}\n• Service: ${booking.serviceName}\n• Date: ${booking.date} at ${booking.timeSlot}\n• Nail Shape: ${booking.nailShape || "Almond"}\n• Total: ${booking.price.toLocaleString()} ETB\n\nThank you!`
    );
    return `https://wa.me/251926795498?text=${text}`;
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setCustomerName("");
    setPhone("");
    setNotes("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A09]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#11110F] border border-[#F3EBDD]/15 max-w-2xl w-full p-6 sm:p-10 relative animate-fade-in my-auto shadow-2xl text-left">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-6 right-6 text-[#A9A399] hover:text-[#F3EBDD] transition-colors p-1"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Screen */
          <div className="space-y-6 text-center py-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full border border-[#C7A45A] flex items-center justify-center mx-auto text-[#C7A45A]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="editorial-label text-[10px] tracking-[0.3em] text-[#C7A45A]">
                Reservation Confirmed
              </div>
              <h3 className="font-serif text-3xl text-[#F3EBDD] font-normal">
                Thank You, {confirmedBooking.customerName}
              </h3>
              <div className="text-xs text-[#A9A399] font-light mt-1">
                Reference Code: <span className="text-[#F3EBDD] font-mono">{confirmedBooking.referenceCode}</span>
              </div>
            </div>

            {/* Booking Details Summary */}
            <div className="bg-[#0A0A09] border border-[#F3EBDD]/10 p-5 text-left text-xs sm:text-sm space-y-2.5 font-light">
              <div className="flex justify-between border-b border-[#F3EBDD]/5 pb-2">
                <span className="text-[#A9A399]">Service:</span>
                <span className="text-[#F3EBDD]">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-[#F3EBDD]/5 pb-2">
                <span className="text-[#A9A399]">Date & Time:</span>
                <span className="text-[#F3EBDD]">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between border-b border-[#F3EBDD]/5 pb-2">
                <span className="text-[#A9A399]">Nail Shape:</span>
                <span className="text-[#F3EBDD]">{confirmedBooking.nailShape || "Almond"}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#A9A399]">Estimated Fee:</span>
                <span className="font-serif text-base text-[#F3EBDD]">{confirmedBooking.price.toLocaleString()} ETB</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppUrl(confirmedBooking)}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#F3EBDD] text-[#0A0A09] py-3.5 px-6 font-medium text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#C7A45A] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp (0926 795 498) →</span>
              </a>

              <button
                onClick={handleReset}
                className="text-xs text-[#A9A399] hover:text-[#F3EBDD] underline underline-offset-4 pt-1"
              >
                Return to website
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C7A45A]/40 p-0.5 bg-[#0A0A09] flex-shrink-0">
                <img
                  src="/house_of_bae_logo.png"
                  alt="House of Bae Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="space-y-0.5">
                <div className="editorial-label text-[9px] tracking-[0.3em] text-[#C7A45A]">
                  Atelier Reservation · Lideta
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EBDD] font-normal leading-tight">
                  Book Your Appointment
                </h3>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Service & Date Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                  1. Select Service *
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                  className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.price.toLocaleString()} ETB
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                  2. Preferred Date *
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
                />
              </div>
            </div>

            {/* Time Slot Dropdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#C7A45A] block font-medium">
                  3. Select Time Slot *
                </label>
                {loadingSlots && <span className="text-[10px] text-[#C7A45A]">Checking slots...</span>}
              </div>

              <TimeDropdown
                value={timeSlot}
                onChange={setTimeSlot}
                availableSlots={availableSlots}
                loadingSlots={loadingSlots}
                theme="editorial"
              />
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bethlehem Haile"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="09XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
                />
              </div>
            </div>

            {/* Nail Shape Choice */}
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                Nail Shape
              </label>
              <select
                value={nailShape}
                onChange={(e) => setNailShape(e.target.value)}
                className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
              >
                <option value="Almond">Almond (Signature)</option>
                <option value="Coffin">Coffin / Ballerina</option>
                <option value="Square">Square</option>
                <option value="Oval">Oval</option>
                <option value="Stiletto">Stiletto</option>
                <option value="Natural">Natural Shape</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label className="text-[10px] tracking-[0.2em] uppercase text-[#A9A399] block font-light">
                Notes or Color Preferences (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Chrome powder topcoat, nude base with gold accents..."
                className="w-full bg-[#0A0A09] border border-[#F3EBDD]/15 text-[#F3EBDD] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C7A45A]"
              />
            </div>

            {/* Estimated Total & Submit */}
            {selectedServiceObj && (
              <div className="flex justify-between items-center pt-3 border-t border-[#F3EBDD]/10">
                <span className="text-xs uppercase tracking-[0.18em] text-[#A9A399]">Estimated Fee:</span>
                <span className="font-serif text-xl text-[#C7A45A]">
                  {selectedServiceObj.price.toLocaleString()} ETB
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C7A45A] text-[#0A0A09] py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D9B86C] hover:shadow-[0_4px_25px_rgba(199,164,90,0.3)] transition-all duration-300 disabled:opacity-50 active:scale-95"
            >
              {submitting ? "Confirming Reservation..." : "Confirm Appointment →"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
