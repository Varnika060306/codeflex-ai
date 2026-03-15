"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Zap, Brain, Mic, BarChart3, ChevronRight, Shield, Target } from "lucide-react";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;

  return (
    <main className="cyber-grid-bg min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
            <Zap size={16} className="text-[#00ff88]" />
          </div>
          <span className="font-bold tracking-widest text-[#00ff88] glow-green" style={{fontFamily:"Orbitron,monospace", fontSize:"0.85rem"}}>
            CODEFLEX<span className="text-white/40">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <Link href="/dashboard" className="btn-neon-solid">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="btn-neon">Sign In</Link>
              <Link href="/sign-up" className="btn-neon-solid">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-32">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-white/10 bg-white/5">
          <span className="status-dot" />
          <span className="text-xs text-[#00ff88]/70 tracking-widest" style={{fontFamily:"Share Tech Mono,monospace"}}>
            AI SYSTEM ONLINE
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none" style={{fontFamily:"Orbitron,monospace"}}>
          <span className="text-white">YOUR PERSONAL</span><br />
          <span className="text-[#00ff88] glow-green">AI TRAINER</span><br />
          <span className="text-white/30 text-3xl md:text-5xl tracking-widest">AWAITS</span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
          Talk to your AI coach. Get a personalized workout & diet plan generated in seconds.
          Train smarter. No guesswork.
        </p>

        <div className="flex items-center gap-4">
          <Link href={isSignedIn ? "/dashboard" : "/sign-up"} className="btn-neon-solid flex items-center gap-2">
            Start Training <ChevronRight size={14} />
          </Link>
          <Link href={isSignedIn ? "/onboarding" : "/sign-up"} className="btn-neon flex items-center gap-2">
            <Mic size={14} /> Voice Setup
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-20 pt-8 border-t border-white/10">
          {[
            { val: "10K+", label: "Athletes" },
            { val: "50+", label: "Workout Types" },
            { val: "AI", label: "Powered" },
            { val: "24/7", label: "Available" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-[#00ff88] glow-green" style={{fontFamily:"Orbitron,monospace"}}>{s.val}</div>
              <div className="text-xs text-white/30 tracking-widest mt-1" style={{fontFamily:"Share Tech Mono,monospace"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <div className="text-xs text-[#00ff88]/60 tracking-widest mb-3" style={{fontFamily:"Share Tech Mono,monospace"}}>// CAPABILITIES</div>
          <h2 className="text-3xl font-bold text-white" style={{fontFamily:"Orbitron,monospace"}}>NEXT-GEN FITNESS TECH</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Mic, title: "VOICE AI ONBOARDING", desc: "Speak with your AI coach. It asks about your goals, injuries, and schedule — then builds your plan." },
            { icon: Brain, title: "GEMINI-POWERED PLANS", desc: "Google Gemini generates fully customized workout and diet plans based on your exact profile." },
            { icon: Target, title: "GOAL TRACKING", desc: "Multiple program support. Switch between plans and adjust as you evolve." },
            { icon: BarChart3, title: "SMART NUTRITION", desc: "Calorie targets, macro splits, and meal plans tailored to your dietary needs." },
            { icon: Shield, title: "INJURY AWARE", desc: "Tell the AI about limitations. Your plan avoids exercises that could worsen injuries." },
            { icon: Zap, title: "INSTANT GENERATION", desc: "Full weekly program ready in under 30 seconds. No waiting — just results." },
          ].map((f) => (
            <div key={f.title} className="cyber-card p-6">
              <f.icon className="text-[#00ff88] mb-4" size={22} />
              <h3 className="text-xs font-bold tracking-widest text-[#00ff88] mb-3" style={{fontFamily:"Orbitron,monospace"}}>{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center">
        <span className="text-xs text-white/20" style={{fontFamily:"Share Tech Mono,monospace"}}>
          CODEFLEX.AI — POWERED BY GOOGLE GEMINI + VAPI
        </span>
      </footer>
    </main>
  );
}