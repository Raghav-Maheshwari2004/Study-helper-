import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";

export async function GET(
  request: Request,
  // 1. Change the type definition to Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. AWAIT the params to get the actual ID
    const { id } = await params;

    console.log("------------------------------------------------");
    console.log(`[API DEBUG] Incoming Request for ID: ${id}`);

    await connectDB();
    
    // 3. Use the unwrapped 'id'
    const subject = await Subject.findById(id);
    
    if (!subject) {
      console.log(`[API DEBUG] ❌ Result: Subject NOT found in DB.`);
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    console.log(`[API DEBUG] ✅ Result: Found Subject "${subject.name}"`);
    console.log("------------------------------------------------");

    return NextResponse.json(subject, { status: 200 });

  } catch (error) {
    console.error("[API DEBUG] 💥 CRASH:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}