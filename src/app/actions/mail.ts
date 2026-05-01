"use server";
import { Resend } from "resend";
import PDFDocument from "pdfkit";
import { getAuthUser } from "./auth";
import { prisma } from "@/lib/prisma";

async function generateTripPDF(trip: any): Promise<Buffer | null> {
  return new Promise((resolve) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => {
        console.error("PDF generation internal error:", err);
        resolve(null);
      });

      doc.rect(0, 0, doc.page.width, 80).fill("#4f46e5");
      doc.fillColor("white").font("Helvetica-Bold").fontSize(20).text("TravelAI Itinerary", 50, 30);
      doc.fillColor("#1e1b4b").moveDown(4);
      doc.fontSize(16).text(trip.title || trip.destination);
      doc.fontSize(10).font("Helvetica").text(`Destination: ${trip.destination}`);
      doc.moveDown(2);
      
      for (const day of trip.days) {
        doc.fillColor("#4f46e5").font("Helvetica-Bold").fontSize(12).text(`Day ${day.index}: ${day.theme || ""}`);
        for (const act of day.activities) {
          doc.fillColor("#111827").font("Helvetica").fontSize(10).text(`• ${act.time}: ${act.title} ($${act.estimatedCost})`);
        }
        doc.moveDown(1);
      }
      doc.end();
    } catch (e) {
      console.error("PDF generation catch block error:", e);
      resolve(null);
    }
  });
}

export async function emailTripAction(tripId: string) {
  try {
    const user = await getAuthUser();
    if (!user) return { success: false, message: "Unauthorized: Please login again." };

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) return { success: false, message: "Server configuration error: Missing Resend API Key." };

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        days: { include: { activities: true }, orderBy: { index: "asc" } }
      }
    });

    if (!trip) return { success: false, message: "Trip not found." };

    // Try PDF but don't crash if it fails
    const pdfBuffer = await generateTripPDF(trip);

    // Build rich HTML content
    const daysHtml = trip.days.map((day: any) => `
      <div style="margin-bottom:20px; border-left: 3px solid #4f46e5; padding-left: 15px;">
        <h3 style="color:#1e1b4b; margin:0;">Day ${day.index}: ${day.theme || ""}</h3>
        <ul style="list-style:none; padding:0; margin:10px 0;">
          ${day.activities.map((act: any) => `
            <li style="margin-bottom:5px; font-size:14px; color:#374151;">
              <strong>${act.time}</strong>: ${act.title} ($${act.estimatedCost})
            </li>
          `).join("")}
        </ul>
      </div>
    `).join("");

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h1 style="color: #4f46e5;">TravelAI: ${trip.destination}</h1>
        <p><strong>Budget:</strong> ${trip.budget}</p>
        <p><strong>Duration:</strong> ${trip.days.length} Days</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        ${daysHtml}
        ${!pdfBuffer ? `<p style="color:#6b7280; font-size:12px; margin-top:20px;">(Note: PDF attachment was skipped due to server load, but here is your full itinerary!)</p>` : ""}
      </div>
    `;

    const resend = new Resend(resendKey);
    const attachments = pdfBuffer ? [{ filename: `${trip.destination}_itinerary.pdf`, content: pdfBuffer }] : [];

    const { data, error } = await resend.emails.send({
      from: "TravelAI <onboarding@resend.dev>",
      to: user.email,
      subject: `Your Itinerary: ${trip.destination} 🗺️`,
      html,
      attachments
    });

    if (error) return { success: false, message: `Resend Error: ${error.message}` };

    return { success: true, message: `Itinerary sent to ${user.email}! ${pdfBuffer ? "(with PDF)" : "(Text version)"}` };

  } catch (err: any) {
    console.error("Critical System Error:", err);
    return { success: false, message: "System Error: " + (err.message || "Unknown error") };
  }
}
