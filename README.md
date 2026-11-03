# BookNook – A Small Online Library (Assignment-8)

**Live Client URL**: [https://booknook-online-library.vercel.app](https://booknook-online-library.vercel.app)  
**Live Server API**: [https://booknook-server.onrender.com](https://booknook-server.onrender.com)

Welcome to **BookNook**, a full-stack online library application built with **Next.js (App Router)** and **Express.js with MongoDB**.

---

## 📁 Repository Structure
```
Assignment-8/
├── client/          # Next.js 14 (App Router) Frontend (15+ Git Commits)
└── server/          # Express.js & MongoDB Backend (8+ Git Commits)
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

