"use client";

import { useState } from "react";
import { X, Clock, Target, Sparkles, Loader2 } from "lucide-react";

interface GeneratePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  onGenerate: (hours: number, difficulty: string) => void;
  loading: boolean;
}

export default function GeneratePlanModal({ 
  isOpen, 
  onClose, 
  subjectName, 
  onGenerate,
  loading 
}: GeneratePlanModalProps) {
  const [hours, setHours] = useState(2);
  const [difficulty, setDifficulty] = useState("Medium");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              AI Study Planner
            </h2>
            <p className="text-blue-100 text-sm mt-1">Generating plan for: <span className="font-semibold">{subjectName}</span></p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Question 1: Hours */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              How many hours per day?
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="1" max="8" step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-lg font-bold text-blue-600 w-12 text-center">{hours}h</span>
            </div>
          </div>

          {/* Question 2: Difficulty */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Target className="w-4 h-4 text-red-500" />
              Intensity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    difficulty === level
                      ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={() => onGenerate(hours, difficulty)}
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Thinking...</> : "Generate My Plan"}
          </button>
        </div>

      </div>
    </div>
  );
}