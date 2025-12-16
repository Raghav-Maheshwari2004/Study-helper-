"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, Calendar, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";

export default function Home() {
  // Optional: Just to ensure hydration doesn't mismatch
  const [mounted, setMounted] = useState(false);
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroNearRef = useRef<HTMLDivElement | null>(null);
  const heroPanelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    const el = heroBgRef.current;
    const near = heroNearRef.current;
    const panel = heroPanelRef.current;
    if (!el) return;

    let raf = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (prefersReducedMotion) return;
      const y = window.scrollY || 0;
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        if (near) near.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
      });
    };

    const onMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -8;
      const ry = (px - 0.5) * 10;
      panel.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };

    const onLeave = () => {
      if (!panel) return;
      panel.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar variant="landing" />

      {/* 2. Hero Section */}
      <section className="parallax parallax-hero">
        <div
          ref={heroBgRef}
          className="parallax-bg parallax-bg--far"
          style={{
            backgroundImage:
              "url('/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          ref={heroNearRef}
          className="parallax-bg parallax-bg--near"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="parallax-layer parallax-layer--orbs" />
        <div className="parallax-content">
          <main ref={heroPanelRef} className="hero-panel flex flex-col items-center justify-center text-center px-4 mt-6 max-w-4xl mx-auto glass py-8 sm:py-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/35 text-white text-sm font-medium mb-5 border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
              </span>
              AI-Powered Study Planner
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white">
              Exam prep, but <br />
              <span className="gradient-text">smarter not harder.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-white/80 mb-6 max-w-2xl leading-relaxed">
              Upload your syllabus and notes. Our AI generates a personalized timetable and summarizes everything for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/dashboard" 
                className="btn btn-primary"
              >
                Go to Dashboard <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
              <button className="btn btn-soft">
                Watch Demo
              </button>
            </div>

            {/* 3. Feature Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left w-full">
              <FeatureCard 
                icon={<FileText className="w-5 h-5 text-orange-500" />}
                title="Upload Material"
                desc="Drop your PDF notes and syllabus. We organize them by subject automatically."
              />
              <FeatureCard 
                icon={<BrainCircuit className="w-5 h-5 text-fuchsia-500" />}
                title="AI Summaries"
                desc="Get instant bullet-point summaries of your lengthy chapters and modules."
              />
               <FeatureCard 
                icon={<Calendar className="w-5 h-5 text-emerald-500" />}
                title="Smart Schedule"
                desc="We calculate the days left and create a perfect daily study plan for you."
              />
            </div>
          </main>
        </div>
      </section>

      {/* 4. Footer */}
      
    </div>
  );
}

// --- Helper Component for Cards ---
function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="bg-white/10 dark:bg-gray-700/80 w-11 h-11 rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform border border-black/5 dark:border-white/10">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-700/80 dark:text-gray-300 leading-relaxed">{desc}</p>
    </div>
  );
}