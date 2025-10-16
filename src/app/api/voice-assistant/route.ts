import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { input, language } = await request.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 }
      );
    }

    // Call OpenAI API with context about farming
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful farming assistant for Karnataka farmers. Respond in Kannada (Kannada script). 
            Help farmers with:
            - Weather and climate advice
            - Soil and crop information
            - Farming best practices
            - Pest control
            - Irrigation tips
            - General farming queries
            
            Keep responses concise (2-3 sentences max) and practical. Use simple Kannada that farmers can understand.
            
            If the user asks about:
            - Weather for a location: Say you're fetching weather info and suggest they check the weather widget
            - Soil analysis: Direct them to use the soil analysis feature by uploading a photo
            - Crop information: Direct them to the crop info page for detailed information
            - AI chat: Direct them to the AI chat page for more detailed conversations
            
            Always be friendly and helpful.`
          },
          {
            role: "user",
            content: input
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content || "ಕ್ಷಮಿಸಿ, ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ";

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Voice assistant API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}