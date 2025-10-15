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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/warm-welcoming-illustration-of-indian-fa-c7a7cf9c-20251015171708.jpg"
          alt="Farmers Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full mb-4 shadow-2xl animate-bounce">
            <Sprout className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-2 drop-shadow-lg">ಕೃಷಿ ಸಹಾಯಕ</h1>
          <p className="text-green-700 text-lg font-semibold">Krishi Sahayak - Farmer Assistant</p>
        </div>

        <Card className="shadow-2xl border-2 border-green-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500">
          <CardHeader className="space-y-1 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white rounded-t-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <CardTitle className="text-2xl relative z-10">ಲಾಗಿನ್ / Login</CardTitle>
            <CardDescription className="text-green-50 relative z-10">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">ಇಮೇಲ್ / Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">ಪಾಸ್ವರ್ಡ್ / Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-md text-red-700 text-sm animate-in fade-in slide-in-from-top">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "ಲಾಗಿನ್ / Login"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ಖಾತೆ ಇಲ್ಲವೇ? / Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all">
                  ಸೈನ್ ಅಪ್ / Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-700 mt-4 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          Test Login: farmer@test.com / farmer123
        </p>
      </div>
    </div>
  );
}