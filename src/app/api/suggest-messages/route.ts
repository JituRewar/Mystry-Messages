import { NextResponse } from "next/server";

const FALLBACK_SUGGESTIONS = [
  "What is a hobby you've always wanted to try but never have?",
  "If you could travel anywhere in the world right now, where would you go?",
  "What is the most memorable advice you have ever received?"
];

async function generateSuggestions() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables. Using fallback suggestions.");
      return FALLBACK_SUGGESTIONS;
    }

    const prompt = `Create three engaging, creative, and anonymous questions, prompts, or feedback starters for a mystery message board where friends can send messages to a user.
The questions should be friendly, fun, slightly mysterious, or thought-provoking.
Format the output as a JSON object containing a 'suggestions' field which is an array of exactly 3 strings. Do not include any markdown formatting or surrounding text other than the JSON itself.
Example response:
{
  "suggestions": [
    "What's a secret talent you have that nobody knows about?",
    "If you could spend a day in any movie universe, which one would it be?",
    "What is the nicest thing someone has ever done for you?"
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error status:", response.status, errorText);
      return FALLBACK_SUGGESTIONS;
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Empty text response from Gemini API");
      return FALLBACK_SUGGESTIONS;
    }

    const parsedData = JSON.parse(textResponse.trim());
    if (parsedData.suggestions && Array.isArray(parsedData.suggestions)) {
      return parsedData.suggestions.slice(0, 3);
    }

    return FALLBACK_SUGGESTIONS;
  } catch (error) {
    console.error("Error generating suggested messages with Gemini:", error);
    return FALLBACK_SUGGESTIONS;
  }
}

export async function GET() {
  const suggestions = await generateSuggestions();
  return NextResponse.json({ success: true, suggestions });
}

export async function POST() {
  const suggestions = await generateSuggestions();
  return NextResponse.json({ success: true, suggestions });
}
