import twilio from "twilio";
import type { Cheque } from "@shared/schema";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const recipientNumber = process.env.TWILIO_WHATSAPP_RECIPIENT;

let twilioClient: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken && whatsappNumber) {
  twilioClient = twilio(accountSid, authToken);
  console.log("✅ Twilio WhatsApp client initialized successfully");
  
  if (!recipientNumber) {
    console.warn("⚠️  TWILIO_WHATSAPP_RECIPIENT not configured. WhatsApp alerts will be skipped.");
  } else {
    console.log(`📱 WhatsApp alerts will be sent to: ${recipientNumber}`);
  }
} else {
  console.warn("⚠️  Twilio credentials not configured. WhatsApp alerts will be disabled.");
  console.warn("   Missing:", {
    accountSid: !accountSid,
    authToken: !authToken,
    whatsappNumber: !whatsappNumber,
  });
}

export async function sendChequeAlert(cheque: Cheque): Promise<boolean> {
  if (!twilioClient || !whatsappNumber || !recipientNumber) {
    console.warn("Twilio not fully configured. Skipping WhatsApp alert.");
    return false;
  }

  try {
    const message = formatChequeMessage(cheque);
    
    const result = await twilioClient.messages.create({
      from: whatsappNumber,
      to: `whatsapp:${recipientNumber}`,
      body: message,
    });

    console.log(`✅ WhatsApp alert sent successfully. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp alert:", error);
    return false;
  }
}

function formatChequeMessage(cheque: Cheque): string {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(cheque.amount));

  const issuedDate = new Date(cheque.issuedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dueDate = new Date(cheque.dueDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `🏦 *New Cheque Added*

📋 *Details:*
• Cheque Number: ${cheque.chequeNumber}
• Payee: ${cheque.toPayee}
• Amount: ${amount}
• Issue Date: ${issuedDate}
• Due Date: ${dueDate}
• Status: ${cheque.status.toUpperCase()}

💡 This is an automated alert from your Cheque Management System.`;
}
