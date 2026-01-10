"use client";

import { useState } from "react";
import { X, Sparkles, FileText, Loader2, Copy, Check, ChevronDown, UploadCloud } from "lucide-react";
import { UploadButton } from "@/app/utils/uploadthing"; 

interface Material {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
}

export default function SummaryModal({ isOpen, onClose, materials }: SummaryModalProps) {
  const [activeTab, setActiveTab] = useState<"select" | "upload">("select");
  const [selectedFile, setSelectedFile] = useState<Material | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setSummary(""); 

    try {
      // 🚀 CALL THE REAL API HERE
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedFile),
      });

      if (!res.ok) throw new Error("Failed");
      
      const data = await res.json();
      setSummary(data.summary);

    } catch (error) {
      setSummary("Error generating summary. Please ensure the file is a readable PDF or Image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h2 className="text-xl font-bold">AI Smart Summary</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 hover:opacity-80" /></button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          
          {/* TABS */}
          <div className="flex p-1 bg-gray-200 rounded-lg mb-6">
            <button
              onClick={() => { setActiveTab("select"); setSummary(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "select" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Select Existing
            </button>
            <button
              onClick={() => { setActiveTab("upload"); setSummary(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "upload" ? "bg-white text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Upload New
            </button>
          </div>

          {/* TAB: SELECT */}
          {activeTab === "select" && (
            <div className="mb-6 animate-in slide-in-from-left-2 fade-in">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choose a file from library:</label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer"
                  onChange={(e) => {
                    const file = materials.find(m => m.fileName === e.target.value);
                    setSelectedFile(file || null);
                    setSummary("");
                  }}
                  value={selectedFile?.fileName || ""}
                >
                  <option value="" disabled>-- Choose a file --</option>
                  {materials.map((m, idx) => (
                    <option key={idx} value={m.fileName}>{m.fileName}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* TAB: UPLOAD */}
          {activeTab === "upload" && (
            <div className="mb-6 border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center animate-in slide-in-from-right-2 fade-in">
              <UploadCloud className="w-10 h-10 text-purple-300 mb-3" />
              <p className="text-sm text-gray-500 mb-4 text-center">Upload PDF or Image for instant analysis.</p>
              
              <UploadButton
                endpoint="subjectResources"
                onClientUploadComplete={(res) => {
                  const file = res[0];
                  // Auto-Select the new file
                  const newFile = { 
                    fileName: file.name, 
                    fileUrl: file.url, 
                    fileType: file.name.split('.').pop() || "unknown" 
                  };
                  setSelectedFile(newFile);
                  setActiveTab("select"); // Switch tab to show it's selected
                  alert(`Uploaded ${file.name}! Click 'Generate Summary'.`);
                }}
                onUploadError={(error: Error) => alert(`Error: ${error.message}`)}
                appearance={{ 
                  button: "bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition",
                  allowedContent: "hidden" 
                }}
              />
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button 
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition mb-6 flex items-center justify-center gap-2
              ${!selectedFile || loading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] transform"}`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? "Analyzing Document..." : "Generate Summary"}
          </button>

          {/* RESULT */}
          {summary && (
            <div className="prose prose-purple max-w-none bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{summary}</div>
            </div>
          )}
          
          {/* HINT */}
          {!summary && !loading && selectedFile && (
            <div className="text-center text-sm text-gray-400">
              Ready to analyze <strong>{selectedFile.fileName}</strong>
            </div>
          )}

        </div>

        {/* Footer */}
        {summary && (
          <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Text"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}