# MongoDB সেটআপ গাইড

## 📋 প্রয়োজনীয় পদক্ষেপ

### ১. MongoDB ইনস্টল করুন

#### **লোকাল MongoDB ইনস্টলেশন:**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**CentOS/RHEL:**
```bash
sudo yum install mongodb-server
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS (Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. [MongoDB Community Server ডাউনলোড করুন](https://www.mongodb.com/try/download/community)
2. ইনস্টলার অনুসরণ করুন
3. MongoDB সার্ভিস স্টার্ট করুন

#### **MongoDB Atlas (Cloud):**

1. [MongoDB Atlas এ যান](https://www.mongodb.com/cloud/atlas)
2. ফ্রি অ্যাকাউন্ট তৈরি করুন
3. নতুন ক্লাস্টার তৈরি করুন (ফ্রি টিয়ার নির্বাচন করুন)
4. ডাটাবেইজ ইউজার তৈরি করুন
5. নেটওয়ার্ক অ্যাক্সেস সেট করুন (0.0.0.0/0 সকল IP এর জন্য)

### ২. Environment ভেরিয়েবল সেট করুন

`.env` ফাইলে MongoDB URI যোগ করুন:

#### **লোকাল MongoDB এর জন্য:**
```
MONGODB_URI=mongodb://localhost:27017/fds-database
```

#### **MongoDB Atlas এর জন্য:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fds-database?retryWrites=true&w=majority
```

### ৩. ডাটাবেস সিড করুন

```bash
# MongoDB স্কিমা তৈরি হবে অটোমেটিক
# টেস্ট ডাটা তৈরি করতে:
curl -X POST http://localhost:3000/api/seed-mongo
```

## 🔧 কনফিগারেশন চেকলিস্ট

- [ ] MongoDB ইনস্টল করা হয়েছে
- [ ] MongoDB সার্ভিস চলছে
- [ ] `.env` ফাইলে `MONGODB_URI` সেট করা হয়েছে
- [ ] প্রয়োজনীয় প্যাকেজ ইনস্টল করা হয়েছে (`mongoose`)
- [ ] ডাটাবেস সিড করা হয়েছে

## 🚀 টেস্ট করার নির্দেশাবলী

### ১. ডেভেলপমেন্ট সার্ভার চালু করুন:
```bash
npm run dev
```

### ২. MongoDB ভার্সন ব্যবহার করুন:

**হোমপেজে লগইন ফর্ম আপডেট করুন:**
```javascript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/auth-mongo/login', { // MongoDB API ব্যবহার করুন
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
    
    // ... rest of the code
  } catch (error) {
    console.error('Login error:', error);
    alert("সার্ভারে সংযোগ করা যায়নি");
  }
};
```

**রাউটিং আপডেট করুন:**
- সদস্য ড্যাশবোর্ড: `/dashboard-mongo`
- হিসাবরক্ষক ড্যাশবোর্ড: `/accountant-mongo`

### ৩. টেস্ট ক্রেডেনশিয়াল:

**হিসাবরক্ষক:**
- মোবাইল: `01500-000000`
- PIN: `1234`

**সদস্য:**
- মোবাইল: `01712-345678`, PIN: `1234`
- মোবাইল: `01823-456789`, PIN: `1234`
- মোবাইল: `01934-567890`, PIN: `1234`

## 🐛 সমস্যা সমাধান

### **MongoDB কানেকশন সমস্যা:**

1. **MongoDB চলছে না:**
   ```bash
   # Ubuntu/Debian
   sudo systemctl status mongodb
   sudo systemctl start mongodb
   
   # macOS
   brew services list | grep mongodb
   brew services start mongodb-community
   ```

2. **পোর্ট ব্যস্ত:**
   ```bash
   # পোর্ট চেক করুন
   sudo lsof -i :27017
   
   # ভিন্না পোর্ট ব্যবহার করুন
   MONGODB_URI=mongodb://localhost:27018/fds-database
   ```

3. **অথেনটিকেশন সমস্যা (Atlas):**
   - ইউজারনেম এবং পাসওয়ার্ড চেক করুন
   - IP হোয়াাইটলিস্ট চেক করুন
   - নেটওয়ার্ক অ্যাক্সেস চেক করুন

### **কোড সমস্যা:**

1. **মডেল ইম্পোর্ট সমস্যা:**
   ```typescript
   import { connectToMongoDB } from '@/lib/mongodb';
   import { Member, Deposit, Accountant } from '@/models';
   ```

2. **টাইপ সমস্যা:**
   ```typescript
   // ObjectId কে string এ কনভার্ট করুন
   const memberId = member._id.toString();
   ```

## 📊 পারফরম্যান্স টিপস

### **ইনডেক্সিং:**
MongoDB স্কিমাতে ইতিমধ্যেই প্রয়োজনীয় ইনডেক্স যোগ করা হয়েছে:
- `mobileNumber` (unique)
- `nationalId` (unique)
- `memberId, month, year` (compound unique)

### **কোয়েরি অপ্টিমাইজেশন:**
```javascript
// ভালো পারফরম্যান্সের জন্য
const members = await Member.find({ isActive: true })
  .select('name mobileNumber totalDeposits')
  .sort({ joinedAt: -1 })
  .lean();
```

## 🔒 সিকিউরিটি বেস্ট প্র্যাকটিস

1. **Environment Variables:** কখনই `.env` ফাইল কমিট করবেন না
2. **Connection Security:** প্রোডাকশনে SSL/TLS ব্যবহার করুন
3. **Input Validation:** সকল ইনপুট ভ্যালিডেট করুন
4. **Error Handling:** সঠিক এরর হ্যান্ডলিং করুন
5. **Rate Limiting:** API রিকোয়েস্ট লিমিট করুন

## 🚀 ডিপ্লয়মেন্ট

### **Vercel:**
1. Environment Variables সেট করুন
2. MongoDB Atlas URI ব্যবহার করুন
3. ডিপ্লয় করুন

### **Heroku:**
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
git push heroku main
```

### **Docker:**
```dockerfile
FROM node:18-alpine
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## 📞 সাপোর্ট

কোনো সমস্যা হলে:
1. MongoDB লগ চেক করুন
2. কানেকশন টেস্ট করুন
3. এরর মেসেজ রিভিউ করুন
4. ডকুমেন্টেশন ফলো করুন