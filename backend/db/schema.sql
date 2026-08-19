-- House of Bae Studio — Neon PostgreSQL Schema

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  duration VARCHAR(50),
  category VARCHAR(100),
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  reference_code VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  service_id VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  nail_shape VARCHAR(50) DEFAULT 'Almond',
  nail_length VARCHAR(50) DEFAULT 'Medium',
  reference_image TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Expenses & Supplies Calculator Table
CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Supplies',
  price INTEGER NOT NULL,
  is_purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Services Data
INSERT INTO services (id, name, description, price, duration, category, popular)
VALUES
  ('s1', 'Luxury Russian Manicure', 'Meticulous e-file cuticle care, shaping, and long-lasting gel polish finish.', 800, '90 min', 'Manicure', true),
  ('s2', 'Gel-X Sculpted Extensions', 'Full set of lightweight, durable Gel-X nail extensions tailored to your aesthetic.', 1200, '120 min', 'Extensions', true),
  ('s3', 'Structured Builder Gel Overlay', 'Strengthening builder gel overlay on natural nails to prevent breakage.', 950, '100 min', 'Overlays', false),
  ('s4', 'Custom French & Chrome Nail Art', 'Hand-painted precision French tips, chrome powder accents, or 3D art.', 1400, '130 min', 'Art & Custom', true),
  ('s5', 'Apres Soft Gel Full Set', 'Soft gel extension system for natural look and 4+ weeks retention.', 1100, '110 min', 'Extensions', false),
  ('s6', 'Express Gel Polish Change', 'Quick nail shaping, cuticle cleanup, and fresh gel polish application.', 600, '45 min', 'Express', false),
  ('s7', 'Nail Repair & Removal Care', 'Gentle gel removal, deep nail hydration treatment, and restorative care.', 400, '40 min', 'Care', false),
  ('s8', 'VIP Atelier Pedicure & Gel', 'Exfoliating foot soak, luxury scrub, massage, and gel toe polish.', 1000, '90 min', 'Pedicure', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Supplies Data
INSERT INTO expenses (id, name, category, price, is_purchased)
VALUES
  ('e1', 'UV/LED Gel Curing Lamps (2x)', 'Equipment', 1500, true),
  ('e2', 'E-File Bits & Diamond Cuticle Carbide Set', 'Tools', 800, true),
  ('e3', 'Builder Gel & Gel-X Tips Refill Box', 'Supplies', 1200, false),
  ('e4', 'Metallic Chrome & Glitter Pigments Set', 'Supplies', 650, false),
  ('e5', 'Nail Prep Dehydrator & Primer Bottles (10x)', 'Supplies', 1100, false)
ON CONFLICT (id) DO NOTHING;
