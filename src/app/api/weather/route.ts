import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.WEATHERSTACK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Weather API key not configured" },
        { status: 500 }
      );
    }

    // Fetch weather data from Weatherstack
    const weatherResponse = await fetch(
      `http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(location)}`
    );

    if (!weatherResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: weatherResponse.status }
      );
    }

    const weatherData = await weatherResponse.json();

    // Check for API errors
    if (weatherData.error) {
      return NextResponse.json(
        { error: weatherData.error.info || "Failed to fetch weather data" },
        { status: 400 }
      );
    }

    // Format response to match the frontend expectations
    const formattedData = {
      location: weatherData.location.name,
      country: weatherData.location.country,
      temperature: weatherData.current.temperature,
      feelsLike: weatherData.current.feelslike,
      humidity: weatherData.current.humidity,
      description: weatherData.current.weather_descriptions[0],
      icon: weatherData.current.weather_icons[0],
      windSpeed: weatherData.current.wind_speed,
      pressure: weatherData.current.pressure,
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}