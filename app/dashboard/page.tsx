"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, BookOpen, Calendar, Clock, Trash2, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';
import AddSubjectModal from "../components/AddSubjectModal";

// Dynamically import the Navbar to avoid SSR issues with theme
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

// Create a client-side only version of the dashboard content
function DashboardContent() {

  interface Subject {
    _id: string;
    name: string;
    examDate: string;
    syllabus: string;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const bgFarRef = useRef<HTMLDivElement | null>(null);
  const bgNearRef = useRef<HTMLDivElement | null>(null);

  // --- 1. FETCH DATA ---
  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

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

  // --- 2. DELETE FUNCTION (Bonus Feature) ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    setDeletingId(id);
    try {
      // We will need to add a DELETE handler in the API later, 
      // for now, let's just update the UI locally to hide it.
      // await fetch(`/api/subjects?id=${id}`, { method: "DELETE" }); 
      
      // Temporary: Just remove from screen
      setSubjects(prev => prev.filter(sub => sub._id !== id));
    } catch (error) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Navbar />
      <section className="parallax min-h-screen">
        <div
          ref={bgFarRef}
          className="parallax-bg parallax-bg--far"
          style={{
            backgroundImage: "url('/hero1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          ref={bgNearRef}
          className="parallax-bg parallax-bg--near"
          style={{
            backgroundImage: "url('/hero1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="parallax-layer parallax-layer--orbs" />
        <main className="parallax-content container p-4 pt-6">
          {/* Header Section */}
          <header className="glass p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
                Your Dashboard
              </h1>
              <p className="text-base sm:text-lg text-white/80">
                You have <span className="font-bold gradient-text">{subjects.length}</span> upcoming exams.
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
            >
              <Plus className="w-5 h-5" />
              Add Subject
            </button>
          </header>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          ) : subjects.length === 0 ? (
            /* Empty State */
            <div className="glass text-center py-20 rounded-3xl">
              <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-white border border-white/15">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">No subjects yet</h3>
              <p className="text-white/75 max-w-md mx-auto">
                Click the "Add Subject" button to start tracking your exams and syllabus.
              </p>
            </div>
          ) : (
            /* Subjects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div 
                  key={subject._id} 
                  className="card group relative p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold bg-black/10 dark:bg-white/10 text-gray-900 dark:text-white border border-black/5 dark:border-white/10">
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(subject._id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Subject Name */}
                  <h3 className="text-xl font-bold mb-3 truncate pr-4 text-gray-900 dark:text-white">
                    {subject.name}
                  </h3>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700/80 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(subject.examDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>

                    {/* Syllabus Box - Fixed Contrast */}
                    <div className="flex items-start gap-2 p-3 rounded-lg text-sm leading-relaxed bg-black/5 dark:bg-white/5 text-gray-900/80 dark:text-gray-200 border border-black/5 dark:border-white/10">
                      <Clock className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                      <span className="line-clamp-2">
                        {subject.syllabus || "No syllabus notes added."}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddSubjectModal 
            isOpen={isModalOpen} 
            onClose={() => {
              setIsModalOpen(false);
              fetchSubjects(); 
            }} 
          />
        </main>
      </section>
    </div>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on the server
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <DashboardContent />;
}