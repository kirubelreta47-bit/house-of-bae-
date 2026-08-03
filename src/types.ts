export interface Service {
  id: string;
  name: string;
  category: "manicure" | "extensions" | "pedicure" | "art" | "treatment";
  price: number; // in ETB
  durationMinutes: number;
  description: string;
  shapeSvg: string;
}

export interface Booking {
  id: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email?: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM"
  nailShape?: string;
  nailLength?: string;
  referenceImage?: string;
  notes?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  finishType: string;
  gradient: string;
  description: string;
  imageUrl?: string;
}

export interface InquiryMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface TimeSlotStatus {
  time: string;
  available: boolean;
}

export interface AdminStats {
  totalBookings: number;
  totalRevenueETB: number;
  pendingCount: number;
  confirmedCount: number;
  totalServicesCount: number;
}
