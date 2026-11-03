'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { BookOpen, Sparkles, Compass, Bookmark } from 'lucide-react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface SlideData {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  accent: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "Welcome to BookNook",
    title: "Discover Stories That Ignite Your Imagination",
    description: "Borrow world-class literature, cutting-edge science, and timeless historical epics without limits. Free community sharing for every passionate reader.",
    image: "https://images.unsplash.com/photo-1507842229451-7643b1778c18?auto=format&fit=crop&w=1600&q=80",
    accent: "from-amber-600 to-amber-700"
  },
  {
    id: 2,
    tag: "Community-Powered Lending",
    title: "Borrow Today, Return Tomorrow, Share Forever",
    description: "Contribute your own books to the library shelves and borrow curated reads from fellow bibliophiles with zero hassle and instant availability tracking.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
    accent: "from-emerald-600 to-emerald-700"
  },
  {
    id: 3,
    tag: "Curated Knowledge Base",
    title: "Expand Your Horizons Across Science & History",
    description: "From astrophysics to ancient civilizations, dive into meticulously curated volumes selected by our readers and community curators worldwide.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
    accent: "from-blue-600 to-blue-700"
  }
];

export default function BannerSlider() {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-16 border border-amber-200/50 dark:border-slate-800">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-amber-500 !w-8 !rounded-full transition-all duration-300',
        }}
        navigation={true}
        loop={true}
        className="w-full h-[480px] md:h-[540px] text-white"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center">
              {/* Background Image with Dark Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 max-w-2xl px-8 md:px-16 space-y-5 animate-in fade-in slide-in-from-left duration-700">
                {/* Category / Highlight Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.tag}</span>
                </div>

                {/* Main Heading */}
                <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  {slide.title}
                </h1>

                {/* Subtext */}
                <p className="text-base md:text-lg text-slate-200 leading-relaxed max-w-xl font-normal">
                  {slide.description}
                </p>

                {/* Browse Books Button (Navigates to /books) */}
                <div className="pt-2">
                  <a
                    href="/books"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/30 hover:scale-105 transition-all duration-200"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Browse Books</span>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

