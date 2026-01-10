"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar"; 
import { ArrowLeft, FileText, ExternalLink, Loader2, CheckCircle, BookOpen, Sparkles } from "lucide-react";
import { UploadButton } from "@/app/utils/uploadthing"; 
import GeneratePlanModal from "@/app/components/GeneratePlanModal"; 
import SummaryModal from "@/app/components/SummaryModal"; // <--- RESTORED IMPORT

// --- 1. INTERFACES ---
interface Material {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

interface Subject {
  _id: string;
  name: string;
  examDate: string;
  syllabus?: string;
  materials: Material[];
}

interface PlanDay {
  day: number;
  phase: string;
  topics: string[];
  focus: string;
}

// --- 2. COMPONENT ---
export default function SubjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("materials");

  // --- STATES FOR MODALS ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // State for Summary Modal
  const [summaryFile, setSummaryFile] = useState<Material | null>(null); // <--- TRACKS SELECTED FILE

  const [timetableData, setTimetableData] = useState<PlanDay[]>([]); 

  // --- 3. FETCH DATA ---
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await fetch(`/api/subjects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSubject(data);
        }
      } catch (err) {
        console.error("Failed to load subject", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSubject();
  }, [id]);

  // --- 4. GENERATE PLAN HANDLER ---
  const handleGeneratePlan = async (hours: number, difficulty: string) => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: subject!.name,
          syllabus: subject!.syllabus || "", 
          examDate: subject!.examDate,
          hoursPerDay: hours,
          difficulty: difficulty
        })
      });

      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setTimetableData(data.plan); 
      setActiveTab("timetable"); 
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error generating plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin" /></div>;
  if (!subject) return <div className="p-8 text-center">Subject not found.</div>;

  const daysLeft = Math.ceil((new Date(subject.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />

      <main className="max-w-5xl mx-auto p-8">
        {/* HEADER */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-black mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-gray-500 mt-1">
                Exam Date: {new Date(subject.examDate).toDateString()} • <span className={daysLeft < 3 ? "text-red-500 font-bold" : "text-blue-600"}>{daysLeft} Days Left</span>
              </p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
            >
              Generate New Plan
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-200 mb-6">
          <button onClick={() => setActiveTab("materials")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "materials" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>
            Study Materials
          </button>
          <button onClick={() => setActiveTab("timetable")} className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "timetable" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>
            My Timetable
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === "materials" ? (
          <div className="space-y-6">
            {/* UPLOAD BOX */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition">
              <UploadButton
                endpoint="subjectResources"
                onClientUploadComplete={async (res) => {
                  const file = res[0];
                  await fetch(`/api/subjects/${id}/material`, {
                    method: "POST",
                    body: JSON.stringify({ fileName: file.name, fileUrl: file.url, fileType: file.name.split('.').pop() }),
                  });
                  window.location.reload(); 
                }}
                onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
                appearance={{ button: "bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800" }}
              />
            </div>

            {/* FILE LIST */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50"><h3 className="font-semibold text-gray-700">Uploaded Files ({subject.materials?.length || 0})</h3></div>
              <div className="divide-y divide-gray-100">
                {(!subject.materials || subject.materials.length === 0) ? (
                  <div className="p-8 text-center text-gray-500">No materials uploaded yet.</div>
                ) : (
                  subject.materials.map((file, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition group">
                      {/* Left Side: Icon & Name */}
                      <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-lg"><FileText className="w-5 h-5 text-red-500" /></div>
                        <div>
                          <a href={file.fileUrl} target="_blank" className="text-sm font-medium text-gray-900 hover:text-blue-600">{file.fileName}</a>
                          <p className="text-xs text-gray-500 uppercase">{file.fileType}</p>
                        </div>
                      </div>

                      {/* Right Side: Actions */}
                      <div className="flex items-center gap-4">
                        {/* SUMMARIZE BUTTON */}
                        <button 
                          onClick={() => setSummaryFile(file)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          Summarize
                        </button>
                        
                        <a href={file.fileUrl} target="_blank" className="text-gray-400 hover:text-black transition">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* --- TIMETABLE TAB --- */
          <div className="space-y-6">
            {timetableData.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No plan generated yet</h3>
                <p className="text-gray-500">Click the "Generate New Plan" button to start.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {timetableData.map((dayPlan, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">DAY {dayPlan.day}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                            ${dayPlan.phase === 'LEARNING' ? 'bg-blue-100 text-blue-700' : 
                              dayPlan.phase === 'PRACTICE' ? 'bg-orange-100 text-orange-700' : 
                              'bg-green-100 text-green-700'}`}>
                            {dayPlan.phase}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mt-2">{dayPlan.focus}</h3>
                      </div>
                      <CheckCircle className="w-6 h-6 text-gray-200 hover:text-green-500 cursor-pointer transition" />
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Topics to Cover:
                      </h4>
                      <ul className="space-y-2">
                        {dayPlan.topics.map((topic, tIdx) => (
                          <li key={tIdx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODALS */}
        <GeneratePlanModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          subjectName={subject.name}
          onGenerate={handleGeneratePlan}
          loading={generating}
        />

        {/* SUMMARY MODAL (Logic: Open if summaryFile is not null) */}
        {summaryFile && (
          <SummaryModal
            isOpen={!!summaryFile}
            onClose={() => setSummaryFile(null)}
            file={summaryFile}
          />
        )}
        
      </main>
    </div>
  );
}