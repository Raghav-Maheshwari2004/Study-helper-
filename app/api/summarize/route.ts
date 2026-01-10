import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// =====================================================================
// 🔧 CRITICAL POLYFILLS
// These lines trick the PDF library into thinking it's in a browser.
// This prevents the "DOMMatrix is not defined" crash on the server.
// =====================================================================
// @ts-ignore
if (!global.DOMMatrix) global.DOMMatrix = class DOMMatrix {};
// @ts-ignore
if (!global.ImageData) global.ImageData = class ImageData {};
// @ts-ignore
if (!global.Path2D) global.Path2D = class Path2D {};
// =====================================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, fileType } = body;
    // Handle both 'fileUrl' (old) and 'ufsUrl' (new UploadThing format)
    const fileUrl = body.fileUrl || body.ufsUrl;

    if (!fileUrl) {
      return NextResponse.json({ summary: "Error: File URL is missing." }, { status: 400 });
    }

    const cleanName = fileName || "Document";

    // 1. Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // --- CHECK FILE TYPE ---
    const isPDF = fileType === "pdf" || fileName.toLowerCase().endsWith(".pdf");
    const isImage = ["png", "jpg", "jpeg", "webp"].includes(fileType) || fileName.match(/\.(jpg|jpeg|png|webp)$/i);

    // 2. Fetch File Content
    console.log(`📥 Fetching file: ${cleanName}`);
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    
    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let prompt = "";
    let imageParts: any[] = [];

    // 3. Process PDF (Real Text Extraction)
    if (isPDF) {
      console.log("📄 Parsing PDF Text...");
      try {
        // Dynamic require to handle Next.js bundling weirdness
        let pdfLib = require("pdf-parse");
        let pdfParse = pdfLib.default || pdfLib;
        
        // Double check we have the function
        if (typeof pdfParse !== 'function') {
             // In some rare builds, it might be nested differently
             try {
                pdfParse = require("pdf-parse/lib/pdf-parse.js");
             } catch (e) {
                console.warn("Could not find pdf-parse deep import");
             }
        }

        const data = await pdfParse(buffer);
        
        // Limit text to ~30k chars to fit in free tier context window
        const safeText = data.text.substring(0, 30000); 

        prompt = `
          You are an expert academic tutor. Summarize this document.
          
          DOCUMENT TITLE: ${cleanName}
          
          EXTRACTED CONTENT:
          ${safeText}
          
          INSTRUCTIONS:
          - Provide a 2-sentence executive summary.
          - List 5 Key Concepts with brief explanations.
          - Provide 1 specific "Exam Tip" based on the content.
          - Use Markdown formatting (bolding, headers).
        `;
      } catch (err: any) {
        console.error("PDF Parse Error:", err);
        return NextResponse.json({ summary: `Error reading PDF text: ${err.message}. The file might be encrypted or a scanned image without text.` }, { status: 500 });
      }
    } 
    // 4. Process Image
    else if (isImage) {
      console.log("🖼️ Analyzing Image...");
      prompt = "Analyze this study material image. Summarize the key points found in the text or diagrams.";
      imageParts = [{
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: fileResponse.headers.get("content-type") || "image/jpeg",
        },
      }];
    } 
    else {
      return NextResponse.json({ summary: "Unsupported file type. Please upload a PDF or Image." }, { status: 400 });
    }

    // 5. Send to AI (With Model Fallback)
    console.log("🤖 Sending to Gemini...");
    
    try {
      // Try Flash first (Faster, better context)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = imageParts.length > 0 
        ? await model.generateContent([prompt, ...imageParts])
        : await model.generateContent(prompt);
      
      return NextResponse.json({ summary: result.response.text() }, { status: 200 });

    } catch (apiError: any) {
      console.warn("⚠️ Flash model failed (likely 404 or Overload). Switching to 'gemini-pro'...");
      console.error(apiError); // Log the actual error for debugging
      
      try {
        // Fallback: Try the older stable model
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const result = imageParts.length > 0 
          ? await fallbackModel.generateContent([prompt, ...imageParts])
          : await fallbackModel.generateContent(prompt);

        return NextResponse.json({ summary: result.response.text() }, { status: 200 });
      } catch (fallbackError: any) {
         return NextResponse.json({ summary: `AI Service Unavailable: ${fallbackError.message}` }, { status: 500 });
      }
    }

  } catch (error: any) {
    console.error("General API Error:", error);
    return NextResponse.json({ summary: `Failed to generate summary. Error details: ${error.message}` }, { status: 500 });
  }
}