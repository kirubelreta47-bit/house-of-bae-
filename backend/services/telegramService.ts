import { Booking } from "../../src/types";

export async function sendTelegramNotification(b: Booking) {
  try {
    const targetChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || "6933707628";
    const targetToken = process.env.TELEGRAM_BOT_TOKEN || "8019288831:AAGdkb8yYlPC9dikU1sRUTWtU1DqWWvKNwE";

    if (!targetToken || !targetChatId) {
      console.warn("Telegram bot token or chat ID is missing.");
      return;
    }

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
      console.log("Telegram notification sent successfully to chat:", targetChatId);
    }
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
  }
}
