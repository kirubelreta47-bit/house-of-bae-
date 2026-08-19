import { Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

export let pool: Pool | null = null;

if (DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: DATABASE_URL });
    console.log("⚡ Connected to Neon PostgreSQL database!");
  } catch (err) {
    console.error("Failed to connect to Neon PostgreSQL:", err);
  }
} else {
  console.log("ℹ️ DATABASE_URL not set in .env — using local JSON database fallback.");
}

export const query = async (text: string, params?: any[]) => {
  if (!pool) return null;
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log(`Executed query: ${text.slice(0, 40)}... (${duration}ms, ${res.rowCount} rows)`);
  return res;
};
