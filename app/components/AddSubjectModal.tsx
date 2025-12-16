"use client";

import { useState } from "react";
import { X, BookOpen, Calendar, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; // <--- Needed to refresh the page

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddSubjectModal({ isOpen, onClose }: AddSubjectModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State variables to hold the user's input
  const [subjectName, setSubjectName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [syllabus, setSyllabus] = useState("");

  if (!isOpen) return null;

  // --- THE FUNCTION THAT CONNECTS TO MONGODB ---
  const handleSubmit = async () => {
    // 1. Basic validation
    if (!subjectName || !examDate) {
      alert("Please enter a Subject Name and Exam Date.");
      return;
    }

    setLoading(true);

    try {
      // 2. Send data to our backend API
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: subjectName,
          examDate: examDate,
          syllabus: syllabus,
        }),
      });

      if (res.ok) {
        // 3. Success! Clear form and close modal
        setSubjectName("");
        setExamDate("");
        setSyllabus("");
        onClose(); 
        router.refresh(); // Reloads the dashboard to show the new subject
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-md p-4">
      <div className="glass w-full max-w-md overflow-hidden border border-white/12 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-orange-500/25 to-fuchsia-500/20">
          <h2 className="text-lg font-bold text-white">Add New Subject</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Subject Name</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-4 h-4 text-white/50" />
              <input 
                type="text" 
                placeholder="e.g. Computer Networks"
                className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/10 text-white placeholder:text-white/50 border border-white/15 focus:ring-2 focus:ring-orange-400/40"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
          </div>

          {/* Exam Date */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Exam Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-white/50" />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/10 text-white border border-white/15 focus:ring-2 focus:ring-orange-400/40"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Copy Paste Syllabus</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-white/50" />
              <textarea 
                rows={4}
                placeholder="Unit 1: Introduction to..."
                className="w-full pl-10 pr-4 py-2 rounded-lg outline-none bg-white/10 text-white placeholder:text-white/50 border border-white/15 focus:ring-2 focus:ring-fuchsia-400/35 resize-none"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-white/10 bg-white/5">
          <button 
            onClick={onClose}
            className="btn btn-soft"
          >
            Cancel
          </button>
          
          {/* THIS BUTTON NOW TRIGGER THE SUBMIT FUNCTION */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Subject"}
          </button>
        </div>

      </div>
    </div>
  );
}