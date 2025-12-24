import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";
 
// This imports the "Receptionist" router we made earlier
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
// This creates the actual Button component you can use in your app
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();