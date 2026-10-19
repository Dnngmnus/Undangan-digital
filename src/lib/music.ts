import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";

export type Track = { file: string; title: string; url: string };

const DIR = path.join(process.cwd(), "public", "music");
const AUDIO = /\.(mp3|m4a|ogg|wav)$/i;

/**
 * Pustaka lagu = semua file audio di public/music/ (diurutkan menurut nama file).
 * Judul diambil dari nama file: "Akad - Instrumental_Piano.mp3" → "Akad - Instrumental Piano".
 *
 * Catatan: Next.js hanya menyajikan file public yang ada saat build,
 * jadi lagu baru ditambahkan di PC lalu di-build ulang (deploy/update-stb.sh).
 */
export async function getMusicLibrary(): Promise<Track[]> {
  try {
    const files = (await readdir(DIR)).filter((f) => AUDIO.test(f) && !f.startsWith("."));
    return files
      .sort((a, b) => a.localeCompare(b, "id"))
      .map((file) => ({
        file,
        title: file.replace(AUDIO, "").replace(/_/g, " ").trim(),
        url: `/music/${encodeURIComponent(file)}`,
      }));
  } catch {
    return []; // folder belum ada / kosong
  }
}
