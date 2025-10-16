"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sprout, ImageIcon, MessageCircle, Phone, BookOpen, LogOut, Sun, Sparkles, Star, Send, Loader2, Cloud, Droplets, Wind, Mic, Volume2, CloudRain, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    message: "",
    rating: 5
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  // Weather states
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Voice assistant states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<'en-IN' | 'kn-IN'>('kn-IN');

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFeedbackForm(prev => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || ""
      }));
    }

    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceInput(transcript);
          handleVoiceCommand(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const fetchWeather = async (loc: string) => {
    setLoadingWeather(true);
    setWeatherError("");
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(loc)}`);
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      } else {
        const error = await response.json();
        setWeatherError(error.error || "Failed to fetch weather");
      }
    } catch (error) {
      setWeatherError("Connection error. Please try again.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleWeatherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setWeatherError("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    setWeatherError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLoadingWeather(true);
        
        try {
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
          if (response.ok) {
            const data = await response.json();
            setWeather(data);
            setLocation(data.location);
          } else {
            const error = await response.json();
            setWeatherError(error.error || "Failed to fetch weather");
          }
        } catch (error) {
          setWeatherError("Connection error. Please try again.");
        } finally {
          setLoadingWeather(false);
          setDetectingLocation(false);
        }
      },
      (error) => {
        setDetectingLocation(false);
        setWeatherError("Unable to retrieve your location. Please enter manually.");
        console.error("Geolocation error:", error);
      }
    );
  };

  const startListening = (lang: 'en-IN' | 'kn-IN') => {
    if (recognition) {
      setVoiceLanguage(lang);
      recognition.lang = lang;
      setIsListening(true);
      setVoiceInput("");
      setVoiceResponse("");
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string, lang: string = 'kn-IN') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Predefined command handling
    // Weather commands
    if (lowerCommand.includes('weather') || lowerCommand.includes('ಹವಾಮಾನ')) {
      const response = "ಹವಾಮಾನ ಮಾಹಿತಿಗಾಗಿ, ದಯವಿಟ್ಟು ಮೇಲಿನ ಹವಾಮಾನ ವಿಜೆಟ್ ಬಳಸಿ ಅಥವಾ ಸ್ವಯಂಚಾಲಿತ ಸ್ಥಳ ಪತ್ತೆ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      return;
    }
    
    // Soil analysis commands
    if (lowerCommand.includes('soil') || lowerCommand.includes('ಮಣ್ಣು')) {
      const response = "ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದೆ. ನೀವು ಮಣ್ಣಿನ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಬಹುದು.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      setTimeout(() => router.push('/soil-analysis'), 2000);
      return;
    }
    
    // Crop info commands
    if (lowerCommand.includes('crop') || lowerCommand.includes('ಬೆಳೆ')) {
      const response = "ಬೆಳೆ ಮಾಹಿತಿ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದೆ. ನೀವು ಯಾವುದೇ ಬೆಳೆಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      setTimeout(() => router.push('/crop-info'), 2000);
      return;
    }
    
    // Chat commands
    if (lowerCommand.includes('chat') || lowerCommand.includes('ಚಾಟ್') || lowerCommand.includes('talk') || lowerCommand.includes('ಮಾತನಾಡು')) {
      const response = "AI ಚಾಟ್ ಪುಟಕ್ಕೆ ಹೋಗುತ್ತಿದೆ. ನೀವು ಕನ್ನಡದಲ್ಲಿ AI ಜೊತೆ ಮಾತನಾಡಬಹುದು.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      setTimeout(() => router.push('/ai-chat'), 2000);
      return;
    }
    
    // Help commands
    if (lowerCommand.includes('help') || lowerCommand.includes('ಸಹಾಯ')) {
      const response = "ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ, ಬೆಳೆ ಮಾಹಿತಿ, ಹವಾಮಾನ, ಅಥವಾ AI ಚಾಟ್ ಬಗ್ಗೆ ಕೇಳಬಹುದು.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      return;
    }

    // Call support commands
    if (lowerCommand.includes('call') || lowerCommand.includes('phone') || lowerCommand.includes('ಕರೆ') || lowerCommand.includes('ಫೋನ್')) {
      const response = "ಸಹಾಯಕ್ಕಾಗಿ ದಯವಿಟ್ಟು 1800-123-4567 ಗೆ ಕರೆ ಮಾಡಿ. ಇದು 24/7 ಲಭ್ಯವಿದೆ.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      return;
    }

    // Feedback commands
    if (lowerCommand.includes('feedback') || lowerCommand.includes('ಪ್ರತಿಕ್ರಿಯೆ')) {
      const response = "ದಯವಿಟ್ಟು ಕೆಳಗೆ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುವ ಫಾರಂ ಬಳಸಿ. ನಿಮ್ಮ ಅನುಭವ ನಮಗೆ ಮುಖ್ಯವಾಗಿದೆ.";
      setVoiceResponse(response);
      speak(response, 'kn-IN');
      return;
    }

    // For any other input, use AI assistant
    try {
      const response = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: command,
          language: "kn"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantResponse = data.response;
        
        setVoiceResponse(assistantResponse);
        speak(assistantResponse, 'kn-IN');
      } else {
        const errorResponse = "ಕ್ಷಮಿಸಿ, ಈಗ ನಾನು ಸಹಾಯ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ";
        setVoiceResponse(errorResponse);
        speak(errorResponse, 'kn-IN');
      }
    } catch (error) {
      console.error("Voice assistant error:", error);
      const errorResponse = "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕದಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ";
      setVoiceResponse(errorResponse);
      speak(errorResponse, 'kn-IN');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackError("");
    setFeedbackSuccess(false);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          name: feedbackForm.name,
          email: feedbackForm.email,
          message: feedbackForm.message,
          rating: feedbackForm.rating
        }),
      });

      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackForm(prev => ({ ...prev, message: "", rating: 5 }));
        setTimeout(() => setFeedbackSuccess(false), 5000);
      } else {
        const data = await response.json();
        setFeedbackError(data.error || "Failed to submit feedback");
      }
    } catch (error) {
      setFeedbackError("Connection error. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header with Parallax Effect */}
      <header className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white shadow-2xl overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/vibrant-panoramic-illustration-of-indian-66f8195f-20251015171111.jpg"
            alt="Farming Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-700/90"></div>
        
        <div className="relative container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-left duration-500">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm animate-pulse">
                <Sprout className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ಕೃಷಿ ಸಹಾಯಕ</h1>
                <p className="text-green-100 text-sm">Krishi Sahayak</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section with Farmer Image */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
          {/* Animated Background Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse delay-300"></div>
          
          {/* Farmer Image */}
          <div className="absolute right-8 bottom-0 hidden md:block opacity-30 hover:opacity-50 transition-opacity duration-300">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/friendly-indian-farmer-smiling-while-exa-453a004b-20251015171146.jpg"
              alt="Farmer"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Sun className="w-12 h-12 text-white mr-4 animate-spin" style={{ animationDuration: '20s' }} />
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                  ನಮಸ್ಕಾರ {user.name}! 🙏
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </h2>
                <p className="text-white/90 text-lg">Welcome to your farming dashboard</p>
              </div>
            </div>
            <p className="text-white/80 mt-4">
              📍 {user.location} | 📞 {user.phoneNumber}
            </p>
          </div>
        </div>

        {/* Weather and Voice Assistant Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weather Widget */}
          <Card className="shadow-2xl border-2 border-blue-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all animate-in fade-in slide-in-from-left duration-500">
            <CardHeader className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <CardTitle className="flex items-center relative z-10">
                <Cloud className="w-6 h-6 mr-2" />
                ಹವಾಮಾನ ಮಾಹಿತಿ / Weather Info
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleWeatherSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="ಸ್ಥಳದ ಹೆಸರು / Enter location (e.g., Bangalore)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <Button
                    type="submit"
                    disabled={loadingWeather}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loadingWeather ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get"}
                  </Button>
                </div>
              </form>

              <div className="mt-4">
                <Button
                  onClick={detectLocation}
                  disabled={detectingLocation || loadingWeather}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  {detectingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 mr-2" />
                      ನನ್ನ ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಿ / Auto-Detect Location
                    </>
                  )}
                </Button>
              </div>

              {weatherError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {weatherError}
                </div>
              )}

              {weather && (
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {weather.location}, {weather.country}
                    </h3>
                    <div className="flex items-center justify-center mt-4">
                      <img
                        src={weather.icon}
                        alt={weather.description}
                        className="w-20 h-20"
                      />
                      <div className="text-5xl font-bold text-gray-800">
                        {weather.temperature}°C
                      </div>
                    </div>
                    <p className="text-gray-600 capitalize mt-2">{weather.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center text-blue-600 mb-1">
                        <Droplets className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold">Humidity</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{weather.humidity}%</p>
                    </div>
                    <div className="bg-cyan-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center text-cyan-600 mb-1">
                        <Wind className="w-5 h-5 mr-1" />
                        <span className="text-sm font-semibold">Wind</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Assistant */}
          <Card className="shadow-2xl border-2 border-purple-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all animate-in fade-in slide-in-from-right duration-500">
            <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <CardTitle className="flex items-center relative z-10">
                <Mic className="w-6 h-6 mr-2" />
                ಧ್ವನಿ ಸಹಾಯಕ / Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Choose language and speak
                </p>
                
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => startListening('kn-IN')}
                    disabled={isListening || !recognition || isSpeaking}
                    className={`${voiceLanguage === 'kn-IN' && isListening ? 'bg-red-500' : 'bg-purple-600'} hover:bg-purple-700`}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    ಕನ್ನಡ
                  </Button>
                  <Button
                    onClick={() => startListening('en-IN')}
                    disabled={isListening || !recognition || isSpeaking}
                    className={`${voiceLanguage === 'en-IN' && isListening ? 'bg-red-500' : 'bg-blue-600'} hover:bg-blue-700`}
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    English
                  </Button>
                </div>

                <button
                  onClick={stopListening}
                  disabled={!isListening}
                  className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-gray-400 cursor-not-allowed"
                  } shadow-lg`}
                >
                  {isListening ? (
                    <Mic className="w-10 h-10 text-white animate-bounce" />
                  ) : isSpeaking ? (
                    <Volume2 className="w-10 h-10 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                {!recognition && (
                  <p className="text-xs text-red-600">
                    Voice recognition not supported in this browser
                  </p>
                )}

                {voiceInput && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-xs text-purple-600 font-semibold mb-1">You said:</p>
                    <p className="text-gray-800">{voiceInput}</p>
                  </div>
                )}

                {voiceResponse && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                    <p className="text-xs text-pink-600 font-semibold mb-1">Assistant:</p>
                    <p className="text-gray-800">{voiceResponse}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1 mt-4 text-left">
                  <p className="font-semibold text-center">Predefined Commands:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold text-purple-600">Kannada:</p>
                      <p>• "ಹವಾಮಾನ"</p>
                      <p>• "ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ"</p>
                      <p>• "ಬೆಳೆ ಮಾಹಿತಿ"</p>
                      <p>• "ಚಾಟ್"</p>
                      <p>• "ಸಹಾಯ"</p>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-600">English:</p>
                      <p>• "weather"</p>
                      <p>• "soil analysis"</p>
                      <p>• "crop info"</p>
                      <p>• "chat"</p>
                      <p>• "help"</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Soil Analysis */}
          <Link href="/soil-analysis" className="group">
            <Card className="relative h-full overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-green-200 hover:border-green-400 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/close-up-illustration-of-rich-dark-soil--a9de010b-20251015171129.jpg"
                  alt="Soil"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/95 to-emerald-100/95"></div>
              
              <CardHeader className="relative text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <ImageIcon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-green-900">
                  ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 mb-2 font-medium">Soil Analysis</p>
                <p className="text-sm text-gray-600">Upload soil image for AI analysis</p>
              </CardContent>
            </Card>
          </Link>

          {/* AI Chat Assistant */}
          <Link href="/ai-chat" className="group">
            <Card className="relative h-full overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-100 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
              <CardHeader className="relative text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-900">
                  AI ಸಹಾಯಕ
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 mb-2 font-medium">AI Assistant</p>
                <p className="text-sm text-gray-600">Chat in Kannada with AI</p>
              </CardContent>
            </Card>
          </Link>

          {/* Crop Information */}
          <Link href="/crop-info" className="group">
            <Card className="relative h-full overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-yellow-200 hover:border-yellow-400 hover:-translate-y-2 animate-in fade-in-from-bottom duration-500 delay-300">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/colorful-illustration-of-various-crops-i-22b491e0-20251015171137.jpg"
                  alt="Crops"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/95 to-amber-100/95"></div>
              
              <CardHeader className="relative text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-yellow-900">
                  ಬೆಳೆ ಮಾಹಿತಿ
                </CardTitle>
              </CardHeader>
              <CardContent className="relative text-center">
                <p className="text-gray-700 mb-2 font-medium">Crop Information</p>
                <p className="text-sm text-gray-600">Get crop details in Kannada</p>
              </CardContent>
            </Card>
          </Link>

          {/* Call Support */}
          <Card className="relative h-full overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-red-200 hover:border-red-400 bg-gradient-to-br from-red-50 to-rose-100 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-500 delay-400">
            <CardHeader className="relative text-center pb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-4 hover:scale-110 hover:rotate-6 transition-all duration-500 shadow-lg animate-pulse">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl text-red-900">
                ಕರೆ ಸಹಾಯ
              </CardTitle>
            </CardHeader>
            <CardContent className="relative text-center">
              <p className="text-gray-700 mb-2 font-medium">Call Support</p>
              <p className="text-sm text-gray-600 mb-4">24/7 Helpline</p>
              <Button
                onClick={() => window.open("tel:1800-123-4567")}
                className="bg-red-600 hover:bg-red-700 w-full hover:scale-105 transition-all duration-300 shadow-lg"
              >
                📞 Call Now: 1800-123-4567
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="mb-8 shadow-2xl border-2 border-purple-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all animate-in fade-in slide-in-from-bottom duration-700 delay-500">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <CardTitle className="flex items-center relative z-10">
              <Sparkles className="w-6 h-6 mr-2 animate-pulse" />
              ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ / Give Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback-name" className="text-gray-700 font-semibold">ಹೆಸರು / Name</Label>
                  <Input
                    id="feedback-name"
                    value={feedbackForm.name}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-email" className="text-gray-700 font-semibold">ಇಮೇಲ್ / Email</Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    value={feedbackForm.email}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-message" className="text-gray-700 font-semibold">ಸಂದೇಶ / Message</Label>
                <Textarea
                  id="feedback-message"
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Share your experience with us..."
                  required
                  rows={4}
                  className="border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-semibold">ರೇಟಿಂಗ್ / Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                      className={`p-2 rounded-full transition-all hover:scale-110 ${
                        feedbackForm.rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className={`w-8 h-8 ${feedbackForm.rating >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              {feedbackSuccess && (
                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-md text-green-700 animate-in fade-in slide-in-from-top flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Thank you for your feedback! / ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು!</span>
                </div>
              )}

              {feedbackError && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-md text-red-700 text-sm animate-in fade-in slide-in-from-top">
                  {feedbackError}
                </div>
              )}

              <Button
                type="submit"
                disabled={submittingFeedback}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {submittingFeedback ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    ಸಲ್ಲಿಸಿ / Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Farming Tips Banner with Animation */}
        <div className="relative bg-white rounded-2xl shadow-2xl p-6 border-l-4 border-green-500 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 delay-600">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <Sprout className="w-6 h-6 mr-2 text-green-600 animate-bounce" />
              ದಿನದ ಸಲಹೆ / Tip of the Day
            </h3>
            <p className="text-gray-600">
              🌱 Regular soil testing helps improve crop yield. Use our soil analysis feature to get personalized recommendations!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}