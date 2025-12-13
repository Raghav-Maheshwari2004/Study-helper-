"use client";

import Link from 'next/link';
import { BookOpen, User, Palette, Moon, Sun, Monitor } from 'lucide-react'; // Icons
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import the hook

export default function Navbar() {
  const { setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-6 border-b border-gray-100 bg-white transition-colors duration-300">
      <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <BookOpen />
        <span>StudySync</span>
      </Link>
      
      <div className="flex gap-4 items-center">
        
        {/* THEME DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50">
              <button 
                onClick={() => { setTheme('light'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
              >
                <Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => { setTheme('dark'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700"
              >
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button 
                onClick={() => { setTheme('tech'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 font-mono"
              >
                <Monitor className="w-4 h-4" /> Cyber
              </button>
            </div>
          )}
        </div>

        {/* Profile Button */}
        <Link href="/profile"> 
          <button className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            <User className="w-4 h-4" />
            Profile
          </button>
        </Link>
      </div>
    </nav>
  );
}