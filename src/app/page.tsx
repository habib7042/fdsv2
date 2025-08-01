"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Users, Shield, TrendingUp, HandHeart, Building2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [userType, setUserType] = useState<"member" | "accountant">("member");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth-supabase/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber,
          pin,
          userType
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user info in localStorage
        localStorage.setItem("userType", userType);
        localStorage.setItem("mobileNumber", mobileNumber);
        localStorage.setItem("pin", pin);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);
        
        if (userType === "member") {
          router.push("/dashboard");
        } else {
          router.push("/accountant");
        }
      } else {
        alert(data.error || "লগইন ব্যর্থ হয়েছে");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("সার্ভারে সংযোগ করা যায়নি");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Friends Development Society (FDS)</h1>
                <p className="text-sm text-white/80">বন্ধু উন্নয়ন সমিতি</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-2"
            >
              <Button
                variant={userType === "member" ? "default" : "outline"}
                onClick={() => setUserType("member")}
                size="sm"
                className={`transition-all duration-300 ${
                  userType === "member" 
                    ? "bg-white text-purple-600 hover:bg-white/90" 
                    : "bg-transparent text-white border-white/30 hover:bg-white/10"
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                সদস্য লগইন
              </Button>
              <Button
                variant={userType === "accountant" ? "default" : "outline"}
                onClick={() => setUserType("accountant")}
                size="sm"
                className={`transition-all duration-300 ${
                  userType === "accountant" 
                    ? "bg-white text-purple-600 hover:bg-white/90" 
                    : "bg-transparent text-white border-white/30 hover:bg-white/10"
                }`}
              >
                <Shield className="h-4 w-4 mr-2" />
                হিসাবরক্ষক লগইন
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Login Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="sticky top-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      {userType === "member" ? (
                        <Users className="h-8 w-8 text-white" />
                      ) : (
                        <Shield className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </motion.div>
                  <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {userType === "member" ? "সদস্য লগইন" : "হিসাবরক্ষক লগইন"}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    আপনার মোবাইল নম্বর এবং পিন দিয়ে লগইন করুন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="mobile" className="text-gray-700">মোবাইল নম্বর</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="০১৭১২-৩৪৫৬৭৮"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="pin" className="text-gray-700">গোপন পিন</Label>
                      <Input
                        id="pin"
                        type="password"
                        placeholder="পিন লিখুন"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        লগইন করুন
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Society Information */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                    >
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="h-10 w-10 text-white" />
                      </div>
                    </motion.div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Friends Development Society (FDS)
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      নীতি ও বিধিমালা
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6 text-gray-600 italic font-medium">
                      আল্লাহর নামে শুরু করছি যিনি পরম করুণাময়, অসীম দয়ালু।
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span>১. সমিতির নাম ও উদ্দেশ্য</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-purple-600">নাম:</span>
                      <span className="text-gray-700">Friends Development Society (FDS)</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      <span className="font-semibold text-purple-600">উদ্দেশ্য:</span> FDS একটি স্বেচ্ছাসেবী বন্ধুসমিতি, যার মূল উদ্দেশ্য বন্ধুদের পারস্পরিক সহযোগিতা, অর্থ সঞ্চয়, এবং ভবিষ্যতে সম্মিলিত কোনো হালাল উদ্যোগ গ্রহণের জন্য একটি শক্তিশালী আর্থিক ভিত্তি তৈরি করা।
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <span>২. সদস্যসংখ্যা ও যোগদান</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>FDS-এ প্রাথমিক সদস্য সংখ্যা ১৫-২০ জন।</li>
                      <li>সদস্য হতে হলে সবাইকে নিয়মিত মাসিক চাঁদা প্রদান করতে হবে।</li>
                      <li>নতুন সদস্য যোগ হলে পূর্ব সদস্যদের সর্বসম্মত মতামত প্রয়োজন।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                        <HandHeart className="h-5 w-5 text-white" />
                      </div>
                      <span>৩. মাসিক চাঁদা ও ফান্ড পরিচালনা</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>প্রত্যেক সদস্য প্রতি মাসে ৫০০ টাকা করে চাঁদা প্রদান করবেন।</li>
                      <li>নির্ধারিত তারিখ (প্রত্যেক মাসের ১০ তারিখের মধ্যে) চাঁদা জমা দিতে হবে।</li>
                      <li>চাঁদা একটি নির্দিষ্ট ব্যাঙ্ক বা মোবাইল ব্যাংক একাউন্টে জমা হবে, যা সদস্যদের সম্মতিক্রমে নির্ধারিত হবে।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span>৪. অর্থ উত্তোলনের নীতি</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>ফান্ডে জমাকৃত অর্থ সদস্যগণ ৩ বছর পূর্ণ হওয়ার আগে উত্তোলন করতে পারবেন না।</li>
                      <li>সদস্যপদ বাতিল হলেও ৩ বছর পূর্ণ না হলে কোনো টাকা উত্তোলন করা যাবে না।</li>
                      <li>৩ বছর পূর্ণ হলে সকল সদস্য নিজ নিজ অংশ ফেরত পাওয়ার অধিকারী হবেন, বা সদস্যদের সম্মতিক্রমে হালাল খাতে তা বিনিয়োগ করা যেতে পারে।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <span>৫. সদস্যপদ বাতিল</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>সদস্য ইচ্ছায় সদস্যপদ বাতিল করতে পারেন, তবে তার জমাকৃত অর্থ ৩ বছর পূর্ণ না হওয়া পর্যন্ত আটকে থাকবে।</li>
                      <li>৩ মাস পরপর চাঁদা না দিলে সদস্যকে নোটিশ দিয়ে সদস্যপদ বাতিল করা হতে পারে।</li>
                      <li>বাতিল সদস্য ৩ বছর পূর্ণ হলে তার জমাকৃত অর্থ ফেরত পাবেন, তবে কোনো সুদ প্রদান করা হবে না (ইসলামী আদর্শ অনুযায়ী)।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <span>৬. হিসাব ও স্বচ্ছতা</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>প্রতিমাসে ফান্ডের অবস্থা সম্পর্কে সদস্যদের জানানো হবে।</li>
                      <li>একজন দায়িত্বশীল কোষাধ্যক্ষ নির্বাচিত হবেন যিনি সুষ্ঠুভাবে হিসাব রাখবেন।</li>
                      <li>বছরে অন্তত একবার অডিট করে সদস্যদের সামনে উপস্থাপন করতে হবে।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <span>৭. জরুরি সিদ্ধান্ত</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>যেকোনো বড় সিদ্ধান্তে সদস্যদের কমপক্ষে দুই-তৃতীয়াংশ সংখ্যাগরিষ্ঠতার সম্মতি প্রয়োজন</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <HandHeart className="h-5 w-5 text-white" />
                      </div>
                      <span>৮. অন্যান্য বিষয়</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                      <li>সমিতির কার্যক্রম বন্ধ করার সিদ্ধান্ত সদস্যদের সম্মিলিত মতামতের ভিত্তিতে নেওয়া হবে।</li>
                      <li>সকল সদস্যের মধ্যে ইসলামী ভ্রাতৃত্ববোধ, বিশ্বস্ততা ও নিয়ম মানার মানসিকতা থাকা আবশ্যক।</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <span>সমাপ্তি</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-600 italic font-medium leading-relaxed">
                      আল্লাহ্‌ তা'আলার ওপর ভরসা করে আমরা আমাদের এই সমাজের কার্যক্রম শুরু করছি। তিনি যেন আমাদের সবাইকে হালাল পথে চলার তাওফিক দান করেন এবং এই উদ্যোগকে কল্যাণ ও বরকতের মাধ্যমে কবুল করেন।
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}