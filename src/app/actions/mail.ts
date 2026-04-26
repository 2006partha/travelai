"use server";
import nodemailer from "nodemailer";
import { getAuthUser } from "./auth";
import { prisma } from "@/lib/prisma";

export async function emailTripAction(tripId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, message: "Unauthorized" };

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      days: {
        include: { activities: true },
        orderBy: { index: "asc" }
      }
    }
  });

  if (!trip) return { success: false, message: "Trip not found" };

  // For real usage, you need SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env
  // If not provided, we will use a test account for demonstration.
  let transporter;
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test account if no SMTP provided (this works magically in nodemailer for testing)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }

  let htmlContent = `<h1>Your Trip to ${trip.destination}</h1>`;
  htmlContent += `<p><strong>Budget:</strong> ${trip.budget}</p>`;
  htmlContent += `<h2>Itinerary</h2>`;

  trip.days.forEach((day: any) => {
    htmlContent += `<h3>Day ${day.index} - ${new Date(day.date).toDateString()}</h3><ul>`;
    day.activities.forEach((act: any) => {
      htmlContent += `<li><strong>${act.time}</strong>: ${act.title} ($${act.estimatedCost})<br/><i>${act.description || ''}</i></li>`;
    });
    htmlContent += `</ul>`;
  });

  try {
    const info = await transporter.sendMail({
      from: '"TravelAI" <noreply@travelai.com>',
      to: user.email,
      subject: `Your TravelAI Itinerary: ${trip.title}`,
      html: htmlContent,
    });
    
    console.log("Message sent: %s", info.messageId);
    if (!process.env.SMTP_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email", error);
    return { success: false, message: "Failed to send email." };
  }
}
