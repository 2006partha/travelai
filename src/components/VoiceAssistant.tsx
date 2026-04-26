"use client";
import { useState, useRef } from "react";
import { Button } from "./ui/button";

export function VoiceAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [log, setLog] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const toggleVoice = async () => {
    if (isActive) {
      if (wsRef.current) wsRef.current.close();
      setIsActive(false);
      setLog("Disconnected.");
      return;
    }

    setIsActive(true);
    setLog("Connecting to gemini-3.1-flash-live-preview...");

    // Requires the client to have access to the API key for direct WebSocket connection.
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      setLog("Error: Missing GEMINI_API_KEY in .env");
      setTimeout(() => setIsActive(false), 3000);
      return;
    }

    // Connect to Live API
    const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setLog("Connected! Ready to speak.");
      // Send initial setup
      ws.send(JSON.stringify({
        setup: {
          model: "models/gemini-3.1-flash-live-preview"
        }
      }));
    };

    ws.onmessage = async (e) => {
      // In a full implementation, we parse the JSON, extract the base64 PCM audio data, 
      // convert it to a Float32Array, and play it using the Web Audio API AudioContext.
      setLog("Receiving audio response...");
    };

    ws.onerror = (e) => {
      console.error("Live API Error:", e);
      setLog("WebSocket connection failed.");
    };

    ws.onclose = () => {
      setIsActive(false);
      setLog("Disconnected.");
    };
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-2xl shadow-2xl w-64 border border-slate-100 mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <p className="text-sm font-bold text-slate-800">Voice Assistant</p>
          </div>
          <p className="text-xs text-slate-500 font-medium">{log}</p>
        </div>
      )}
      <Button
        onClick={toggleVoice}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 border-none ${isActive ? "bg-rose-500 hover:bg-rose-600 animate-bounce" : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"}`}
      >
        {isActive ? "🛑" : "🎙️"}
      </Button>
    </div>
  );
}
