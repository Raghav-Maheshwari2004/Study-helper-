"use client";

import Link from 'next/link';
import { BookOpen, User, Palette, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

type NavbarVariant = 'app' | 'landing';

export default function Navbar({ variant = 'app' }: { variant?: NavbarVariant }) {
  // 1. Use 'setTheme' instead of 'toggleTheme' so we can choose specific modes
  const { setTheme, theme } = useTheme(); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (variant === 'landing') {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/35 text-white backdrop-blur-xl">
        <div className="container h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/15 transition-colors">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">StudySync</span>
          </Link>

          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </nav>
    );
  }

  return (
    // 2. We use standard colors (white/gray-900) that match your globals.css
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/35 text-white backdrop-blur-xl">
      <div className="container h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/15 group-hover:scale-110 transition-all">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">StudySync</span>
        </Link>
        
        <div className="flex items-center gap-3">
          
          {/* Theme Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Theme selector"
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-black/60 text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                  
                  <div className="px-4 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider bg-white/5">
                    Theme
                  </div>

                  <button
                    onClick={() => { setTheme('light'); setIsDropdownOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/10
                      ${theme === 'light' ? 'text-orange-300 font-semibold' : 'text-white/85'}
                    `}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>

                  <button
                    onClick={() => { setTheme('dark'); setIsDropdownOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/10
                      ${theme === 'dark' ? 'text-orange-300 font-semibold' : 'text-white/85'}
                    `}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>

                  <button
                    onClick={() => { setTheme('tech'); setIsDropdownOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-white/10 font-mono
                      ${theme === 'tech' ? 'text-cyan-300 font-bold' : 'text-white/85'}
                    `}
                  >
                    <Monitor className="w-4 h-4" /> Cyber
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Profile Button */}
          <Link href="/profile">
            <button className="flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium transition-colors bg-white/10 hover:bg-white/15 border border-white/10 text-white">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}