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

export default function MemberDashboardMongo() {
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const mobileNumber = localStorage.getItem("mobileNumber");
    
    if (userType !== "member" || !mobileNumber) {
      router.push("/");
      return;
    }

    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/member-mongo/dashboard?mobileNumber=${encodeURIComponent(mobileNumber)}`);
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
      const response = await fetch('/api/deposits-mongo', {
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
          const refreshResponse = await fetch(`/api/member-mongo/dashboard?mobileNumber=${encodeURIComponent(mobileNumber)}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>ডাটা লোড করা যায়নি</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            হোমপেজে ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Friends Development Society (FDS)</h1>
              <p className="text-sm text-gray-600">সদস্য ড্যাশবোর্ড (MongoDB)</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              স্বাগতম, {memberData.name}!
            </CardTitle>
            <CardDescription>
              আপনার মোবাইল নম্বর: {memberData.mobileNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                মোট জমা
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ৳{memberData.totalDeposits.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                বর্তমান বকেয়া
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ৳{memberData.pendingDeposits.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                সমিতির মোট হিসাব
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ৳{memberData.societyTotal.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Deposit Form */}
          <Card>
            <CardHeader>
              <CardTitle>নতুন চাঁদা জমা</CardTitle>
              <CardDescription>
                মাস ও বছর নির্বাচন করে চাঁদা জমা দিন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="month">মাস</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth} required>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">বছর</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear} required>
                    <SelectTrigger>
                      <SelectValue placeholder="বছর নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">পরিমাণ</Label>
                  <Input
                    id="amount"
                    type="number"
                    value="500"
                    readOnly
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-600">মাসিক চাঁদা: ৳500</p>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "জমা হচ্ছে..." : "চাঁদা জমা দিন"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Deposit Log */}
          <Card>
            <CardHeader>
              <CardTitle>চাঁদা জমার লগ</CardTitle>
              <CardDescription>
                আপনার সকল চাঁদা জমার তালিকা (শুধুমাত্র অনুমোদিত)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>মাস</TableHead>
                      <TableHead>বছর</TableHead>
                      <TableHead>পরিমাণ</TableHead>
                      <TableHead>অবস্থা</TableHead>
                      <TableHead>তারিখ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberData.deposits
                      .filter(deposit => deposit.isApproved)
                      .map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell>{monthNames[deposit.month - 1]}</TableCell>
                          <TableCell>{deposit.year}</TableCell>
                          <TableCell>৳{deposit.amount}</TableCell>
                          <TableCell>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              অনুমোদিত
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {deposit.approvedAt ? new Date(deposit.approvedAt).toLocaleDateString('bn-BD') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {memberData.deposits.filter(d => d.isApproved).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    কোনো অনুমোদিত চাঁদা পাওয়া যায়নি
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}