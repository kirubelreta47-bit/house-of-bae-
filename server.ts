import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client conditionally if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY"
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Telegram Bot Credentials
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8019288831:AAGdkb8yYlPC9dikU1sRUTWtU1DqWWvKNwE";
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || "6933707628";

async function sendTelegramNotification(b: Booking) {
  try {
    const targetChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || "6933707628";
    const targetToken = process.env.TELEGRAM_BOT_TOKEN || "8019288831:AAGdkb8yYlPC9dikU1sRUTWtU1DqWWvKNwE";

    const text =
      `<b>✨ NEW APPOINTMENT RESERVATION ✨</b>\n\n` +
      `<b>Ref Code:</b> <code>${b.referenceCode}</code>\n` +
      `<b>Customer Name:</b> ${b.customerName}\n` +
      `<b>Phone Number:</b> <code>${b.phone}</code>\n` +
      `<b>Service:</b> ${b.serviceName}\n` +
      `<b>Total Price:</b> ${b.price.toLocaleString()} ETB\n` +
      `<b>Date:</b> ${b.date}\n` +
      `<b>Time Slot:</b> ${b.timeSlot}\n` +
      `<b>Nail Shape:</b> ${b.nailShape || "Almond"}\n` +
      (b.notes ? `<b>Notes:</b> ${b.notes}\n` : "") +
      `<b>Status:</b> ⏳ ${b.status}`;

    const url = `https://api.telegram.org/bot${targetToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API error:", data);
      if (data.error_code === 403 || data.description?.includes("bot can't send messages to the bot")) {
        console.warn("⚠️ TELEGRAM NOTE: Chat ID is set to the Bot ID itself. Telegram bots cannot send messages to their own ID.");
        console.warn("👉 Please get your personal user Chat ID from Telegram (@userinfobot) and set TELEGRAM_ADMIN_CHAT_ID in .env!");
      }
    } else {
      console.log("Telegram notification sent successfully to chat:", TELEGRAM_ADMIN_CHAT_ID);
    }
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
  }
}

// Database Setup
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface Service {
  id: string;
  name: string;
  category: "manicure" | "extensions" | "pedicure" | "art" | "treatment";
  price: number; // in ETB
  durationMinutes: number;
  description: string;
  shapeSvg: string;
}

interface Booking {
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

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  finishType: string;
  gradient: string;
  description: string;
  imageUrl?: string;
}

interface InquiryMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
}

interface ExpenseItem {
  id: string;
  name: string;
  category: "Supplies" | "Equipment" | "Tools" | "Marketing" | "Rent/Utilities" | "Other";
  price: number;
  isPurchased: boolean;
  createdAt: string;
}

interface DBStructure {
  services: Service[];
  bookings: Booking[];
  gallery: GalleryItem[];
  messages: InquiryMessage[];
  expenses: ExpenseItem[];
}

const initialServices: Service[] = [
  {
    id: "s1",
    name: "Classic Manicure",
    category: "manicure",
    price: 350,
    durationMinutes: 45,
    description: "Shape, cuticle care, hand massage & high-shine polish of your choice.",
    shapeSvg: "M13 1C13 1 1 12 1 21C1 27.6274 6.37258 33 13 33C19.6274 33 25 27.6274 25 21C25 12 13 1 13 1Z",
  },
  {
    id: "s2",
    name: "Gel-X Sculpted Extensions",
    category: "extensions",
    price: 1200,
    durationMinutes: 90,
    description: "Lightweight, full-coverage gel extensions tailored in your desired length & shape.",
    shapeSvg: "M4 4h18v26H4z",
  },
  {
    id: "s3",
    name: "Chrome & Foil Finish",
    category: "art",
    price: 450,
    durationMinutes: 30,
    description: "Mirror chrome powder, gold leaf foil accents, or cat-eye velvet shimmer top coat.",
    shapeSvg: "M13 1L23 21C23 27.6 18.5 33 13 33C7.5 33 3 27.6 3 21L13 1Z",
  },
  {
    id: "s4",
    name: "Hand-Painted Custom Nail Art",
    category: "art",
    price: 150,
    durationMinutes: 30,
    description: "Bespoke linework, marble swirls, 3D gel textures, or gem accents per nail.",
    shapeSvg: "M13 3C7 3 3 10 3 18C3 26 7 33 13 33C19 33 23 26 23 18C23 10 19 3 13 3Z",
  },
  {
    id: "s5",
    name: "Luxury Spa Pedicure",
    category: "pedicure",
    price: 500,
    durationMinutes: 60,
    description: "Aromatic foot soak, exfoliating scrub, heel softening, massage & polish.",
    shapeSvg: "M13 4L20 30H6L13 4Z",
  },
  {
    id: "s6",
    name: "Soak-Off & Nail Health Repair",
    category: "treatment",
    price: 150,
    durationMinutes: 30,
    description: "Gentle acetone-free removal, keratin conditioning treatment & nail strengthener.",
    shapeSvg: "M13 17m-12 0a12 12 0 1 0 24 0a12 12 0 1 0 -24 0",
  },
  {
    id: "s7",
    name: "Russian Dry Manicure & Cuticle Perfection",
    category: "manicure",
    price: 400,
    durationMinutes: 50,
    description: "Precision e-file cuticle care for ultra-clean, long-lasting polish application.",
    shapeSvg: "M13 1C13 1 1 12 1 21C1 27.6274 6.37258 33 13 33C19.6274 33 25 27.6274 25 21C25 12 13 1 13 1Z",
  },
  {
    id: "s8",
    name: "Hard Gel / Builder Gel Overlay",
    category: "extensions",
    price: 900,
    durationMinutes: 75,
    description: "Reinforce natural nails with durable builder gel for maximum growth & strength.",
    shapeSvg: "M4 4h18v26H4z",
  },
];

const initialGallery: GalleryItem[] = [
  {
    id: "g1",
    title: "Onyx Chrome",
    category: "Chrome & Metallic",
    finishType: "Mirror Chrome",
    gradient: "linear-gradient(135deg, #2b2320 0%, #0b0908 60%)",
    description: "Deep obsidian mirror glaze with metallic shimmer undertones.",
    imageUrl: "/images/onyx_chrome_nails_1785790542145.jpg",
  },
  {
    id: "g2",
    title: "Nude Glaze",
    category: "Nudes & Sheer",
    finishType: "Glazed Donut",
    gradient: "linear-gradient(135deg, #e9d8bd 0%, #c9a96f 100%)",
    description: "Hailey-inspired translucent sheer pearl shine over warm nude base.",
    imageUrl: "/images/nude_glaze_nails_1785790556348.jpg",
  },
  {
    id: "g3",
    title: "Gold Foil French",
    category: "Nail Art",
    finishType: "Hand Foil",
    gradient: "linear-gradient(135deg, #151515 0%, #3a2f1f 70%, #c7a252 100%)",
    description: "Minimalist nude arch with 24k gold leaf foil embedded on tips.",
    imageUrl: "/images/gold_foil_french_1785790568862.jpg",
  },
  {
    id: "g4",
    title: "Champagne Silk",
    category: "Nudes & Sheer",
    finishType: "Satin Shimmer",
    gradient: "linear-gradient(135deg, #efe2cd 0%, #8a6a4f 100%)",
    description: "Soft rose gold pearlescent silk with fine micro-glitter.",
    imageUrl: "/images/champagne_silk_nails_1785790580027.jpg",
  },
  {
    id: "g5",
    title: "Black & Gold Marble",
    category: "Nail Art",
    finishType: "3D Quartz",
    gradient: "linear-gradient(160deg, #1b1b1b 0%, #c7a252 140%)",
    description: "Hand-swirled smoky marble with metallic gold veins.",
    imageUrl: "/images/black_gold_marble_1785790591177.jpg",
  },
  {
    id: "g6",
    title: "Milk Bar Nude",
    category: "Nudes & Sheer",
    finishType: "Opaque Cream",
    gradient: "linear-gradient(135deg, #f3ead9 0%, #dcc79a 100%)",
    description: "Ultra-clean milky almond nude with high gloss topcoat.",
    imageUrl: "/images/milk_bar_nude_nails_1785790602182.jpg",
  },
];

const initialBookings: Booking[] = [
  {
    id: "b1",
    referenceCode: "HOB-1042",
    customerName: "Selamawit Tadesse",
    phone: "0911234567",
    email: "selam@example.com",
    serviceId: "s2",
    serviceName: "Gel-X Sculpted Extensions",
    price: 1200,
    date: new Date().toISOString().split("T")[0],
    timeSlot: "11:00 AM",
    nailShape: "Almond",
    nailLength: "Medium",
    notes: "Nude base with gold foil tips please",
    status: "Confirmed",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "b2",
    referenceCode: "HOB-1043",
    customerName: "Bethlehem Haile",
    phone: "0922334455",
    serviceId: "s3",
    serviceName: "Chrome & Foil Finish",
    price: 450,
    date: new Date().toISOString().split("T")[0],
    timeSlot: "2:00 PM",
    nailShape: "Coffin",
    nailLength: "Short",
    notes: "First time client!",
    status: "Pending",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

const initialExpenses: ExpenseItem[] = [
  {
    id: "exp_1",
    name: "Gel-X Soft Tips & Builder Gel Restock",
    category: "Supplies",
    price: 1850,
    isPurchased: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "exp_2",
    name: "24k Gold Foil & Chrome Powder Set",
    category: "Supplies",
    price: 450,
    isPurchased: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "exp_3",
    name: "UV/LED Gel Curing Lamp (Chair 2)",
    category: "Equipment",
    price: 2200,
    isPurchased: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "exp_4",
    name: "Precision E-File Carbide Bits Set",
    category: "Tools",
    price: 750,
    isPurchased: false,
    createdAt: new Date().toISOString(),
  },
];

function initDB(): DBStructure {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const data: DBStructure = {
      services: initialServices,
      bookings: initialBookings,
      gallery: initialGallery,
      messages: [],
      expenses: initialExpenses,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.expenses) {
      parsed.expenses = initialExpenses;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, re-initializing:", err);
    const data: DBStructure = {
      services: initialServices,
      bookings: initialBookings,
      gallery: initialGallery,
      messages: [],
      expenses: initialExpenses,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// REST API ROUTES

// GET /api/services
app.get("/api/services", (req, res) => {
  const db = initDB();
  res.json({ success: true, services: db.services });
});

// POST /api/services (Admin)
app.post("/api/services", (req, res) => {
  const { name, category, price, durationMinutes, description } = req.body;
  if (!name || price === undefined || price === null) {
    return res.status(400).json({ success: false, error: "Name and price are required" });
  }
  const db = initDB();
  const newService: Service = {
    id: "s_" + Date.now(),
    name,
    category: category || "manicure",
    price: Number(price),
    durationMinutes: Number(durationMinutes) || 45,
    description: description || "",
    shapeSvg: "M13 1C13 1 1 12 1 21C1 27.6274 6.37258 33 13 33C19.6274 33 25 27.6274 25 21C25 12 13 1 13 1Z",
  };
  db.services.push(newService);
  saveDB(db);
  res.json({ success: true, service: newService });
});

// DELETE /api/services/:id (Admin)
app.delete("/api/services/:id", (req, res) => {
  const db = initDB();
  db.services = db.services.filter((s) => s.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// GET /api/slots?date=YYYY-MM-DD
app.get("/api/slots", (req, res) => {
  const dateQuery = (req.query.date as string) || new Date().toISOString().split("T")[0];
  const db = initDB();
  
  const allSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  const bookedTimeSlots = db.bookings
    .filter((b) => b.date === dateQuery && b.status !== "Cancelled")
    .map((b) => b.timeSlot);

  const slotStatus = allSlots.map((slot) => ({
    time: slot,
    available: !bookedTimeSlots.includes(slot),
  }));

  res.json({ success: true, date: dateQuery, slots: slotStatus });
});

// GET /api/bookings (Admin or list)
app.get("/api/bookings", (req, res) => {
  const db = initDB();
  const { status, date } = req.query;
  let filtered = [...db.bookings];
  if (status) {
    filtered = filtered.filter((b) => b.status.toLowerCase() === (status as string).toLowerCase());
  }
  if (date) {
    filtered = filtered.filter((b) => b.date === date);
  }
  // Sort latest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, bookings: filtered });
});

// POST /api/bookings (Create appointment)
app.post("/api/bookings", (req, res) => {
  const {
    customerName,
    phone,
    email,
    serviceId,
    serviceName,
    price,
    date,
    timeSlot,
    nailShape,
    nailLength,
    referenceImage,
    notes,
  } = req.body;

  const db = initDB();

  let targetServiceName = serviceName;
  let targetPrice = Number(price) || 0;

  if (!targetServiceName && serviceId) {
    const foundService = db.services.find((s) => s.id === serviceId);
    if (foundService) {
      targetServiceName = foundService.name;
      targetPrice = foundService.price;
    }
  }

  if (!customerName || !phone || !targetServiceName || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: "Name, phone, service, date, and time slot are required." });
  }

  // Check if slot already booked for this date
  const isBooked = db.bookings.some(
    (b) => b.date === date && b.timeSlot === timeSlot && b.status !== "Cancelled"
  );

  if (isBooked) {
    return res.status(409).json({
      success: false,
      error: `The ${timeSlot} slot on ${date} is already reserved. Please select another time.`,
    });
  }

  const refCode = "HOB-" + Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    id: "b_" + Date.now(),
    referenceCode: refCode,
    customerName,
    phone,
    email: email || "",
    serviceId: serviceId || "",
    serviceName: targetServiceName,
    price: targetPrice,
    date,
    timeSlot,
    nailShape: nailShape || "Almond",
    nailLength: nailLength || "Medium",
    referenceImage: referenceImage || "",
    notes: notes || "",
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  db.bookings.push(newBooking);
  saveDB(db);

  // Send instant Telegram notification to studio admin
  sendTelegramNotification(newBooking).catch((e) => console.error("Telegram notification error:", e));

  res.json({ success: true, booking: newBooking });
});

// GET /api/bookings/lookup?query=...
app.get("/api/bookings/lookup", (req, res) => {
  const query = ((req.query.query as string) || "").trim();
  if (!query) {
    return res.status(400).json({ success: false, error: "Please provide a reference code or phone number." });
  }

  const db = initDB();
  const qLower = query.toLowerCase();

  const matched = db.bookings.filter(
    (b) =>
      b.referenceCode.toLowerCase() === qLower ||
      b.phone.replace(/\s+/g, "").includes(query.replace(/\s+/g, "")) ||
      b.customerName.toLowerCase().includes(qLower)
  );

  res.json({ success: true, bookings: matched });
});

// PATCH /api/bookings/:id (Update booking status/notes)
app.patch("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status, timeSlot, date, notes } = req.body;

  const db = initDB();
  const bookingIndex = db.bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  if (status) db.bookings[bookingIndex].status = status;
  if (timeSlot) db.bookings[bookingIndex].timeSlot = timeSlot;
  if (date) db.bookings[bookingIndex].date = date;
  if (notes !== undefined) db.bookings[bookingIndex].notes = notes;

  saveDB(db);
  res.json({ success: true, booking: db.bookings[bookingIndex] });
});

// GET /api/gallery
app.get("/api/gallery", (req, res) => {
  const db = initDB();
  res.json({ success: true, gallery: db.gallery });
});

// POST /api/gallery
app.post("/api/gallery", (req, res) => {
  const { title, category, finishType, description, imageUrl } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: "Title is required" });
  }
  const db = initDB();
  const newItem: GalleryItem = {
    id: "g_" + Date.now(),
    title,
    category: category || "Nail Art",
    finishType: finishType || "Custom",
    gradient: "linear-gradient(135deg, #2b2320 0%, #c7a252 100%)",
    description: description || "",
    imageUrl,
  };
  db.gallery.push(newItem);
  saveDB(db);
  res.json({ success: true, item: newItem });
});

// POST /api/messages (Client inquiry)
app.post("/api/messages", (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, error: "Name, phone and message are required" });
  }
  const db = initDB();
  const msgObj: InquiryMessage = {
    id: "m_" + Date.now(),
    name,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };
  db.messages.push(msgObj);
  saveDB(db);
  res.json({ success: true, message: msgObj });
});

// GET /api/messages (Admin)
app.get("/api/messages", (req, res) => {
  const db = initDB();
  res.json({ success: true, messages: db.messages });
});

// GET /api/expenses
app.get("/api/expenses", (req, res) => {
  const db = initDB();
  res.json({ success: true, expenses: db.expenses || [] });
});

// POST /api/expenses (Add item to buy / expense)
app.post("/api/expenses", (req, res) => {
  const { name, category, price, isPurchased } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ success: false, error: "Name and price are required." });
  }
  const db = initDB();
  if (!db.expenses) db.expenses = [];

  const newExpense: ExpenseItem = {
    id: "exp_" + Date.now(),
    name,
    category: category || "Supplies",
    price: Number(price) || 0,
    isPurchased: Boolean(isPurchased),
    createdAt: new Date().toISOString(),
  };
  db.expenses.push(newExpense);
  saveDB(db);
  res.json({ success: true, expense: newExpense });
});

// PATCH /api/expenses/:id (Toggle purchased or update)
app.patch("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { isPurchased, name, price } = req.body;
  const db = initDB();
  if (!db.expenses) db.expenses = [];

  const idx = db.expenses.findIndex((e) => e.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: "Expense item not found" });
  }

  if (isPurchased !== undefined) db.expenses[idx].isPurchased = Boolean(isPurchased);
  if (name) db.expenses[idx].name = name;
  if (price !== undefined) db.expenses[idx].price = Number(price);

  saveDB(db);
  res.json({ success: true, expense: db.expenses[idx] });
});

// DELETE /api/expenses/:id
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const db = initDB();
  if (!db.expenses) db.expenses = [];
  db.expenses = db.expenses.filter((e) => e.id !== id);
  saveDB(db);
  res.json({ success: true });
});

// GET /api/stats (Admin analytics)
app.get("/api/stats", (req, res) => {
  const db = initDB();
  const totalBookings = db.bookings.length;
  const confirmedOrCompleted = db.bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Completed"
  );
  const totalRevenueETB = confirmedOrCompleted.reduce((acc, b) => acc + (b.price || 0), 0);
  const pendingCount = db.bookings.filter((b) => b.status === "Pending").length;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Calculate Monday of current week
  const dayOfWeek = now.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() - distanceToMonday);

  const daysOfWeekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyBreakdown = daysOfWeekNames.map((dayName, idx) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + idx);
    const dateStr = d.toISOString().split("T")[0];

    const dayBookings = confirmedOrCompleted.filter((b) => b.date === dateStr);
    const dayRevenue = dayBookings.reduce((acc, b) => acc + (b.price || 0), 0);

    return {
      day: dayName,
      fullDate: dateStr,
      revenue: dayRevenue,
      bookingCount: dayBookings.length,
    };
  });

  const thisWeekRevenueETB = weeklyBreakdown.reduce((acc, d) => acc + d.revenue, 0);

  const currentYearMonth = todayStr.substring(0, 7);
  const thisMonthRevenueETB = confirmedOrCompleted
    .filter((b) => b.date && b.date.startsWith(currentYearMonth))
    .reduce((acc, b) => acc + (b.price || 0), 0);

  const todayRevenueETB = confirmedOrCompleted
    .filter((b) => b.date === todayStr)
    .reduce((acc, b) => acc + (b.price || 0), 0);

  const expensesList = db.expenses || [];
  const totalExpensesETB = expensesList.filter((e) => e.isPurchased).reduce((acc, e) => acc + (e.price || 0), 0);
  const plannedExpensesETB = expensesList.filter((e) => !e.isPurchased).reduce((acc, e) => acc + (e.price || 0), 0);
  const netProfitETB = totalRevenueETB - totalExpensesETB;

  res.json({
    success: true,
    stats: {
      totalBookings,
      totalRevenueETB,
      thisMonthRevenueETB,
      thisWeekRevenueETB,
      todayRevenueETB,
      totalExpensesETB,
      plannedExpensesETB,
      netProfitETB,
      pendingCount,
      confirmedCount: confirmedOrCompleted.length,
      totalServicesCount: db.services.length,
      weeklyBreakdown,
    },
  });
});

import { initNeonTables } from "./backend/db/initNeon";

// Vite & Static Server Setup
async function startServer() {
  // Initialize Neon PostgreSQL tables if DATABASE_URL is configured
  if (process.env.DATABASE_URL) {
    await initNeonTables();
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`House of Bae Nail Studio server listening at http://localhost:${PORT}`);
  });
}

startServer();
