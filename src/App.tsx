import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PhilosophySection } from "./components/PhilosophySection";
import { ServicesSection } from "./components/ServicesSection";
import { GallerySection } from "./components/GallerySection";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { BookingLookupModal } from "./components/BookingLookupModal";
import { AdminDashboardModal } from "./components/AdminDashboardModal";
import { AdminDashboardPage } from "./components/AdminDashboardPage";
import { Service, GalleryItem } from "./types";

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [preselectedService, setPreselectedService] = useState<Service | null>(null);

  // Path routing state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Fetch initial studio data
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

  const handleOpenBookingWithService = (service: Service) => {
    setPreselectedService(service);
    setIsBookingOpen(true);
  };

  const handleOpenBookingModal = () => {
    setIsBookingOpen(true);
  };

  const handleExploreServices = () => {
    const el = document.getElementById("services");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Render standalone Admin Page if path is /admin
  if (currentPath === "/admin") {
    return <AdminDashboardPage onNavigateHome={() => navigateTo("/")} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F3EBDD] relative font-sans selection:bg-[#C7A45A] selection:text-[#0A0A09]">
      
      {/* 1. Minimal Quiet Luxury Navigation */}
      <Header
        onOpenBookingModal={handleOpenBookingModal}
        onOpenLookupModal={() => setIsLookupOpen(true)}
        onOpenAdminModal={() => navigateTo("/admin")}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Large Cinematic Editorial Hero */}
        <Hero
          onOpenBookingModal={handleOpenBookingModal}
          onExploreServices={handleExploreServices}
        />

        {/* 2. Quiet Editorial Philosophy Section */}
        <PhilosophySection />

        {/* 3. Minimal Editorial Services Directory */}
        <ServicesSection
          services={services}
          onSelectServiceToBook={handleOpenBookingWithService}
        />

        {/* 4. Curated Fashion Lookbook Gallery */}
        <GallerySection galleryItems={galleryItems} />
      </main>

      {/* 5. Minimalist Contact Us, Visit Us & Connected App Logos Footer */}
      <Footer />

      {/* Booking Experience Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreselectedService(null);
        }}
        services={services}
        preselectedService={preselectedService}
      />

      {/* Appointment Verification / Lookup Modal */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />

      {/* Studio Staff Operations Portal Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshServices={loadData}
      />

    </div>
  );
}
