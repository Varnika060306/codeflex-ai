"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Plus, Mic, Dumbbell, Apple, Calendar, Trash2, ChevronRight } from "lucide-react";
import { getPrograms, deleteProgram, FitnessProgram } from "@/lib/storage";

export default function DashboardPage() {
  const { user } = useUser();
  const [programs, setPrograms] = useState<FitnessProgram[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.id) setPrograms(getPrograms(user.id));
  }, [user?.id]);

  function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Delete this program?")) {
      deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    }
  }

  if (!mounted) return null;
  const latest = programs[0];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-[#00ff88]/50 tracking-widest mb-1"
            style={{ fontFamily: "Share Tech Mono, monospace" }}>
            // CONTROL CENTER
          </div>
          <h1 className="text-3xl font-black text-white"
            style={{ fontFamily: "Orbitron, monospace" }}>
            WELCOME,{" "}
            <span className="text-[#00ff88]">
              {user?.firstName?.toUpperCase() ?? "ATHLETE"}
            </span>
          </h1>
          <p className="text-white/40 mt-2">
            {programs.length === 0
              ? "No programs yet. Create your first AI fitness plan."
              : `${programs.length} program${programs.length > 1 ? "s" : ""} — latest is active`}
          </p>
        </div>
        <Link href="/onboarding" className="btn-neon-solid flex items-center gap-2">
          <Plus size={14} /> New Program
        </Link>
      </div>

      {/* Empty state */}
      {programs.length === 0 && (
        <div className="cyber-card border border-[#00ff88]/20 p-12 text-center">
          <div className="w-16 h-16 border border-[#00ff88]/30 flex items-center justify-center mx-auto mb-6">
            <Mic size={24} className="text-[#00ff88]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3"
            style={{ fontFamily: "Orbitron, monospace" }}>
            START YOUR JOURNEY
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Talk to your AI coach. It will ask about your goals and generate a fully personalized plan.
          </p>
          <Link href="/onboarding" className="btn-neon-solid inline-flex items-center gap-2">
            <Mic size={14} /> Launch AI Coach
          </Link>
        </div>
      )}

      {/* Latest program */}
      {latest && (
        <div>
          <div className="text-xs text-[#00ff88]/50 tracking-widest mb-4"
            style={{ fontFamily: "Share Tech Mono, monospace" }}>
            // ACTIVE PROGRAM
          </div>
          <Link href={`/program/${latest.id}`}>
            <div className="cyber-card border border-[#00ff88]/25 p-6 hover:border-[#00ff88]/50 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#00ff88] mb-1"
                    style={{ fontFamily: "Orbitron, monospace" }}>
                    {latest.name}
                  </h2>
                  <p className="text-xs text-white/30">
                    Created {new Date(latest.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight size={20} className="text-[#00ff88]/40 group-hover:text-[#00ff88] transition-colors" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Goal", value: latest.fitnessGoal, icon: "🎯" },
                  { label: "Level", value: latest.fitnessLevel, icon: "⚡" },
                  { label: "Days/Week", value: `${latest.workoutDaysPerWeek}x`, icon: "📅" },
                  { label: "Calories", value: `${latest.dietPlan?.calories ?? "—"}`, icon: "🔥" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0a1520] border border-white/5 p-3">
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="text-sm font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Older programs */}
      {programs.length > 1 && (
        <div>
          <div className="text-xs text-white/30 tracking-widest mb-4"
            style={{ fontFamily: "Share Tech Mono, monospace" }}>
            // PREVIOUS PROGRAMS
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {programs.slice(1).map((program) => (
              <Link key={program.id} href={`/program/${program.id}`}>
                <div className="cyber-card border border-white/8 p-5 hover:border-[#00ff88]/20 transition-all group relative">
                  <button
                    onClick={(e) => handleDelete(program.id, e)}
                    className="absolute top-4 right-4 p-1.5 text-white/20 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <h3 className="text-sm font-bold text-white/70 group-hover:text-white mb-2 pr-8"
                    style={{ fontFamily: "Orbitron, monospace" }}>
                    {program.name}
                  </h3>
                  <p className="text-xs text-white/30 mb-3">
                    {new Date(program.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Dumbbell size={11} /> {program.fitnessGoal}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {program.workoutDaysPerWeek}x/week
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
        {[
          { icon: Mic, label: "New AI Session", desc: "Voice onboarding", href: "/onboarding", color: "text-[#00ff88]" },
          { icon: Dumbbell, label: "View Workout", desc: "Active program", href: latest ? `/program/${latest.id}` : "/onboarding", color: "text-[#00e5ff]" },
          { icon: Apple, label: "View Diet", desc: "Nutrition guide", href: latest ? `/program/${latest.id}?tab=diet` : "/onboarding", color: "text-[#ff6b00]" },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="cyber-card border border-white/8 p-5 hover:bg-white/3 transition-all flex items-center gap-4">
              <action.icon className={action.color} size={20} />
              <div>
                <div className={`text-xs font-bold tracking-wide ${action.color}`}
                  style={{ fontFamily: "Orbitron, monospace" }}>
                  {action.label.toUpperCase()}
                </div>
                <div className="text-xs text-white/30 mt-0.5">{action.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}