"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sprout, Send, ArrowLeft, Loader2, Bot, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಕೃಷಿಯ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನೀವು ಏನು ಕೇಳಲು ಬಯಸುತ್ತೀರಿ?\n\nHello! I am your AI farming assistant. I can help you with farming questions in Kannada. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          userId: user.id,
          language: "kannada"
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "ಕ್ಷಮಿಸಿ, ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ. / Sorry, an error occurred. Please try again."
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "ಸಂಪರ್ಕ ದೋಷ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಂಟರ್ನೆಟ್ ಪರಿಶೀಲಿಸಿ. / Connection error. Please check your internet."
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e196f585-32bd-47ab-8f14-f4535f308c35/generated_images/friendly-ai-robot-assistant-helping-indi-d3899ec1-20251015171724.jpg"
          alt="AI Assistant"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-700 text-white shadow-2xl relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI ಸಹಾಯಕ</h1>
              <p className="text-blue-100 text-sm">Kannada AI Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col relative z-10">
        <Card className="flex-1 flex flex-col shadow-2xl border-2 border-blue-300 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <CardTitle className="relative z-10">ಕನ್ನಡದಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ / Chat in Kannada</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[500px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-300`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-cyan-700"
                          : "bg-gradient-to-br from-green-600 to-emerald-700 animate-pulse"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-cyan-700 text-white"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-2 border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="p-2 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 animate-pulse">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="p-4 rounded-lg bg-gray-100 shadow-md">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... / Type your question here..."
                className="flex-1 border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 shadow-lg hover:scale-105 transition-all"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Example Questions */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="text-left justify-start text-sm border-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => setInput("ಟೊಮೇಟೊ ಬೆಳೆಯಲು ಹೇಗೆ?")}
                disabled={loading}
              >
                💡 ಟೊಮೇಟೊ ಬೆಳೆಯಲು ಹೇಗೆ?
              </Button>
              <Button
                variant="outline"
                className="text-left justify-start text-sm border-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => setInput("ಮಣ್ಣಿನ pH ಏನು?")}
                disabled={loading}
              >
                💡 ಮಣ್ಣಿನ pH ಏನು?
              </Button>
              <Button
                variant="outline"
                className="text-left justify-start text-sm border-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => setInput("ಸಾವಯವ ಗೊಬ್ಬರ ಬಗ್ಗೆ ಹೇಳಿ")}
                disabled={loading}
              >
                💡 ಸಾವಯವ ಗೊಬ್ಬರ ಬಗ್ಗೆ
              </Button>
              <Button
                variant="outline"
                className="text-left justify-start text-sm border-2 hover:bg-blue-50 hover:border-blue-400 transition-all"
                onClick={() => setInput("ಮಾನ್ಸೂನ್ ಬೆಳೆಗಳು ಯಾವುವು?")}
                disabled={loading}
              >
                💡 ಮಾನ್ಸೂನ್ ಬೆಳೆಗಳು
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}