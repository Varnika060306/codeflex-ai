import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Extract fitness profile information from this voice conversation transcript.
Return ONLY a valid JSON object with these exact keys:
{
  "age": "",  // extract ONLY the number, e.g. "21" not "21 years old"
  "gender": "",
  "height": "",
  "weight": "",
  "fitnessGoal": "",
  "fitnessLevel": "",
  "workoutDaysPerWeek": "",
  "injuries": "",
  "dietaryRestrictions": ""
}

For fitnessGoal use one of: Weight Loss, Muscle Gain, Strength, Endurance, General Fitness
For fitnessLevel use one of: Beginner, Intermediate, Advanced, Elite
For workoutDaysPerWeek use a number between 2-6
If information is not mentioned, leave the field as empty string "".
Return ONLY the JSON, no explanation.

Transcript:
${transcript}
        `,
      },
    ],
  });

  try {
    const text = completion.choices[0].message.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const profile = JSON.parse(clean);
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ profile: null });
  }
}