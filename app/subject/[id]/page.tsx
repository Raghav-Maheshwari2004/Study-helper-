"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar"; // Adjust path if needed
import { ArrowLeft, UploadCloud, FileText, CheckCircle, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function SubjectDetails({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("materials");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto p-8">
        {/* 1. Header Section */}
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Internet & Web Programming</h1>
              <p className="text-gray-500 mt-1">Exam Date: Dec 20, 2025 • 5 Days Left</p>
            </div>
            <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              Generate New Plan
            </button>
          </div>
        </div>

        {/* 2. Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <TabButton 
            label="Study Materials" 
            isActive={activeTab === "materials"} 
            onClick={() => setActiveTab("materials")} 
          />
          <TabButton 
            label="My Timetable" 
            isActive={activeTab === "timetable"} 
            onClick={() => setActiveTab("timetable")} 
          />
        </div>

        {/* 3. Tab Content */}
        {activeTab === "materials" ? <MaterialsView /> : <TimetableView />}
        
      </main>
    </div>
  );
}

// --- Sub-Components for UI Organization ---

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
        isActive 
          ? "border-blue-600 text-blue-600" 
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function MaterialsView() {
  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition cursor-pointer">
        <div className="bg-blue-50 p-3 rounded-full mb-3">
          <UploadCloud className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-gray-900 font-medium">Click to upload or drag and drop</h3>
        <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG (max 10MB)</p>
      </div>

      {/* File List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between">
          <h3 className="font-semibold text-gray-700">Uploaded Files (2)</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <FileItem name="Module 1 - HTML Basics.pdf" size="2.4 MB" />
          <FileItem name="Module 2 - CSS Grid.pdf" size="1.1 MB" />
        </div>
      </div>
    </div>
  );
}

function FileItem({ name, size }: { name: string; size: string }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="bg-red-50 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{size}</p>
        </div>
      </div>
      <button className="text-sm text-blue-600 font-medium hover:underline">
        Summarize
      </button>
    </div>
  );
}

function TimetableView() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
        <Clock className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-800">
          You are on track! Complete 2 more topics today to meet your goal.
        </p>
      </div>

      <div className="space-y-3">
        <TaskItem title="Learn HTML5 Semantic Tags" status="completed" />
        <TaskItem title="Practice Flexbox layouts" status="pending" />
        <TaskItem title="Read about DOM Manipulation" status="pending" />
      </div>
    </div>
  );
}

function TaskItem({ title, status }: { title: string; status: "completed" | "pending" }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl">
      {status === "completed" ? (
        <CheckCircle className="w-6 h-6 text-green-500" />
      ) : (
        <PlayCircle className="w-6 h-6 text-gray-300 hover:text-blue-500 cursor-pointer" />
      )}
      <span className={`flex-1 font-medium ${status === "completed" ? "text-gray-400 line-through" : "text-gray-900"}`}>
        {title}
      </span>
      <span className="text-xs text-gray-400">1.5 hrs</span>
    </div>
  );
}