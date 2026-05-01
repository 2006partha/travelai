"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Volume2, X } from "lucide-react";

type Message = { role: "user" | "assistant"; text: string };

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm your TravelAI assistant. Ask me anything about planning your trip!" }
  ]);
  const [bars, setBars] = useState<number[]>(Array(20).fill(4));
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Animate bars
  const animateBars = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const step = Math.floor(data.length / 20);
      setBars(Array.from({ length: 20 }, (_, i) => {
        const val = data[i * step] || 0;
        return Math.max(4, (val / 255) * 60);
      }));
    } else if (isListening) {
      // Idle animation when no audio context
      setBars(prev => prev.map(() => Math.random() * 30 + 4));
    }
    animFrameRef.current = requestAnimationFrame(animateBars);
  }, [isListening]);

  const stopAnimation = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setBars(Array(20).fill(4));
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    // Pick a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const getAIResponse = async (userText: string): Promise<string> => {
    try {
      const res = await fetch("/api/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.reply || "I couldn't process that. Please try again.";
    } catch {
      return "Sorry, I'm having trouble connecting. Please try again later.";
    }
  };

  const startListening = async () => {
    setError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }

    // Start microphone visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
    } catch {
      // No mic access — just animate randomly
      analyserRef.current = null;
    }

    animFrameRef.current = requestAnimationFrame(animateBars);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(current);
    };

    recognition.onend = async () => {
      setIsListening(false);
      stopAnimation();

      // Stop mic stream
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      analyserRef.current = null;

      if (transcript.trim()) {
        const userMsg = transcript.trim();
        setTranscript("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);

        const reply = await getAIResponse(userMsg);
        setMessages(prev => [...prev, { role: "assistant", text: reply }]);
        speak(reply);
      }
    };

    recognition.onerror = (e: any) => {
      setError(`Error: ${e.error}`);
      setIsListening(false);
      stopAnimation();
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsListening(false);
    stopAnimation();
  };

  useEffect(() => {
    return () => {
      stopAnimation();
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
      window.speechSynthesis.cancel();
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-slate-900 rotate-45"
            : "bg-gradient-to-br from-indigo-500 to-violet-600"
        }`}
        aria-label="Voice Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <Mic className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-[380px] max-h-[580px] bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-black text-sm tracking-wide">TravelAI Voice</p>
                  <p className="text-indigo-200 text-xs font-medium">
                    {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready"}
                  </p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${isListening ? "bg-rose-400 animate-pulse" : isSpeaking ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`} />
            </div>

            {/* Visualizer bars */}
            <div className="flex items-end justify-center gap-[3px] h-12 mt-4">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="w-[6px] rounded-full transition-all duration-75"
                  style={{
                    height: `${isListening || isSpeaking ? h : 4}px`,
                    background: isListening
                      ? `rgba(255,255,255,${0.4 + (h / 60) * 0.6})`
                      : isSpeaking
                      ? `rgba(52,211,153,${0.4 + (h / 60) * 0.6})`
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Live transcript preview */}
            {isListening && transcript && (
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-indigo-100 text-indigo-700 text-sm font-medium italic border border-indigo-200">
                  {transcript}...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-bold border-t border-rose-100">
              {error}
            </div>
          )}

          {/* Controls */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                isListening
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-100"
                  : isSpeaking
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-indigo-600 text-white shadow-lg shadow-slate-200"
              }`}
            >
              {isListening ? (
                <><MicOff className="w-5 h-5" /> Stop Listening</>
              ) : isSpeaking ? (
                <><Volume2 className="w-5 h-5 animate-pulse" /> AI is speaking...</>
              ) : (
                <><Mic className="w-5 h-5" /> Tap to Speak</>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium mt-2">
              Powered by Web Speech API + Gemini
            </p>
          </div>
        </div>
      )}
    </>
  );
}
