"use client";

import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { User, Mail, GraduationCap, LogOut, Save } from "lucide-react";

export default function ProfilePage() {
  const bgFarRef = useRef<HTMLDivElement | null>(null);
  const bgNearRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const far = bgFarRef.current;
    const near = bgNearRef.current;
    if (!far) return;

    let raf = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      if (prefersReducedMotion) return;
      const y = window.scrollY || 0;
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        far.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
        if (near) near.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <section className="parallax min-h-screen">
        <div
          ref={bgFarRef}
          className="parallax-bg parallax-bg--far"
          style={{
            backgroundImage: "url('/hero2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          ref={bgNearRef}
          className="parallax-bg parallax-bg--near"
          style={{
            backgroundImage: "url('/hero2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="parallax-layer parallax-layer--orbs" />

        <main className="parallax-content container max-w-3xl p-4 sm:p-8">
          <header className="glass p-5 sm:p-6 mb-6">
            <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
            <p className="text-white/75 mt-1">Manage your details and preferences.</p>
          </header>

          <div className="glass overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-orange-500/80 to-fuchsia-500/70 border-b border-white/10" />

            <div className="px-6 sm:px-8 pb-8">
              <div className="relative -mt-10 mb-5">
                <div className="w-20 h-20 rounded-full p-1 inline-block bg-black/30 border border-white/15">
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white bg-white/10">
                    <User className="w-9 h-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        defaultValue="Rahul Kumar"
                        className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/10 text-white placeholder:text-white/50 border border-white/15 focus:ring-2 focus:ring-orange-400/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                      <input
                        type="email"
                        defaultValue="rahul.vit@example.com"
                        className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/5 text-white/70 border border-white/10"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">University</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        defaultValue="VIT Vellore"
                        className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/10 text-white placeholder:text-white/50 border border-white/15 focus:ring-2 focus:ring-fuchsia-400/35"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Year of Study</label>
                    <select
                      defaultValue="4"
                      className="w-full px-4 py-2 rounded-lg outline-none bg-white/10 text-white border border-white/15 focus:ring-2 focus:ring-orange-400/40"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <button className="btn btn-soft w-full sm:w-auto text-red-300 border border-white/15 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>

                  <button className="btn btn-primary w-full sm:w-auto">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}