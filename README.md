# BookNook – A Small Online Library (Assignment-8)

- **Live Client URL (Website)**: [https://aassignment-8.vercel.app](https://aassignment-8.vercel.app)  
- **Live Server API (JSON Endpoints)**: [https://aassignment-8.vercel.app/api](https://aassignment-8.vercel.app/api)  

> **Unified Single Deployment**: Client এবং Backend API উভয়ই একই সাথে Vercel-এ লাইভ। ওয়েবসাইটের নেভিগেশন বারে থাকা **"Live API"** বাটনে ক্লিক করে সরাসরি লাইভ সার্ভারের রাউট ও JSON রেসপন্স দেখা যাবে।

---

## 📁 Repository Structure
```
Assignment-8/
├── client/          # Next.js 14 (App Router) Frontend + Built-in Serverless API Endpoints
└── server/          # Express.js & MongoDB Standalone Backend (with vercel.json support)
```

---

## ✨ 5 Key Website Features
1. **Dynamic Multi-Slide Hero & New Arrivals**: Swiper.js banner with 3+ thematic slides and real-time MongoDB queries fetching the 6 newest catalog additions.
2. **Real-Time Borrow & Return System**: Automatic `$inc` decrement and increment for available copies, complete with anti-duplicate borrow validation.
3. **Multi-Genre Filter & Search**: Instant filtering across Fiction, Science, History, Kids, and Others, with keyword search and sorting.
4. **Persistent Private Route Security**: Logged-in users remain securely authenticated across reloads without accidental redirects to login.
5. **Theme Customization & Responsive Layout**: Instant Light/Dark mode switcher, equal-height card grids, and mobile navigation drawer.

---

## 🏃 Quick Start Guide

### Start the Server:
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Start the Client:
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:3000
```

