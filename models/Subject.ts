import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define the shape of a single "Study Material" file
interface IMaterial {
  fileName: string;
  fileUrl: string;
  fileType: string; // e.g., "pdf", "jpg", "pptx"
  uploadedAt: Date;
}

// 2. Update the main Subject interface to include the list of materials
export interface ISubject extends Document {
  name: string;
  examDate: Date;
  syllabus: string;
  materials: IMaterial[]; // <--- NEW: Array of materials
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  syllabus: { type: String, required: false },
  
  // 3. Add the materials array to the database schema
  materials: [
    {
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
      fileType: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  
  createdAt: { type: Date, default: Date.now },
});

// This line checks if the model exists before creating it
const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;