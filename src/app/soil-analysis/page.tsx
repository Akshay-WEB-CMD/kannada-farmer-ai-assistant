"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Upload, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SoilAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      loadHistory(parsedUser.id);
    }
  }, [router]);

  const loadHistory = async (userId: number) => {
    try {
      const response = await fetch(`/api/soil-analysis/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const analyzeSoil = async () => {
    if (!selectedImage || !user) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/ai/soil-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageUrl: selectedImage,
          userId: user.id 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        loadHistory(user.id);
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/close-up-illustration-of-rich-dark-soil--a9de010b-20251015171129.jpg"
          alt="Soil Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white shadow-2xl relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ಮಣ್ಣು ವಿಶ್ಲೇಷಣೆ</h1>
              <p className="text-green-100 text-sm">Soil Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="shadow-2xl border-2 border-green-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all animate-in fade-in slide-in-from-left duration-500">
            <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <CardTitle className="relative z-10">ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ / Upload Image</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="border-4 border-dashed border-green-400 rounded-lg p-8 text-center bg-gradient-to-br from-green-50 to-emerald-100 hover:border-green-500 transition-all">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <Image
                        src={selectedImage}
                        alt="Soil sample"
                        width={400}
                        height={300}
                        className="mx-auto rounded-lg max-h-64 object-cover shadow-lg border-2 border-green-300"
                      />
                      <label className="cursor-pointer">
                        <Button variant="outline" className="w-full border-2 hover:bg-green-50 hover:scale-105 transition-all" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Change Image
                          </span>
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-20 h-20 mx-auto text-green-600 mb-4 animate-bounce" />
                      <p className="text-gray-700 mb-2 font-semibold text-lg">Click to upload soil image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {selectedImage && !result && (
                  <Button
                    onClick={analyzeSoil}
                    disabled={analyzing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ... / Analyzing...
                      </>
                    ) : (
                      "ವಿಶ್ಲೇಷಿಸಿ / Analyze Soil"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="shadow-2xl border-2 border-green-300 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-right duration-500">
              <CardHeader className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                <CardTitle className="flex items-center relative z-10">
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ / Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-4 rounded-lg border-2 border-blue-300 shadow-md hover:shadow-lg transition-all">
                    <h3 className="font-bold text-blue-900 mb-2 text-lg">ಮಣ್ಣಿನ ಪ್ರಕಾರ / Soil Type:</h3>
                    <p className="text-gray-700 text-lg font-semibold">{result.soilType}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border-2 border-green-300 shadow-md hover:shadow-lg transition-all">
                    <h3 className="font-bold text-green-900 mb-2 text-lg">ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು / Recommended Crops:</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.crops.map((crop: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-110 transition-all"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-lg border-2 border-amber-300 shadow-md hover:shadow-lg transition-all">
                    <h3 className="font-bold text-amber-900 mb-2 text-lg">ಶಿಫಾರಸುಗಳು / Recommendations:</h3>
                    <p className="text-gray-700 whitespace-pre-line">{result.recommendations}</p>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedImage(null);
                      setResult(null);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-lg hover:scale-105 transition-all"
                  >
                    ಹೊಸ ವಿಶ್ಲೇಷಣೆ / New Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <Card className="mt-8 shadow-2xl border-2 border-green-300 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom duration-700">
            <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <CardTitle className="relative z-10">ಹಿಂದಿನ ವಿಶ್ಲೇಷಣೆಗಳು / Previous Analyses</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-green-300 transition-all bg-gradient-to-br from-white to-green-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{item.soilType}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(item.analysisDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          try {
                            const crops = typeof item.crops === 'string' 
                              ? (item.crops.startsWith('[') ? JSON.parse(item.crops) : item.crops.split(','))
                              : item.crops;
                            return crops.slice(0, 3).map((crop: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
                              >
                                {crop.trim()}
                              </span>
                            ));
                          } catch (error) {
                            return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}