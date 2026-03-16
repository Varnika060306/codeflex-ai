"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Dumbbell, Apple, Flame,
  Beef, Wheat, Droplet, Clock, ChevronDown,
  ChevronUp, RotateCcw, Pill, Calendar, Zap,
} from "lucide-react";
import { getProgramById, FitnessProgram, WorkoutDay } from "@/lib/storage";

export default function ProgramPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [program, setProgram] = useState<FitnessProgram | null>(null);
  const [activeTab, setActiveTab] = useState<"workout" | "diet">(
    searchParams.get("tab") === "diet" ? "diet" : "workout"
  );
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    const p = getProgramById(id);
    if (!p) { router.push("/dashboard"); return; }
    setProgram(p);
    if (p.workoutPlan?.weeklySchedule?.length > 0) {
      setExpandedDay(p.workoutPlan.weeklySchedule[0].day);
    }
  }, [id]);

  if (!program) return null;

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Back + Header */}
      <div>
        <Link href="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mb-4">
          <ArrowLeft size={12} /> BACK TO DASHBOARD
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-[#00ff88]/50 tracking-widest mb-1"
              style={{ fontFamily: "Share Tech Mono, monospace" }}>
              // ACTIVE PROGRAM
            </div>
            <h1 className="text-3xl font-black text-white"
              style={{ fontFamily: "Orbitron, monospace" }}>
              {program.name}
            </h1>
            <p className="text-xs text-white/30 mt-2">
              Created {new Date(program.createdAt).toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          </div>
          <Link href="/onboarding" className="btn-neon flex items-center gap-2 text-xs">
            <RotateCcw size={12} /> New Program
          </Link>
        </div>
      </div>

      {/* Profile badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: program.fitnessGoal, icon: "🎯" },
          { label: program.fitnessLevel, icon: "⚡" },
          { label: `${program.workoutDaysPerWeek}x per week`, icon: "📅" },
          { label: `${program.age}y / ${program.gender}`, icon: "👤" },
          { label: program.weight, icon: "⚖️" },
          { label: program.height, icon: "📏" },
        ].map((badge, i) => (
          <span key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1520] border border-white/8 text-xs text-white/50">
            {badge.icon} {badge.label}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/8">
        {(["workout", "diet"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest transition-all border-b-2 -mb-px ${
              activeTab === tab
                ? "text-[#00ff88] border-[#00ff88]"
                : "text-white/30 border-transparent hover:text-white/50"
            }`}
            style={{ fontFamily: "Orbitron, monospace" }}>
            {tab === "workout" ? <Dumbbell size={13} /> : <Apple size={13} />}
            {tab.toUpperCase()} PLAN
          </button>
        ))}
      </div>

      {/* WORKOUT TAB */}
      {activeTab === "workout" && (
        <div className="space-y-4">
          {program.workoutPlan?.notes && (
            <div className="cyber-card border border-[#00e5ff]/15 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={12} className="text-[#00e5ff]" />
                <span className="text-xs text-[#00e5ff]/60 tracking-widest"
                  style={{ fontFamily: "Share Tech Mono, monospace" }}>
                  TRAINER NOTES
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{program.workoutPlan.notes}</p>
            </div>
          )}

          {program.workoutPlan?.weeklySchedule?.map((day: WorkoutDay) => (
            <div key={day.day} className="cyber-card border border-white/8">
              <button
                onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                className="w-full flex items-center justify-between p-5 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[#00ff88]/20 flex items-center justify-center">
                    <Calendar size={16} className="text-[#00ff88]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm"
                      style={{ fontFamily: "Orbitron, monospace" }}>
                      {day.day.toUpperCase()}
                    </div>
                    <div className="text-xs text-[#00ff88]/60 mt-0.5">{day.focus}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">
                    {day.exercises?.length ?? 0} exercises
                  </span>
                  {expandedDay === day.day
                    ? <ChevronUp size={16} className="text-[#00ff88]/40" />
                    : <ChevronDown size={16} className="text-white/30" />}
                </div>
              </button>

              {expandedDay === day.day && (
                <div className="border-t border-white/5 p-5 space-y-3">
                  {day.exercises?.map((ex, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[#0a1520] border border-white/5">
                      <div className="w-7 h-7 border border-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-[#00ff88]"
                          style={{ fontFamily: "Orbitron, monospace" }}>{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm mb-2">{ex.name}</div>
                        <div className="flex flex-wrap gap-3 mb-1">
                          <span className="text-xs text-[#00ff88]/70 flex items-center gap-1">
                            <Dumbbell size={10} /> {ex.sets} sets
                          </span>
                          <span className="text-xs text-[#00e5ff]/70">× {ex.reps} reps</span>
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <Clock size={10} /> {ex.rest}
                          </span>
                        </div>
                        {ex.notes && (
                          <p className="text-xs text-white/40 italic">{ex.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DIET TAB */}
      {activeTab === "diet" && program.dietPlan && (
        <div className="space-y-6">
          {/* Macros */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", value: `${program.dietPlan.calories}`, unit: "kcal", icon: Flame, color: "text-[#ff6b00]", border: "border-[#ff6b00]/20" },
              { label: "Protein", value: `${program.dietPlan.protein}g`, unit: "/day", icon: Beef, color: "text-red-400", border: "border-red-400/20" },
              { label: "Carbs", value: `${program.dietPlan.carbs}g`, unit: "/day", icon: Wheat, color: "text-yellow-400", border: "border-yellow-400/20" },
              { label: "Fat", value: `${program.dietPlan.fat}g`, unit: "/day", icon: Droplet, color: "text-[#00e5ff]", border: "border-[#00e5ff]/20" },
            ].map((m) => (
              <div key={m.label} className={`cyber-card border ${m.border} p-5`}>
                <m.icon size={18} className={`${m.color} mb-3`} />
                <div className={`text-2xl font-black ${m.color}`}
                  style={{ fontFamily: "Orbitron, monospace" }}>{m.value}</div>
                <div className="text-xs text-white/30 tracking-wider mt-1">
                  {m.label.toUpperCase()} {m.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Meals */}
          <div className="grid md:grid-cols-2 gap-4">
            {program.dietPlan.meals?.map((meal, i) => (
              <div key={i} className="cyber-card border border-white/8 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-[#00ff88]/20 flex items-center justify-center">
                      <span className="text-xs text-[#00ff88]"
                        style={{ fontFamily: "Orbitron, monospace" }}>{i + 1}</span>
                    </div>
                    <span className="font-bold text-white text-sm"
                      style={{ fontFamily: "Orbitron, monospace" }}>
                      {meal.name.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-[#ff6b00]/70 flex items-center gap-1">
                    <Flame size={10} /> {meal.calories} kcal
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {meal.foods?.map((food, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                      <span className="w-1 h-1 bg-[#00ff88]/40 rounded-full flex-shrink-0" />
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Supplements */}
          {program.dietPlan.supplements && program.dietPlan.supplements.length > 0 && (
            <div className="cyber-card border border-[#00e5ff]/15 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Pill size={14} className="text-[#00e5ff]" />
                <span className="text-xs font-bold text-[#00e5ff] tracking-widest"
                  style={{ fontFamily: "Orbitron, monospace" }}>
                  RECOMMENDED SUPPLEMENTS
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {program.dietPlan.supplements.map((s, i) => (
                  <span key={i}
                    className="px-3 py-1.5 border border-[#00e5ff]/20 bg-[#00e5ff]/5 text-xs text-[#00e5ff]/70">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}