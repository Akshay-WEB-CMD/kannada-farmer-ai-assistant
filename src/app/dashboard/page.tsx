"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sprout, ImageIcon, MessageCircle, Phone, BookOpen, LogOut, Sun, Sparkles, Star, Send, Loader2 } from "lucide-react";
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Pre-fill feedback form with user data
      setFeedbackForm(prev => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || ""
      }));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
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