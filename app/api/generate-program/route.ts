import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      age, gender, height, weight,
      fitnessGoal, fitnessLevel,
      workoutDaysPerWeek, injuries, dietaryRestrictions,
    } = body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an elite personal trainer and nutritionist. Always respond with valid JSON only. No markdown, no backticks, no explanation.",
        },
        {
          role: "user",
          content: `Generate a complete fitness program for this person:
- Age: ${age}
- Gender: ${gender}
- Height: ${height}
- Weight: ${weight}
- Goal: ${fitnessGoal}
- Fitness Level: ${fitnessLevel}
- Training Days/Week: ${workoutDaysPerWeek}
- Injuries: ${injuries || "None"}
- Dietary Restrictions: ${dietaryRestrictions || "None"}

Return ONLY this JSON structure:
{
  "name": "Program name based on their goal",
  "workoutPlan": {
    "weeklySchedule": [
      {
        "day": "Monday",
        "focus": "Chest and Triceps",
        "exercises": [
          {
            "name": "Bench Press",
            "sets": 4,
            "reps": "8-10",
            "rest": "90 sec",
            "notes": "Keep elbows at 45 degrees"
          }
        ]
      }
    ],
    "notes": "General training tips"
  },
  "dietPlan": {
    "calories": 2000,
    "protein": 150,
    "carbs": 200,
    "fat": 70,
    "meals": [
      {
        "name": "Breakfast",
        "foods": ["Oats", "Banana", "Eggs"],
        "calories": 500
      }
    ],
    "supplements": ["Whey protein", "Creatine"]
  }
}

Generate exactly ${workoutDaysPerWeek} workout days.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, program: parsed });
  } catch (error) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate program" },
      { status: 500 }
    );
  }
}