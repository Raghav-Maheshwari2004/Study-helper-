import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  name: string;
  examDate: Date;
  syllabus: string;
  createdAt: Date;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  syllabus: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

// This line checks if the model exists before creating it (prevents errors during hot reload)
const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;