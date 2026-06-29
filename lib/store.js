import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'feedback.json');
const SEED_FILE = path.join(DATA_DIR, 'feedback.example.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    // feedback.json is git-ignored (runtime state). Seed a fresh clone from
    // the committed example so the demo data — including the visible XSS
    // entry — is present on first run.
    const seed = fs.existsSync(SEED_FILE) ? fs.readFileSync(SEED_FILE, 'utf-8') : '[]';
    fs.writeFileSync(DATA_FILE, seed, 'utf-8');
  }
}

export function readAll() {
  ensureFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading feedback:", error);
    return [];
  }
}

export function writeAll(items) {
  ensureFile();

  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(items, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing feedback:", error);
    throw error;
  }
}
