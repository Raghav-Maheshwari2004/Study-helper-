import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";

// 1. GET: Fetch All Subjects (Restores your "missing" subjects)
export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find().sort({ examDate: 1 });
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

// 2. POST: Create a New Subject (Fixes the 405 Error)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, examDate, syllabus } = body;

    const newSubject = await Subject.create({
      name,
      examDate,
      syllabus,
      materials: [] // Initialize with empty materials
    });

    return NextResponse.json({ message: "Subject Created", subject: newSubject }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}