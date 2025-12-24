import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define a route named "subjectResources"
  subjectResources: f({ 
    // Define allowed file types and sizes
    pdf: { maxFileSize: "16MB", maxFileCount: 4 },
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    text: { maxFileSize: "64KB" },
    blob: { maxFileSize: "16MB" } // Covers other types like PPT/DOC
  })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server when upload is done
      console.log("Upload complete for file:", file.url);
      
      // We return this metadata to the client (optional)
      return { uploadedBy: "user" };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;