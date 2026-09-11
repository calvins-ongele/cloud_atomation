// engine/utils/files.ts
import crypto from "crypto";
import path from "path"; 
import fs from "fs";  
import { unlink } from 'fs/promises';
import { join } from 'path';

export function safeFileName(original: string): string {
  const base = original.toLowerCase().replace(/[^a-z0-9_.-]/g, "-");
  return base.replace(/-+/g, "-");
}

export function randomFileName(ext = ""): string {
  const id = crypto.randomBytes(12).toString("hex");
  return ext ? `${id}.${ext.replace(/^\./, "")}` : id;
}

export function getExtension(fileName: string): string {
  return path.extname(fileName).replace(".", "").toLowerCase();
}

export function isImageMime(mime: string): boolean {
  return /^image\//.test(mime);
}


export async function saveUpload(file: File, folder = "posts") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const name = crypto.randomBytes(16).toString("hex") + ext;

  const filepath = path.join(uploadDir, name);
  fs.writeFileSync(filepath, buffer);

  return `/uploads/${name}`;
}


export async function deleteLocalFile(fileName: string) {
  try {
    // Resolve the path safely (e.g., pointing to your 'public/uploads' folder)
    const filePath = join(process.cwd(), 'public', 'uploads', fileName);
    
    // Permanently remove the file from the filesystem
    await unlink(filePath);
    
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Failed to delete file:', error);
    return { success: false, message: 'File not found or couldn\'t be deleted' };
  }
}