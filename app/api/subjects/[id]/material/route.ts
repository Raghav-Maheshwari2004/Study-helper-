import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Subject from "@/models/Subject";

export async function POST(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log("--------------------------------");
    console.log(`[UPLOAD DEBUG] Saving file for Subject ID: ${id}`);
    console.log("[UPLOAD DEBUG] File Data:", body);

    await connectDB();
    
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { 
        $push: { 
          materials: { 
            fileName: body.fileName, 
            fileUrl: body.fileUrl, 
            fileType: body.fileType 
          } 
        } 
      },
      { new: true }
    );

    if (!updatedSubject) {
      console.log("[UPLOAD DEBUG] ❌ Subject not found in DB");
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    console.log("[UPLOAD DEBUG] ✅ Success! Material count:", updatedSubject.materials.length);
    return NextResponse.json(updatedSubject, { status: 200 });

  } catch (error) {
    console.error("[UPLOAD DEBUG] 💥 Error:", error);
    return NextResponse.json({ message: "Error saving file" }, { status: 500 });
  }
}