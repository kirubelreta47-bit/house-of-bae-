import React, { useState, useEffect } from "react";
import { Service, Booking, TimeSlotStatus } from "../types";
import { Calendar, Clock, CheckCircle2, AlertCircle, Send, Sparkles, Phone, MessageSquare } from "lucide-react";
import { TimeDropdown } from "./TimeDropdown";

interface BookingSectionProps {
  services: Service[];
  preselectedService?: Service | null;
  onBookingSuccess?: (booking: Booking) => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  services,
  preselectedService,
  onBookingSuccess,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];

  const [serviceId, setServiceId] = useState<string>(preselectedService?.id || "");
  const [date, setDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [nailShape, setNailShape] = useState<string>("Almond");
  const [nailLength, setNailLength] = useState<string>("Medium");
  const [referenceImage, setReferenceImage] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [availableSlots, setAvailableSlots] = useState<TimeSlotStatus[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setServiceId(preselectedService.id);
    }
  }, [preselectedService]);

  // Fetch slots whenever date changes
  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(`/api/slots?date=${date}`);
        const data = await res.json();
        if (data.success) {
          setAvailableSlots(data.slots);
          // If currently selected time slot is taken, reset selection
          setTimeSlot((prevSlot) => {
            const currentSlot = data.slots.find((s: TimeSlotStatus) => s.time === prevSlot);
            if (currentSlot && !currentSlot.available) {
              return "";
            }
            return prevSlot;
          });
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [date]);

  const selectedServiceObj = services.find((s) => s.id === serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!serviceId) {
      setErrorMsg("Please select a service from our menu.");
      return;
    }
    if (!timeSlot) {
      setErrorMsg("Please select an available time slot for your visit.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName,
        phone,
        email,
        serviceId,
        serviceName: selectedServiceObj?.name || "Nail Service",
        price: selectedServiceObj?.price || 0,
        date,
        timeSlot,
        nailShape,
        nailLength,
        referenceImage,
        notes,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to confirm reservation. Please try again.");
        setSubmitting(false);
        return;
      }

      setConfirmedBooking(data.booking);
      if (onBookingSuccess) {
        onBookingSuccess(data.booking);
      }
    } catch (err) {
      setErrorMsg("Network error occurred. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppUrl = (b: Booking) => {
    const text =
      `Hello House of Bae ✦ I'd like to confirm my appointment:%0A` +
      `Reference: ${b.referenceCode}%0A` +
      `Name: ${b.customerName}%0A` +
      `Phone: ${b.phone}%0A` +
      `Service: ${b.serviceName} (${b.price} ETB)%0A` +
      `Date: ${b.date}%0A` +
      `Time: ${b.timeSlot}%0A` +
      `Shape: ${b.nailShape || "Almond"}` +
      (b.notes ? `%0ANotes: ${encodeURIComponent(b.notes)}` : "");

    return `https://wa.me/251926795498?text=${text}`;
  };

  return (
    <section id="booking" className="py-24 bg-[#0e0e0e] border-y border-[#D4AF37]/20 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          {/* Info Column */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 eyebrow mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Reserve a Chair</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl italic mt-1 text-[#FAF6EF]">
                Book Your Visit
              </h2>
              <p className="mt-4 text-[#FAF6EF]/80 text-sm leading-relaxed font-light">
                Select your service, date, and preferred time slot in real time. Your reservation is immediately logged into our studio database.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#D4AF37]/20 text-xs sm:text-sm">
              <div className="flex gap-4 items-start">
                <span className="font-serif italic text-[#D4AF37] min-w-[80px]">Hours</span>
                <span className="text-[#FAF6EF]/90">
                  Mon – Sat, 9:00 AM – 8:00 PM<br />
                  <span className="text-[#FAF6EF]/50">Sunday by appointment</span>
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif italic text-[#D4AF37] min-w-[80px]">Studio</span>
                <span className="text-[#FAF6EF]/90">
                  Soliyana Building, 2nd Floor, No. 109<br />
                  <span className="text-[#FAF6EF]/50">Lideta, Addis Ababa</span>
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif italic text-[#D4AF37] min-w-[80px]">Phone</span>
                <span className="text-[#D4AF37] font-medium font-sans">0926 795 498</span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif italic text-[#D4AF37] min-w-[80px]">Policy</span>
                <span className="text-[#FAF6EF]/70 text-xs leading-normal">
                  No online prepayment required. Walk-ins welcomed based on chair availability.
                </span>
              </div>
            </div>

            {/* Quick Price Summary Card if service selected */}
            {selectedServiceObj && (
              <div className="p-5 rounded-sm bg-[#0a0a0a] border border-[#D4AF37]/40 text-xs space-y-2">
                <div className="text-[#D4AF37] uppercase tracking-[0.2em] font-sans font-medium text-[10px]">Selected Specialty</div>
                <div className="flex justify-between items-center font-serif text-lg text-[#FAF6EF]">
                  <span>{selectedServiceObj.name}</span>
                  <span className="text-[#D4AF37] font-semibold">{selectedServiceObj.price.toLocaleString()} ETB</span>
                </div>
                <p className="text-[#FAF6EF]/65 italic font-light">{selectedServiceObj.description}</p>
              </div>
            )}
          </div>

          {/* Form / Confirmation Box */}
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/35 p-6 sm:p-8 rounded-sm relative shadow-2xl">
            {confirmedBooking ? (
              <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.35)] bg-[#0a0a0a]">
                    <img src="/house_of_bae_logo.png" alt="House of Bae" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#D4AF37] text-[#0a0a0a] rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="eyebrow text-xs">Appointment Reserved</div>
                  <h3 className="font-serif text-3xl italic text-[#FAF6EF] mt-1">
                    Thank You, {confirmedBooking.customerName}!
                  </h3>
                  <div className="mt-2 inline-block px-3.5 py-1 bg-[#121212] border border-[#D4AF37]/40 rounded-sm font-mono text-xs text-[#D4AF37]">
                    Ref: {confirmedBooking.referenceCode}
                  </div>
                </div>

                <div className="bg-[#121212] border border-[#D4AF37]/20 p-5 rounded-sm text-left text-xs sm:text-sm space-y-2.5">
                  <div className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                    <span className="text-[#FAF6EF]/60">Service:</span>
                    <span className="font-medium text-[#D4AF37]">{confirmedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                    <span className="text-[#FAF6EF]/60">Date & Time:</span>
                    <span className="text-[#FAF6EF]">
                      {confirmedBooking.date} at {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                    <span className="text-[#FAF6EF]/60">Nail Shape:</span>
                    <span className="text-[#FAF6EF]">
                      {confirmedBooking.nailShape || "Almond"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#FAF6EF]/60">Estimated Total:</span>
                    <span className="font-serif italic text-[#D4AF37] text-base">
                      {confirmedBooking.price.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={getWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#D4AF37] text-[#0a0a0a] py-3.5 px-6 rounded-sm font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#E5C158] transition-all duration-300 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-[#0a0a0a]" />
                    Confirm via WhatsApp (0926 795 498) →
                  </a>

                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setServiceId("");
                      setDate(todayStr);
                      setTimeSlot("");
                      setCustomerName("");
                      setPhone("");
                      setEmail("");
                      setNailShape("Almond");
                      setNailLength("Medium");
                      setReferenceImage("");
                      setNotes("");
                      setErrorMsg("");
                    }}
                    className="text-xs text-[#FAF6EF]/60 hover:text-[#D4AF37] underline pt-2 transition-colors duration-300"
                  >
                    Book another appointment
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-sm text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Service & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-2">
                      1. Select Service *
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-3 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                    >
                      <option value="">Choose a service...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.price.toLocaleString()} ETB
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-2">
                      2. Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-3 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Time Slot Dropdown */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70">
                      3. Select Time Slot *
                    </label>
                    {loadingSlots && <span className="text-[10px] text-[#D4AF37]">Checking slots...</span>}
                  </div>

                  <TimeDropdown
                    value={timeSlot}
                    onChange={setTimeSlot}
                    availableSlots={availableSlots}
                    loadingSlots={loadingSlots}
                  />
                </div>

                {/* Client Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bethlehem Haile"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-2.5 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="09XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-2.5 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Shape Choice */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-1.5">
                    Nail Shape
                  </label>
                  <select
                    value={nailShape}
                    onChange={(e) => setNailShape(e.target.value)}
                    className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-2.5 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  >
                    <option value="Almond">Almond (Signature)</option>
                    <option value="Coffin">Coffin / Ballerina</option>
                    <option value="Square">Square</option>
                    <option value="Oval">Oval</option>
                    <option value="Stiletto">Stiletto</option>
                    <option value="Natural">Natural Shape</option>
                  </select>
                </div>

                {/* Reference Photo URL or Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-1.5">
                    Pinterest / IG Reference Image Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://pinterest.com/pin/..."
                    value={referenceImage}
                    onChange={(e) => setReferenceImage(e.target.value)}
                    className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-2.5 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#FAF6EF]/70 mb-1.5">
                    Custom Notes or Color Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Chrome powder topcoat, nude base, 2 accent nails with gold foil..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#121212] border border-[#D4AF37]/35 text-[#FAF6EF] px-3.5 py-2.5 text-xs sm:text-sm rounded-sm focus:outline-none focus:border-[#D4AF37] transition-colors duration-300"
                  />
                </div>

                {selectedServiceObj && (
                  <div className="flex justify-between items-center py-3 border-y border-[#D4AF37]/15 mt-4 mb-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#FAF6EF]/70 font-sans">Estimated Charge:</span>
                    <span className="font-serif text-xl text-[#FAF6EF] italic">
                      {selectedServiceObj.price.toLocaleString()} <span className="text-xs text-[#D4AF37] font-sans not-italic font-medium">ETB</span>
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#D4AF37] text-[#0a0a0a] border border-[#D4AF37] py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-sm hover:bg-[#E5C158] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-[0_10px_28px_rgba(212,175,55,0.3)]"
                >
                  {submitting ? (
                    <span>Processing Reservation...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Reservation →</span>
                    </>
                  )}
                </button>
                <div className="text-[11px] text-[#FAF6EF]/45 text-center">
                  ✦ Saves directly to House of Bae studio database. Pre-fills WhatsApp message.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
