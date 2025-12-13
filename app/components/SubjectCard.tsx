import Link from "next/link";
import { Calendar, FileText } from "lucide-react";

interface SubjectCardProps {
  id: string;
  name: string;
  examDate: string;
  progress: number; // 0 to 100
}

export default function SubjectCard({ id, name, examDate, progress }: SubjectCardProps) {
  return (
    <Link href={`/subject/${id}`} className="block group">
      <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer bg-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
            {progress}% Prep
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Exam: {examDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>2 Files Uploaded</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Link>
  );
}