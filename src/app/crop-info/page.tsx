"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, Search, ArrowLeft, Loader2, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CropInfoPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cropInfo, setCropInfo] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const searchCrop = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setCropInfo(null);

    try {
      const response = await fetch("/api/ai/crop-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: searchQuery,
          language: "kannada"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCropInfo(data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const popularCrops = [
    { name: "ಟೊಮೇಟೊ", en: "Tomato", emoji: "🍅" },
    { name: "ಆಲೂಗಡ್ಡೆ", en: "Potato", emoji: "🥔" },
    { name: "ಬತ್ತ", en: "Rice", emoji: "🌾" },
    { name: "ಗೋಧಿ", en: "Wheat", emoji: "🌾" },
    { name: "ಕಬ್ಬು", en: "Sugarcane", emoji: "🎋" },
    { name: "ಹತ್ತಿ", en: "Cotton", emoji: "☁️" },
    { name: "ರಾಗಿ", en: "Ragi", emoji: "🌾" },
    { name: "ತಿಲ", en: "Sesame", emoji: "🌱" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/vibrant-encyclopedia-illustration-showca-fcaa7087-20251015171732.jpg"
          alt="Crop Encyclopedia"
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-700 text-white shadow-2xl relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ಬೆಳೆ ಮಾಹಿತಿ</h1>
              <p className="text-yellow-100 text-sm">Crop Information</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search Section */}
        <Card className="shadow-2xl border-2 border-yellow-300 mb-8 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all">
          <CardHeader className="bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <CardTitle className="relative z-10">ಬೆಳೆ ಹುಡುಕಿ / Search Crop</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex space-x-2 mb-6">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchCrop()}
                placeholder="ಬೆಳೆಯ ಹೆಸರನ್ನು ಕನ್ನಡದಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... / Type crop name in Kannada..."
                className="flex-1 border-2 border-yellow-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                disabled={loading}
              />
              <Button
                onClick={searchCrop}
                disabled={loading || !searchQuery.trim()}
                className="bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-700 hover:to-amber-800 shadow-lg hover:scale-105 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Popular Crops */}
            <div>
              <p className="text-sm text-gray-600 mb-3 font-semibold">ಜನಪ್ರಿಯ ಬೆಳೆಗಳು / Popular Crops:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {popularCrops.map((crop) => (
                  <Button
                    key={crop.en}
                    variant="outline"
                    className="justify-start border-2 hover:bg-yellow-50 hover:border-yellow-400 hover:scale-105 transition-all"
                    onClick={() => {
                      setSearchQuery(crop.name);
                      setTimeout(() => searchCrop(), 100);
                    }}
                    disabled={loading}
                  >
                    <span className="mr-2">{crop.emoji}</span>
                    {crop.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {cropInfo && (
          <Card className="shadow-2xl border-2 border-yellow-300 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom duration-500">
            <CardHeader className="bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <CardTitle className="flex items-center relative z-10">
                <Leaf className="w-6 h-6 mr-2" />
                {cropInfo.cropName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Climate Requirements */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-lg border-2 border-blue-300 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center text-lg">
                    ☀️ ಹವಾಮಾನ ಅವಶ್ಯಕತೆಗಳು / Climate Requirements
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{cropInfo.climate}</p>
                </div>

                {/* Soil Type */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-lg border-2 border-amber-300 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-amber-900 mb-2 flex items-center text-lg">
                    🌱 ಮಣ್ಣಿನ ಪ್ರಕಾರ / Soil Type
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{cropInfo.soilType}</p>
                </div>

                {/* Cultivation Tips */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border-2 border-green-300 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center text-lg">
                    🚜 ಬೆಳೆ ಸಲಹೆಗಳು / Cultivation Tips
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{cropInfo.tips}</p>
                </div>

                {/* Season */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-4 rounded-lg border-2 border-purple-300 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center text-lg">
                    📅 ಋತು / Season
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{cropInfo.season}</p>
                </div>

                {/* Irrigation */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-lg border-2 border-cyan-300 shadow-md hover:shadow-lg transition-all">
                  <h3 className="font-bold text-cyan-900 mb-2 flex items-center text-lg">
                    💧 ನೀರಾವರಿ / Irrigation
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{cropInfo.irrigation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Banner */}
        {!cropInfo && !loading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border-2 border-dashed border-yellow-400 animate-in fade-in">
            <Sprout className="w-20 h-20 mx-auto text-yellow-600 mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              ಬೆಳೆಯ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ / Learn About Crops
            </h3>
            <p className="text-gray-600 text-lg">
              Search for any crop in Kannada to get detailed information about cultivation, soil requirements, and farming tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}