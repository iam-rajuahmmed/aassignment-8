# BookNook – A Small Online Library

**Live Application URL**: [https://booknook-online-library.vercel.app](https://booknook-online-library.vercel.app)  
**Server API Endpoint**: [https://booknook-server.onrender.com](https://booknook-server.onrender.com)

---

## 📖 Overview
**BookNook** is a community-powered digital library platform designed around a clean and intuitive philosophy: *"Add a book, borrow a book, return a book."* Readers can seamlessly explore curated literature, contribute new books, borrow titles with automatic inventory tracking, and manage their loans in a modern dashboard.

---

## ✨ Key Features (Minimum 5 Highlights)
- **Interactive Book Circulation System**: Readers can borrow books with a single click, choose custom return timelines, and track their active loans in their personal dashboard.
- **Real-Time Stock & Duplicate Prevention**: Incorporates MongoDB `$inc` atomic decrement on borrow and increment on return, while strictly forbidding duplicate concurrent borrows for the same title.
- **Dynamic Swiper.js Hero Experience**: Features an immersive multi-slide banner showcasing top categories, literature highlights, and instant navigation to the catalog.
- **Comprehensive Catalog Search & Multi-Genre Filtering**: Filter catalog books by Fiction, Science, History, Kids, and Others, alongside real-time search by author or title and custom sorting.
- **Bulletproof JWT Authentication & Session Persistence**: Seamless authentication with email/password and Google OAuth, featuring zero-logout reloads on all private routes and secure Bearer token protection for all Express API endpoints.
- **Zero Lorem Ipsum & Accessible Design**: Authentically written book entries, synopsis records, and reader reviews paired with a smooth Dark/Light mode theme toggle.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Icons & UI**: Lucide React, Framer Motion, Swiper.js, React Hot Toast
- **Authentication**: JWT Authorization & Persistent Session Management
- **Image Hosting**: ImgBB API Integration with fallback preview
- **Backend**: Express.js, Node.js, MongoDB Driver, JSON Web Tokens

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- NPM or Yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/booknook-client.git

# Navigate to client directory
cd booknook-client

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the `client` directory:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=d5a0c8e2270923055ba2e6467362df5b
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Private Routes
- `/add-book`: Add new book to library
- `/my-books`: Edit and delete books contributed by logged-in user
- `/my-borrows`: View and return borrowed books
- `/profile`: View personal reader profile and library statistics
- `/books/[id]`: Book details and loan reservation modal

---

## 📄 License
This project is licensed under the MIT License.

