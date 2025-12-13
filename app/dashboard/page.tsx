"use client"; // <--- Don't forget this at the top!

import { useState } from "react";
import Navbar from "../components/Navbar";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal from "../components/AddSubjectModal"; // <--- Import the modal
import { Plus } from "lucide-react";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- State to control modal

  // Mock Data
  const subjects = [
    { id: "1", name: "Internet & Web Programming", examDate: "Dec 20, 2025", progress: 40 },
    { id: "2", name: "Big Data Analytics", examDate: "Dec 22, 2025", progress: 15 },
    { id: "3", name: "Computer Networks", examDate: "Dec 24, 2025", progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
            <p className="text-gray-500 mt-1">Ready to ace your exams?</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} // <--- Click opens the modal
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Add Subject
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <SubjectCard 
              key={sub.id} 
              id={sub.id} 
              name={sub.name} 
              examDate={sub.examDate} 
              progress={sub.progress} 
            />
          ))}
        </div>
      </main>

      {/* The Modal Component sits here, waiting to be opened */}
      <AddSubjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}