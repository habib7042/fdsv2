"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Calendar, 
  LogOut, 
  CheckCircle, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Sparkles
} from "lucide-react";

interface Deposit {
  id: string;
  month: number;
  year: number;
  amount: number;
  isApproved: boolean;
  approvedAt?: string;
}

interface MemberData {
  id: string;
  name: string;
  mobileNumber: string;
  totalDeposits: number;
  pendingDeposits: number;
  societyTotal: number;
  deposits: Deposit[];
}

const monthNames = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

export default function MemberDashboard() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const mobileNumber = localStorage.getItem("mobileNumber");
    
    if (userType !== "member" || !mobileNumber) {
      router.push("/");
      return;
    }

    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/member/dashboard?mobileNumber=${encodeURIComponent(mobileNumber)}`);
        const data = await response.json();

        if (response.ok) {
          setMemberData(data);
        } else {
          console.error('Failed to fetch member data:', data.error);
          alert('ডাটা লোড করা যায়নি');
        }
      } catch (error) {
        console.error('Error fetching member data:', error);
        alert('সার্ভারে সংযোগ করা যায়নি');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [router]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMonth || !selectedYear || !memberData) return;

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberData.id,
          month: selectedMonth,
          year: selectedYear,
          amount: 500
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh member data
        const mobileNumber = localStorage.getItem("mobileNumber");
        if (mobileNumber) {
          const refreshResponse = await fetch(`/api/member/dashboard?mobileNumber=${encodeURIComponent(mobileNumber)}`);
          const refreshData = await refreshResponse.json();
          if (refreshResponse.ok) {
            setMemberData(refreshData);
          }
        }
        
        setSelectedMonth("");
        setSelectedYear("");
        alert('চাঁদা সফলভাবে জমা হয়েছে');
      } else {
        alert(data.error || "চাঁদা জমা করা যায়নি");
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('সার্ভারে সংযোগ করা যায়নি');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("pin");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/");
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
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
        {/* Animated Background */}
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
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="h-8 w-8 text-purple-600" />
            </motion.div>
            <p className="text-white text-lg font-medium">লোড হচ্ছে...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-center text-white"
          >
            <p className="text-xl mb-4">ডাটা লোড করা যায়নি</p>
            <Button 
              onClick={() => router.push("/")} 
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              হোমপেজে ফিরে যান
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

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
                <p className="text-sm text-white/80">সদস্য ড্যাশবোর্ড</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="bg-transparent text-white border-white/30 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                লগআউট
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
            <div className="relative z-10">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  স্বাগতম, {memberData.name}!
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  আপনার মোবাইল নম্বর: {memberData.mobileNumber}
                </CardDescription>
              </CardHeader>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Wallet className="h-4 w-4 mr-2 text-green-600" />
                  মোট জমা
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ৳{memberData.totalDeposits.toLocaleString()}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-orange-600" />
                  বর্তমান বকেয়া
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    ৳{memberData.pendingDeposits.toLocaleString()}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
                  >
                    <ArrowDownRight className="h-6 w-6 text-orange-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                  সমিতির মোট হিসাব
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    ৳{memberData.societyTotal.toLocaleString()}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Deposit Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span>নতুন চাঁদা জমা</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  মাস ও বছর নির্বাচন করে চাঁদা জমা দিন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="month" className="text-gray-700">মাস</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth} required>
                      <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all">
                        <SelectValue placeholder="মাস নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((name, index) => (
                          <SelectItem key={index} value={(index + 1).toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="year" className="text-gray-700">বছর</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear} required>
                      <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all">
                        <SelectValue placeholder="বছর নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="amount" className="text-gray-700">পরিমাণ</Label>
                    <Input
                      id="amount"
                      type="number"
                      value="500"
                      readOnly
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all bg-gray-50"
                    />
                    <p className="text-sm text-gray-600">মাসিক চাঁদা: ৳500</p>
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
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          জমা হচ্ছে...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          চাঁদা জমা দিন
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deposit Log */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <span>চাঁদা জমার লগ</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  আপনার সকল চাঁদা জমার তালিকা (শুধুমাত্র অনুমোদিত)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-700">মাস</TableHead>
                        <TableHead className="text-gray-700">বছর</TableHead>
                        <TableHead className="text-gray-700">পরিমাণ</TableHead>
                        <TableHead className="text-gray-700">অবস্থা</TableHead>
                        <TableHead className="text-gray-700">তারিখ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberData.deposits
                        .filter(deposit => deposit.isApproved)
                        .map((deposit, index) => (
                          <motion.tr
                            key={deposit.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="font-medium">{monthNames[deposit.month - 1]}</TableCell>
                            <TableCell>{deposit.year}</TableCell>
                            <TableCell className="font-semibold text-green-600">৳{deposit.amount}</TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                অনুমোদিত
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {deposit.approvedAt ? new Date(deposit.approvedAt).toLocaleDateString('bn-BD') : '-'}
                            </TableCell>
                          </motion.tr>
                        ))}
                    </TableBody>
                  </Table>
                  {memberData.deposits.filter(d => d.isApproved).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      কোনো অনুমোদিত চাঁদা পাওয়া যায়নি
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}