"use client";
import { useState } from "react";
import { emailTripAction } from "@/app/actions/mail";
import { Button } from "@/components/ui/button";

export function MailButtonClient({ tripId }: { tripId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleMail() {
    setStatus("loading");
    try {
      const res = await emailTripAction(tripId);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(res.message);
      }
    } catch (e) {
      setStatus("error");
      setMessage("Failed to send email");
    }
  }

  if (status === "success") {
    return <span className="text-emerald-600 font-semibold px-4 py-2 bg-emerald-50 rounded-lg">Email Sent! 📬</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {status === "error" && <span className="text-red-500 text-sm">{message}</span>}
      <Button 
        onClick={handleMail} 
        disabled={status === "loading"}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
      >
        {status === "loading" ? "Sending..." : "Email Me This Trip 📧"}
      </Button>
    </div>
  );
}
