export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface FitnessProgram {
  id: string;
  userId: string;
  createdAt: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutDaysPerWeek: number;
  injuries?: string;
  dietaryRestrictions?: string;
  workoutPlan: {
    weeklySchedule: WorkoutDay[];
    notes: string;
  };
  dietPlan: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meals: {
      name: string;
      foods: string[];
      calories: number;
    }[];
    supplements?: string[];
  };
}

const KEY = "codeflex_programs";

export function getPrograms(userId: string): FitnessProgram[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const all: FitnessProgram[] = JSON.parse(raw);
    return all
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function saveProgram(program: Omit<FitnessProgram, "id" | "createdAt">): FitnessProgram {
  const newProgram: FitnessProgram = {
    ...program,
    id: `prog_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const raw = localStorage.getItem(KEY);
  const all: FitnessProgram[] = raw ? JSON.parse(raw) : [];
  all.push(newProgram);
  localStorage.setItem(KEY, JSON.stringify(all));
  return newProgram;
}

export function getProgramById(id: string): FitnessProgram | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  const all: FitnessProgram[] = JSON.parse(raw);
  return all.find((p) => p.id === id) ?? null;
}

export function deleteProgram(id: string): void {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  const all: FitnessProgram[] = JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(all.filter((p) => p.id !== id)));
}