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
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="eyebrow">Find Us in Addis Ababa</div>
          <h2 className="font-serif-display text-4xl sm:text-5xl italic mt-3 text-[#f7f1e6]">
            Our Studio & Contact
          </h2>
        </div>

        <div className="border border-[#c7a252]/30 rounded-sm bg-[#171211] p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Location Info */}
            <div className="space-y-8">
              <div>
                <div className="eyebrow text-[10px]">Studio Address</div>
                <h3 className="font-serif-display text-2xl sm:text-3xl italic text-[#f7f1e6] mt-1 mb-4">
                  Lideta, Addis Ababa
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-start text-sm font-light text-[#f7f1e6]/80">
                    <MapPin className="w-5 h-5 text-[#c7a252] flex-shrink-0 mt-0.5" />
                    <div>
                      Soliyana Building, 2nd Floor, No. 109<br />
                      Lideta, Addis Ababa, Ethiopia
                    </div>
                  </div>
                  
                  {/* Minimalist Google Maps Button */}
                  <div className="pl-8">
                    <a
                      href="https://www.google.com/maps?q=Lideta,Addis+Ababa,Ethiopia"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-[#c7a252]/40 text-[#f7f1e6]/60 hover:text-[#e8cd8a] hover:border-[#c7a252] px-4 py-2 text-[10px] uppercase tracking-widest rounded transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-light text-[#f7f1e6]/80 pt-4 border-t border-[#c7a252]/10">
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
                  className="inline-flex items-center gap-2 text-[#e8cd8a] hover:text-[#c7a252] text-xs uppercase tracking-wider transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span className="underline underline-offset-4">Follow @house_of_bae1</span>
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="flex flex-col justify-center bg-[#0e0b0a] p-6 sm:p-8 rounded border border-[#c7a252]/20 shadow-lg">
              <div className="text-xs font-serif-display italic text-[#e8cd8a] mb-4 text-center">
                Send a Quick Studio Message
              </div>

              {sentSuccess ? (
                <div className="p-4 bg-[#c7a252]/10 border border-[#c7a252]/30 rounded text-xs text-[#e8cd8a] flex flex-col items-center text-center gap-2">
                  <CheckCircle2 className="w-6 h-6 mb-1" />
                  <span>Message received! We will reach out to your phone shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {errorMsg && <div className="text-xs text-red-400 text-center">{errorMsg}</div>}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                    />
                    <textarea
                      rows={3}
                      placeholder="Ask about nail art pricing, bridal packages..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full bg-[#171211] border border-[#c7a252]/30 text-[#f7f1e6] px-3.5 py-2.5 text-xs rounded focus:outline-none focus:border-[#c7a252]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-transparent hover:bg-[#c7a252] text-[#e8cd8a] hover:text-[#0e0b0a] border border-[#c7a252] py-2.5 text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
