import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { goals, experienceLevel, equipment } = await req.json();

    if (!goals || !experienceLevel || !equipment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a ${experienceLevel} workout plan in JSON format for someone with the following goals: ${goals}. Available equipment: ${equipment}. The plan should include exercises, sets, reps, and rest times. Ensure the output is a valid JSON object with a 'workoutPlan' array, where each element represents a day and contains 'day', 'focus', and 'exercises' properties. Each exercise should have 'name', 'sets', 'reps', and 'rest' (in seconds) properties.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the JSON response
    let workoutPlan;
    try {
      workoutPlan = JSON.parse(text);
    } catch (jsonError) {
      console.error('Failed to parse JSON from Gemini API:', jsonError);
      console.error('Raw Gemini API response:', text);
      return NextResponse.json({ message: 'Failed to generate a valid workout plan. Please try again.' }, { status: 500 });
    }

    return NextResponse.json(workoutPlan);
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return NextResponse.json({ message: 'Error generating workout plan' }, { status: 500 });
  }
}
