import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ShapeDivider } from "./components/ShapeDivider";
import { MarqueeTicker } from "./components/MarqueeTicker";
import { ServicesSection } from "./components/ServicesSection";
import { GallerySection } from "./components/GallerySection";
import { BookingSection } from "./components/BookingSection";
import { LocationSection } from "./components/LocationSection";
import { Footer } from "./components/Footer";
import { BookingLookupModal } from "./components/BookingLookupModal";
import { AdminDashboardModal } from "./components/AdminDashboardModal";
import { Service, GalleryItem, Booking } from "./types";
import { MessageSquare } from "lucide-react";

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);

  // Modals
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [resS, resG] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/gallery"),
      ]);

      const dataS = await resS.json();
      const dataG = await resG.json();

      if (dataS.success) setServices(dataS.services);
      if (dataG.success) setGalleryItems(dataG.gallery);
    } catch (err) {
      console.error("Error loading studio data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectServiceToBook = (service: Service) => {
    setPreselectedService(service);
    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenBooking = () => {
    const bookingEl = document.getElementById("booking");
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0b0a] text-[#f7f1e6] relative font-sans">
      {/* Background Foil Overlay */}
      <div className="foil-bg" />

      {/* Navigation Header */}
      <Header
        onOpenBookingModal={handleOpenBooking}
        onOpenLookupModal={() => setIsLookupOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero
          onOpenBookingModal={handleOpenBooking}
          onExploreServices={() => {
            const el = document.getElementById("services");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <ShapeDivider type="drop" />

        <MarqueeTicker />

        <ServicesSection
          services={services}
          onSelectServiceToBook={handleSelectServiceToBook}
        />

        <ShapeDivider type="rectangle" />

        <GallerySection galleryItems={galleryItems} />

        <ShapeDivider type="triangle" />

        <BookingSection
          services={services}
          preselectedService={preselectedService}
        />

        <LocationSection />
      </main>

      <Footer />

      {/* Floating WhatsApp Quick Action */}
      <a
        href="https://wa.me/251926795498?text=Hello%20House%20of%20Bae%20✦%20I%20have%20a%20question%20about%20your%20nail%20services"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-[#0e0b0a] p-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform flex items-center justify-center border border-white/20 group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-[#0e0b0a]" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-medium uppercase tracking-wider pl-0 group-hover:pl-2">
          Chat WhatsApp
        </span>
      </a>

      {/* Modals */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshServices={loadData}
      />
    </div>
  );
}
