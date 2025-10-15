"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, language: "kannada" }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/dashboard");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/colorful-illustration-of-happy-indian-fa-1b2d23be-20251015171716.jpg"
          alt="Happy Farmers"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3Ccircle cx='0' cy='0' r='3'/%3E%3Ccircle cx='60' cy='60' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-700 rounded-full mb-4 shadow-2xl animate-bounce">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-orange-900 mb-2 drop-shadow-lg">ಕೃಷಿ ಸಹಾಯಕ</h1>
          <p className="text-orange-700 text-lg font-semibold">Krishi Sahayak - Farmer Assistant</p>
        </div>

        <Card className="shadow-2xl border-2 border-orange-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500">
          <CardHeader className="space-y-1 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <CardTitle className="text-2xl relative z-10">ಸೈನ್ ಅಪ್ / Sign Up</CardTitle>
            <CardDescription className="text-orange-50 relative z-10">
              Create your farmer account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold">ಹೆಸರು / Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="ನಿಮ್ಮ ಹೆಸರು / Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">ಇಮೇಲ್ / Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">ಪಾಸ್ವರ್ಡ್ / Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold">ಫೋನ್ ನಂಬರ್ / Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-semibold">ಸ್ಥಳ / Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="ನಿಮ್ಮ ಊರು / Your village/city"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-md text-red-700 text-sm animate-in fade-in slide-in-from-top">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "ಖಾತೆ ತೆರೆಯಿರಿ / Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? / Already have an account?{" "}
                <Link href="/login" className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition-all">
                  ಲಾಗಿನ್ / Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}