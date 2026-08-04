import React, { useState, useEffect } from "react";
import { Service, Booking, TimeSlotStatus } from "../types";
import { Calendar, Clock, CheckCircle2, AlertCircle, Send, Sparkles, Phone, MessageSquare } from "lucide-react";

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
      `Shape/Length: ${b.nailShape || "Almond"} / ${b.nailLength || "Medium"}` +
      (b.notes ? `%0ANotes: ${encodeURIComponent(b.notes)}` : "");

    return `https://wa.me/251926795498?text=${text}`;
  };

  return (
    <section id="booking" className="py-24 bg-[#171211] border-y border-[#c7a252]/25 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          {/* Info Column */}
          <div className="space-y-6">
            <div>
              <div className="eyebrow">Reserve a Chair</div>
              <h2 className="font-serif-display text-4xl sm:text-5xl italic mt-3 text-[#f7f1e6]">
                Book Your Appointment
              </h2>
              <p className="mt-4 text-[#f7f1e6]/65 text-sm leading-relaxed font-light">
                Reserve your slot online in real time. Your booking is automatically recorded in our studio database, and you can confirm instantly via WhatsApp.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#c7a252]/20 text-xs sm:text-sm">
              <div className="flex gap-4 items-start">
                <span className="font-serif-display italic text-[#e8cd8a] min-w-[80px]">Hours</span>
                <span className="text-[#f7f1e6]/80">
                  Mon – Sat, 9:00 AM – 7:00 PM<br />
                  <span className="text-[#f7f1e6]/50">Sunday by appointment</span>
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif-display italic text-[#e8cd8a] min-w-[80px]">Studio</span>
                <span className="text-[#f7f1e6]/80">
                  Soliyana Building, 2nd Floor, No. 109<br />
                  <span className="text-[#f7f1e6]/50">Lideta, Addis Ababa</span>
                </span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif-display italic text-[#e8cd8a] min-w-[80px]">Phone</span>
                <span className="text-[#e8cd8a] font-medium">0926 795 498</span>
              </div>

              <div className="flex gap-4 items-start">
                <span className="font-serif-display italic text-[#e8cd8a] min-w-[80px]">Policy</span>
                <span className="text-[#f7f1e6]/60 text-xs leading-normal">
                  No payment is required online. Walk-ins welcome based on slot availability.
                </span>
              </div>
            </div>

            {/* Quick Price Summary Card if service selected */}
            {selectedServiceObj && (
              <div className="p-5 rounded bg-[#0e0b0a] border border-[#c7a252]/30 text-xs space-y-2">
                <div className="text-[#c7a252] uppercase tracking-wider font-mono">Selected Service</div>
                <div className="flex justify-between items-center font-serif-display text-base text-[#f7f1e6]">
                  <span>{selectedServiceObj.name}</span>
                  <span className="text-[#e8cd8a]">{selectedServiceObj.price.toLocaleString()} ETB</span>
                </div>
                <p className="text-[#f7f1e6]/60 italic font-light">{selectedServiceObj.description}</p>
              </div>
            )}
          </div>

          {/* Form / Confirmation Box */}
          <div className="bg-[#0e0b0a] border border-[#c7a252]/30 p-6 sm:p-8 rounded-sm relative shadow-xl">
            {confirmedBooking ? (
              <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-[#c7a252]/20 border border-[#c7a252] rounded-full flex items-center justify-center mx-auto text-[#e8cd8a]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <div className="eyebrow text-xs">Appointment Reserved</div>
                  <h3 className="font-serif-display text-3xl italic text-[#f7f1e6] mt-1">
                    Thank You, {confirmedBooking.customerName}!
                  </h3>
                  <div className="mt-2 inline-block px-3 py-1 bg-[#171211] border border-[#c7a252]/40 rounded font-mono text-xs text-[#e8cd8a]">
                    Ref: {confirmedBooking.referenceCode}
                  </div>
                </div>

                <div className="bg-[#171211] border border-[#c7a252]/20 p-5 rounded text-left text-xs sm:text-sm space-y-2.5">
                  <div className="flex justify-between border-b border-[#c7a252]/10 pb-2">
                    <span className="text-[#f7f1e6]/60">Service:</span>
                    <span className="font-medium text-[#e8cd8a]">{confirmedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#c7a252]/10 pb-2">
                    <span className="text-[#f7f1e6]/60">Date & Time:</span>
                    <span className="text-[#f7f1e6]">
                      {confirmedBooking.date} at {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#c7a252]/10 pb-2">
                    <span className="text-[#f7f1e6]/60">Nail Specs:</span>
                    <span className="text-[#f7f1e6]">
                      {confirmedBooking.nailShape} · {confirmedBooking.nailLength} Length
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#f7f1e6]/60">Estimated Total:</span>
                    <span className="font-serif-display italic text-[#e8cd8a] text-base">
                      {confirmedBooking.price.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={getWhatsAppUrl(confirmedBooking)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-[#0e0b0a] py-3.5 px-6 rounded font-medium text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-[#0e0b0a]" />
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
                    className="text-xs text-[#f7f1e6]/60 hover:text-[#e8cd8a] underline pt-2"
                  >
                    Book another appointment
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Service & Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-2">
                      1. Select Service *
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-3 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
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
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-2">
                      2. Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-3 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60">
                      3. Available Time Slot *
                    </label>
                    {loadingSlots && <span className="text-[10px] text-[#c7a252]">Checking slots...</span>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <button
                        type="button"
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setTimeSlot(slot.time)}
                        className={`py-2 px-2 text-xs rounded text-center border transition-all ${
                          timeSlot === slot.time
                            ? "bg-[#c7a252] border-[#c7a252] text-[#0e0b0a] font-medium"
                            : slot.available
                            ? "border-[#c7a252]/30 text-[#f7f1e6]/80 hover:border-[#c7a252] bg-[#171211]"
                            : "border-gray-800 text-gray-600 bg-gray-900/40 cursor-not-allowed line-through"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bethlehem Haile"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="09XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                    />
                  </div>
                </div>

                {/* Shape & Length */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                      Nail Shape
                    </label>
                    <select
                      value={nailShape}
                      onChange={(e) => setNailShape(e.target.value)}
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                    >
                      <option value="Almond">Almond (Signature)</option>
                      <option value="Coffin">Coffin / Ballerina</option>
                      <option value="Square">Square</option>
                      <option value="Oval">Oval</option>
                      <option value="Stiletto">Stiletto</option>
                      <option value="Natural">Natural Shape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                      Desired Length
                    </label>
                    <select
                      value={nailLength}
                      onChange={(e) => setNailLength(e.target.value)}
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                    >
                      <option value="Short">Short (Active Daily)</option>
                      <option value="Medium">Medium (Classic Chic)</option>
                      <option value="Long">Long Glam</option>
                      <option value="Extra Long">Extra Long Runway</option>
                    </select>
                  </div>
                </div>

                {/* Reference Photo URL or Notes */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                    Pinterest / IG Reference Image Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://pinterest.com/pin/..."
                    value={referenceImage}
                    onChange={(e) => setReferenceImage(e.target.value)}
                    className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#f7f1e6]/60 mb-1.5">
                    Custom Notes or Color Preferences
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Chrome powder topcoat, nude base, 2 accent nails with gold foil..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs sm:text-sm rounded focus:outline-none focus:border-[#c7a252]"
                  />
                </div>

                {selectedServiceObj && (
                  <div className="flex justify-between items-center py-3 border-y border-[#c7a252]/10 mt-4 mb-2">
                    <span className="text-xs uppercase tracking-widest text-[#f7f1e6]/60">Estimated Charge:</span>
                    <span className="font-serif-display text-xl text-[#e8cd8a] italic">
                      {selectedServiceObj.price.toLocaleString()} ETB
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#c7a252] text-[#0e0b0a] border border-[#c7a252] py-4 text-xs font-medium uppercase tracking-widest rounded hover:bg-[#e8cd8a] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-[0_10px_28px_rgba(199,162,82,0.25)]"
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
                <div className="text-[11px] text-[#f7f1e6]/40 text-center">
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
