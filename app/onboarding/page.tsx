"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Mic, MicOff, Loader2, ChevronRight,
  CheckCircle2, Dumbbell, User, Activity,
} from "lucide-react";
import { saveProgram } from "@/lib/storage";
import getVapiInstance from "@/lib/vapi.sdk";

interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutDaysPerWeek: string;
  injuries: string;
  dietaryRestrictions: string;
}

const GOALS = ["Weight Loss", "Muscle Gain", "Strength", "Endurance", "General Fitness"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Elite"];
const DAYS = ["2", "3", "4", "5", "6"];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [generatingText, setGeneratingText] = useState("Initializing AI...");

  // Vapi states
  const [callActive, setCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [transcript, setTranscript] = useState<string[]>([]);
  const transcriptRef = useRef<string[]>([]);

  const [profile, setProfile] = useState<UserProfile>({
    age: "", gender: "", height: "", weight: "",
    fitnessGoal: "", fitnessLevel: "",
    workoutDaysPerWeek: "4",
    injuries: "", dietaryRestrictions: "",
  });

  // Loading messages while generating
  useEffect(() => {
    if (!generating) return;
    const messages = [
      "Analyzing your profile...",
      "Designing workout schedule...",
      "Calculating training volume...",
      "Building your nutrition plan...",
      "Finalizing your program...",
    ];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % messages.length;
      setGeneratingText(messages[i]);
    }, 1800);
    return () => clearInterval(timer);
  }, [generating]);

  // Vapi event listeners
  useEffect(() => {
    const vapi = getVapiInstance();

    vapi.on("call-start", () => {
      setCallStatus("active");
      setCallActive(true);
      // Reset transcript on new call
      transcriptRef.current = [];
      setTranscript([]);
    });

    vapi.on("call-end", () => {
      setCallStatus("ended");
      setCallActive(false);
      handleVoiceComplete(transcriptRef.current);
    });

    vapi.on("message", (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const line = `${message.role}: ${message.transcript}`;
        setTranscript((prev) => [...prev, line]);
        transcriptRef.current = [...transcriptRef.current, line];
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  async function startVoiceCall() {
    setCallStatus("connecting");
    const vapi = getVapiInstance();
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!);
  }

  async function stopVoiceCall() {
    const vapi = getVapiInstance();
    vapi.stop();
    setCallStatus("idle");
    setCallActive(false);
  }

  async function handleVoiceComplete(callTranscript: string[]) {
    if (callTranscript.length === 0) return;

    try {
      const transcriptText = callTranscript.join("\n");

      const res = await fetch("/api/parse-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      const data = await res.json();
      if (data.profile) {
      const cleaned = {
       ...data.profile,
       age: data.profile.age?.toString().replace(/[^0-9]/g, "") || "",
      };
      setProfile((prev) => ({ ...prev, ...cleaned }));
    }
    } catch (err) {
      console.error("Failed to parse transcript", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch("/api/generate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const saved = saveProgram({
        userId: user!.id,
        name: data.program.name,
        age: Number(profile.age),
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        fitnessGoal: profile.fitnessGoal,
        fitnessLevel: profile.fitnessLevel,
        workoutDaysPerWeek: Number(profile.workoutDaysPerWeek),
        injuries: profile.injuries,
        dietaryRestrictions: profile.dietaryRestrictions,
        workoutPlan: data.program.workoutPlan,
        dietPlan: data.program.dietPlan,
      });

      setDone(true);
      setTimeout(() => router.push(`/program/${saved.id}`), 2000);
    } catch (err) {
      console.error(err);
      alert("Error generating program. Check your API keys in .env.local");
      setGenerating(false);
    }
  }

  // Generating screen
  if (generating && !done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-24 h-24 border border-[#00ff88]/30 flex items-center justify-center">
          <Loader2 size={36} className="text-[#00ff88] animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#00ff88] mb-3"
            style={{ fontFamily: "Orbitron, monospace" }}>
            BUILDING YOUR PROGRAM
          </h2>
          <p className="text-white/50 text-sm animate-pulse">{generatingText}</p>
        </div>
      </div>
    );
  }

  // Done screen
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <CheckCircle2 size={64} className="text-[#00ff88]" />
        <h2 className="text-2xl font-bold text-white"
          style={{ fontFamily: "Orbitron, monospace" }}>
          PROGRAM <span className="text-[#00ff88]">READY</span>
        </h2>
        <p className="text-white/40 text-sm">Redirecting to your program...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <div className="text-xs text-[#00ff88]/50 tracking-widest mb-2"
          style={{ fontFamily: "Share Tech Mono, monospace" }}>
          // ONBOARDING PROTOCOL
        </div>
        <h1 className="text-3xl font-black text-white mb-2"
          style={{ fontFamily: "Orbitron, monospace" }}>
          MEET YOUR <span className="text-[#00ff88]">AI COACH</span>
        </h1>
        <p className="text-white/40">
          Talk to Riley or fill the form below to get your personalized fitness program.
        </p>
      </div>

      {/* Voice Call Card */}
      <div className="cyber-card border border-[#00ff88]/20 p-6 text-center space-y-4">
        <div className="text-xs font-bold text-[#00ff88] tracking-widest"
          style={{ fontFamily: "Orbitron, monospace" }}>
          🎙️ VOICE ONBOARDING
        </div>
        <p className="text-white/40 text-sm">
          Talk to Riley — your AI fitness coach. She'll ask you a few questions and build your program automatically.
        </p>

        {callStatus === "idle" && (
          <button onClick={startVoiceCall}
            className="btn-neon-solid flex items-center gap-2 mx-auto px-6 py-3">
            <Mic size={16} /> Start Voice Call
          </button>
        )}

        {callStatus === "connecting" && (
          <div className="flex items-center gap-2 justify-center text-[#00ff88]">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Connecting to Riley...</span>
          </div>
        )}

        {callStatus === "active" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center text-[#00ff88]">
              <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="text-sm">Riley is listening...</span>
            </div>
            <button onClick={stopVoiceCall}
              className="flex items-center gap-2 mx-auto px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all">
              <MicOff size={16} /> End Call
            </button>
          </div>
        )}

        {callStatus === "ended" && (
          <div className="text-[#00ff88] text-sm">
            ✅ Call complete! Fill in any missing details below and generate your program.
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/20 text-xs tracking-widest">OR FILL MANUALLY</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Manual Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="cyber-card border border-white/8 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={14} className="text-[#00ff88]" />
            <span className="text-xs font-bold text-[#00ff88] tracking-widest"
              style={{ fontFamily: "Orbitron, monospace" }}>
              PERSONAL INFO
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { field: "age", label: "Age", placeholder: "e.g. 20", type: "number" },
              { field: "gender", label: "Gender", placeholder: "Male / Female / Other" },
              { field: "height", label: "Height", placeholder: "e.g. 5'6\" or 168cm" },
              { field: "weight", label: "Weight", placeholder: "e.g. 60kg or 132lbs" },
            ].map(({ field, label, placeholder, type }) => (
              <div key={field}>
                <label className="text-xs text-white/40 tracking-wider block mb-1.5">
                  {label.toUpperCase()}
                </label>
                <input
                  type={type ?? "text"}
                  value={profile[field as keyof UserProfile]}
                  onChange={(e) => setProfile((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#060d12] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88]/40 placeholder:text-white/20 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Fitness Profile */}
        <div className="cyber-card border border-white/8 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={14} className="text-[#00e5ff]" />
            <span className="text-xs font-bold text-[#00e5ff] tracking-widest"
              style={{ fontFamily: "Orbitron, monospace" }}>
              FITNESS PROFILE
            </span>
          </div>
          <div className="mb-4">
            <label className="text-xs text-white/40 tracking-wider block mb-2">FITNESS GOAL</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {GOALS.map((goal) => (
                <button key={goal} type="button"
                  onClick={() => setProfile((p) => ({ ...p, fitnessGoal: goal }))}
                  className={`py-2 px-3 text-xs border transition-all ${
                    profile.fitnessGoal === goal
                      ? "border-[#00ff88]/60 text-[#00ff88] bg-[#00ff88]/10"
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-white/40 tracking-wider block mb-2">FITNESS LEVEL</label>
            <div className="grid grid-cols-4 gap-2">
              {LEVELS.map((level) => (
                <button key={level} type="button"
                  onClick={() => setProfile((p) => ({ ...p, fitnessLevel: level }))}
                  className={`py-2 px-3 text-xs border transition-all ${
                    profile.fitnessLevel === level
                      ? "border-[#00ff88]/60 text-[#00ff88] bg-[#00ff88]/10"
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}>
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 tracking-wider block mb-2">TRAINING DAYS PER WEEK</label>
            <div className="flex gap-2">
              {DAYS.map((d) => (
                <button key={d} type="button"
                  onClick={() => setProfile((p) => ({ ...p, workoutDaysPerWeek: d }))}
                  className={`w-10 h-10 text-sm border transition-all ${
                    profile.workoutDaysPerWeek === d
                      ? "border-[#00ff88]/60 text-[#00ff88] bg-[#00ff88]/10"
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional */}
        <div className="cyber-card border border-white/8 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Dumbbell size={14} className="text-[#ff6b00]" />
            <span className="text-xs font-bold text-[#ff6b00] tracking-widest"
              style={{ fontFamily: "Orbitron, monospace" }}>
              OPTIONAL INFO
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 tracking-wider block mb-1.5">INJURIES / LIMITATIONS</label>
              <textarea
                value={profile.injuries}
                onChange={(e) => setProfile((p) => ({ ...p, injuries: e.target.value }))}
                placeholder="e.g. Bad knees, lower back pain..."
                rows={3}
                className="w-full bg-[#060d12] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88]/40 placeholder:text-white/20 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 tracking-wider block mb-1.5">DIETARY RESTRICTIONS</label>
              <textarea
                value={profile.dietaryRestrictions}
                onChange={(e) => setProfile((p) => ({ ...p, dietaryRestrictions: e.target.value }))}
                placeholder="e.g. Vegetarian, lactose intolerant..."
                rows={3}
                className="w-full bg-[#060d12] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88]/40 placeholder:text-white/20 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!profile.age || !profile.fitnessGoal || !profile.fitnessLevel}
          className="w-full btn-neon-solid flex items-center justify-center gap-2 py-4 disabled:opacity-30 disabled:cursor-not-allowed">
          Generate My Program <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
}