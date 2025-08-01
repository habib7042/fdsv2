"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  LogOut, 
  UserPlus, 
  CheckCircle, 
  Calendar,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Wallet
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  nationalId: string;
  mobileNumber: string;
  nomineeName: string;
  isActive: boolean;
  joinedAt: string;
  totalDeposits: number;
  pendingDeposits: number;
}

interface Deposit {
  id: string;
  memberId: string;
  memberName: string;
  month: number;
  year: number;
  amount: number;
  isApproved: boolean;
  createdAt: string;
}

const monthNames = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

export default function AccountantDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    nationalId: "",
    mobileNumber: "",
    nomineeName: "",
    pin: ""
  });
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const mobileNumber = localStorage.getItem("mobileNumber");
    
    if (userType !== "accountant" || !mobileNumber) {
      router.push("/");
      return;
    }

    const fetchAccountantData = async () => {
      try {
        const response = await fetch('/api/accountant-supabase/dashboard');
        const data = await response.json();

        if (response.ok) {
          setMembers(data.members);
          setDeposits(data.pendingDeposits);
        } else {
          console.error('Failed to fetch accountant data:', data.error);
          alert('ডাটা লোড করা যায়নি');
        }
      } catch (error) {
        console.error('Error fetching accountant data:', error);
        alert('সার্ভারে সংযোগ করা যায়নি');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountantData();
  }, [router]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/members-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMember),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        const accountantResponse = await fetch('/api/accountant-supabase/dashboard');
        const accountantData = await accountantResponse.json();
        if (accountantResponse.ok) {
          setMembers(accountantData.members);
          setDeposits(accountantData.pendingDeposits);
        }
        
        setNewMember({
          name: "",
          fatherName: "",
          motherName: "",
          dateOfBirth: "",
          nationalId: "",
          mobileNumber: "",
          nomineeName: "",
          pin: ""
        });
        setShowAddMember(false);
        alert('সদস্য সফলভাবে যোগ করা হয়েছে');
      } else {
        alert(data.error || "সদস্য যোগ করা যায়নি");
      }
    } catch (error) {
      console.error('Add member error:', error);
      alert('সার্ভারে সংযোগ করা যায়নি');
    }
  };

  const handleApproveDeposit = async (depositId: string) => {
    try {
      const response = await fetch('/api/deposits-supabase/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          depositId,
          accountantId: localStorage.getItem("userId")
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the data
        const accountantResponse = await fetch('/api/accountant-supabase/dashboard');
        const accountantData = await accountantResponse.json();
        if (accountantResponse.ok) {
          setMembers(accountantData.members);
          setDeposits(accountantData.pendingDeposits);
        }
        
        alert('চাঁদা সফলভাবে অনুমোদিত হয়েছে');
      } else {
        alert(data.error || "চাঁদা অনুমোদন করা যায়নি");
      }
    } catch (error) {
      console.error('Approve deposit error:', error);
      alert('সার্ভারে সংযোগ করা যায়নি');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("mobileNumber");
    localStorage.removeItem("pin");
    router.push("/");
  };

  const totalSocietyFund = members.reduce((sum, member) => sum + member.totalDeposits, 0);
  const totalPendingDeposits = members.reduce((sum, member) => sum + member.pendingDeposits, 0);

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
                <p className="text-sm text-white/80">হিসাবরক্ষক ড্যাশবোর্ড</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-2"
            >
              <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-purple-600 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <UserPlus className="h-4 w-4 mr-2" />
                    নতুন সদস্য যোগ করুন
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-white" />
                      </div>
                      <span>নতুন সদস্য যোগ করুন</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      নতুন সদস্যের তথ্য সঠিকভাবে পূরণ করুন
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">নাম *</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherName" className="text-gray-700">পিতার নাম *</Label>
                        <Input
                          id="fatherName"
                          value={newMember.fatherName}
                          onChange={(e) => setNewMember(prev => ({ ...prev, fatherName: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherName" className="text-gray-700">মাতার নাম *</Label>
                        <Input
                          id="motherName"
                          value={newMember.motherName}
                          onChange={(e) => setNewMember(prev => ({ ...prev, motherName: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-gray-700">জন্ম তারিখ *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newMember.dateOfBirth}
                          onChange={(e) => setNewMember(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationalId" className="text-gray-700">জাতীয় পরিচয়পত্র নম্বর *</Label>
                        <Input
                          id="nationalId"
                          value={newMember.nationalId}
                          onChange={(e) => setNewMember(prev => ({ ...prev, nationalId: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber" className="text-gray-700">মোবাইল নম্বর *</Label>
                        <Input
                          id="mobileNumber"
                          value={newMember.mobileNumber}
                          onChange={(e) => setNewMember(prev => ({ ...prev, mobileNumber: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nomineeName" className="text-gray-700">নমিনির নাম *</Label>
                        <Input
                          id="nomineeName"
                          value={newMember.nomineeName}
                          onChange={(e) => setNewMember(prev => ({ ...prev, nomineeName: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pin" className="text-gray-700">গোপন পিন *</Label>
                        <Input
                          id="pin"
                          type="password"
                          value={newMember.pin}
                          onChange={(e) => setNewMember(prev => ({ ...prev, pin: e.target.value }))}
                          required
                          className="border-gray-200 focus:border-green-500 focus:ring-green-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          সদস্য যোগ করুন
                        </Button>
                      </motion.div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddMember(false)}
                        className="bg-transparent text-gray-700 border-gray-300 hover:bg-gray-50"
                      >
                        বাতিল
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  মোট সদস্য
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {members.length}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <Users className="h-6 w-6 text-blue-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  সমিতির মোট হিসাব
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ৳{totalSocietyFund.toLocaleString()}
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
                  অনুমোদনের অপেক্ষায়
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {deposits.filter(d => !d.isApproved).length}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
                  >
                    <Clock className="h-6 w-6 text-orange-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-red-600" />
                  মোট বকেয়া
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    ৳{totalPendingDeposits.toLocaleString()}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
                  >
                    <ArrowDownRight className="h-6 w-6 text-red-600" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="members" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm border-0 p-1">
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white transition-all duration-300"
              >
                <Users className="h-4 w-4 mr-2" />
                সদস্য তালিকা
              </TabsTrigger>
              <TabsTrigger 
                value="deposits" 
                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-white transition-all duration-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                চাঁদা অনুমোদন
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span>সদস্য তালিকা</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    সকল সদস্যের তথ্য ও হিসাব
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700">নাম</TableHead>
                          <TableHead className="text-gray-700">মোবাইল</TableHead>
                          <TableHead className="text-gray-700">মোট জমা</TableHead>
                          <TableHead className="text-gray-700">বকেয়া</TableHead>
                          <TableHead className="text-gray-700">অবস্থা</TableHead>
                          <TableHead className="text-gray-700">যোগদান</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member, index) => (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>{member.mobileNumber}</TableCell>
                            <TableCell className="font-semibold text-green-600">৳{member.totalDeposits.toLocaleString()}</TableCell>
                            <TableCell className="font-semibold text-orange-600">৳{member.pendingDeposits.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={member.isActive ? "default" : "secondary"}
                                className={`${
                                  member.isActive 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700" 
                                    : "bg-gray-200 text-gray-700"
                                } transition-all duration-300`}
                              >
                                {member.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {new Date(member.joinedAt).toLocaleDateString('bn-BD')}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deposits">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-xl">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span>চাঁদা অনুমোদন</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    অনুমোদনের অপেক্ষায় থাকা চাঁদার তালিকা
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700">সদস্যের নাম</TableHead>
                          <TableHead className="text-gray-700">মাস</TableHead>
                          <TableHead className="text-gray-700">বছর</TableHead>
                          <TableHead className="text-gray-700">পরিমাণ</TableHead>
                          <TableHead className="text-gray-700">তারিখ</TableHead>
                          <TableHead className="text-gray-700">অবস্থা</TableHead>
                          <TableHead className="text-gray-700">অ্যাকশন</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deposits
                          .filter(deposit => !deposit.isApproved)
                          .map((deposit, index) => (
                            <motion.tr
                              key={deposit.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <TableCell className="font-medium">{deposit.memberName}</TableCell>
                              <TableCell>{monthNames[deposit.month - 1]}</TableCell>
                              <TableCell>{deposit.year}</TableCell>
                              <TableCell className="font-semibold text-green-600">৳{deposit.amount}</TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {new Date(deposit.createdAt).toLocaleDateString('bn-BD')}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors">
                                  অপেক্ষমান
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveDeposit(deposit.id)}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    অনুমোদন
                                  </Button>
                                </motion.div>
                              </TableCell>
                            </motion.tr>
                          ))}
                      </TableBody>
                    </Table>
                    {deposits.filter(d => !d.isApproved).length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center py-8 text-gray-500"
                      >
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                        কোনো অপেক্ষমান চাঁদা নেই
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}