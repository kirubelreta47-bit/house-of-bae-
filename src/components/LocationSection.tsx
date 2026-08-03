import React, { useState } from "react";
import { MapPin, Phone, Clock, Instagram, Send, CheckCircle2 } from "lucide-react";

export const LocationSection: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message }),
      });

      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setErrorMsg(data.error || "Error sending message");
      }
    } catch (err) {
      setErrorMsg("Network error sending inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="location" className="py-24 border-t border-[#c7a252]/25 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="eyebrow">Find Us in Addis Ababa</div>
          <h2 className="font-serif-display text-4xl sm:text-5xl italic mt-3 text-[#f7f1e6]">
            Our Studio & Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#c7a252]/30 rounded-sm overflow-hidden bg-[#171211]">
          {/* Location Info & Inquiry Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <div className="eyebrow text-[10px]">Atelier Address</div>
                <h3 className="font-serif-display text-2xl sm:text-3xl italic text-[#f7f1e6] mt-1">
                  Lideta, Addis Ababa
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-light text-[#f7f1e6]/80">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-[#c7a252] flex-shrink-0 mt-0.5" />
                  <div>
                    Soliyana Building, 2nd Floor, No. 109<br />
                    Lideta, Addis Ababa, Ethiopia
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-[#c7a252] flex-shrink-0 mt-0.5" />
                  <div>
                    <a href="tel:+251926795498" className="text-[#e8cd8a] hover:underline font-medium">
                      0926 795 498
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Clock className="w-5 h-5 text-[#c7a252] flex-shrink-0 mt-0.5" />
                  <div>
                    Mon – Sat · 9:00 AM – 7:00 PM<br />
                    Sunday · By appointment
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.instagram.com/house_of_bae1/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-[#c7a252]/40 hover:border-[#c7a252] text-[#e8cd8a] px-4 py-2 text-xs uppercase tracking-wider rounded transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow @house_of_bae1</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="pt-6 border-t border-[#c7a252]/20">
              <div className="text-xs font-serif-display italic text-[#e8cd8a] mb-3">
                Send a Quick Studio Message
              </div>

              {sentSuccess ? (
                <div className="p-3.5 bg-[#c7a252]/20 border border-[#c7a252] rounded text-xs text-[#e8cd8a] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Message received! We will reach out to your phone shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  {errorMsg && <div className="text-xs text-red-400">{errorMsg}</div>}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#0e0b0a] border border-[#c7a252]/20 text-[#f7f1e6] px-3 py-2 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#0e0b0a] border border-[#c7a252]/20 text-[#f7f1e6] px-3 py-2 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Ask about nail art pricing, bridal packages..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full bg-[#0e0b0a] border border-[#c7a252]/20 text-[#f7f1e6] px-3 py-2 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#c7a252]/10 hover:bg-[#c7a252] text-[#e8cd8a] hover:text-[#0e0b0a] border border-[#c7a252] py-2 text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map Frame */}
          <div className="min-h-[380px] grayscale contrast-105 border-t lg:border-t-0 lg:border-l border-[#c7a252]/30 relative">
            <iframe
              src="https://www.google.com/maps?q=Lideta,Addis+Ababa,Ethiopia&output=embed"
              loading="lazy"
              className="w-full h-full min-h-[380px] border-0 block"
              title="House of Bae Lideta Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
