import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'uploads');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export interface SaveImageResult {
  relativePath: string;
  absolutePath: string;
}

export function saveBase64Image(base64: string, folder: 'shops' | 'menus'): SaveImageResult {
  const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error('รูปไม่ถูกต้อง (ต้องเป็น data URL)');
  const mime = matches[1];
  const data = matches[2];
  const ext = mime.split('/')[1] === 'jpeg' ? 'jpg' : mime.split('/')[1];
  const buffer = Buffer.from(data, 'base64');
  const subDir = path.join(baseDir, folder);
  ensureDir(subDir);
  const filename = `${folder}-${Date.now()}-${Math.random().toString(16).slice(2,8)}.${ext}`;
  const absolute = path.join(subDir, filename);
  fs.writeFileSync(absolute, buffer);
  return { relativePath: `/uploads/${folder}/${filename}`, absolutePath: absolute };
}

export function deleteImage(relativePath?: string | null) {
  if (!relativePath) return;
  if (!relativePath.startsWith('/uploads/')) return;
  const absolute = path.join(process.cwd(), relativePath.replace(/^\//,''));
  if (fs.existsSync(absolute)) fs.unlinkSync(absolute);
}

export function buildPublicUrl(relativePath?: string | null) {
  if (!relativePath) return null;
  const apiBase = (process.env.PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
  if (!apiBase) return relativePath; // fallback relative
  // If apiBase ends with /api remove /api for static root
  const origin = apiBase.endsWith('/api') ? apiBase.slice(0, -4) : apiBase;
  return origin + relativePath;
}