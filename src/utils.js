import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_OPTIONS } from '@/const';
import { cosmiconfig } from 'cosmiconfig';

/**
 * Resolve config from package.json
 *
 * @returns {Promise<SpriteOptions>}
 */
export async function resolveConfig() {
  const cfg = await cosmiconfig('sprite').load('package.json');
  return cfg?.config
    ? Object.assign(DEFAULT_OPTIONS, cfg?.config)
    : DEFAULT_OPTIONS;
}

/**
 * Read files asynchronously
 *
 * @param {string} file - Filepath
 */
export async function readFile(file) {
  if (!fs.existsSync(file)) return '';
  return await fs.promises.readFile(file, 'utf-8').catch(() => '');
}

/**
 * Write to file only if content changed
 *
 * @param {string} file - Target file path
 * @param {string} content - File content
 * @param {boolean} forced - Override existing file
 */
export async function writeFile(file, content, forced = false) {
  if (!forced) {
    const current = await readFile(file);
    if (current === content) return;
  }
  fs.writeFileSync(file, content, 'utf-8');
  return path.relative(process.cwd(), file);
}

/**
 * Ensure the directory exists
 *
 * @param {string} dir - Target directory
 * @param {boolean} isFilePath Check if filepath
 */
export async function ensureDirectory(dir, isFilePath = false) {
  dir = isFilePath ? path.dirname(dir) : dir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Extract icon names & content from files
 *
 * @param {string} file - Filepath to target
 * @param {RegExp} pattern - Regex pattern to find icon names
 */
export async function parseFileContent(file, pattern) {
  const content = await readFile(file);
  const iconNames = [];
  let /** @type {RegExpExecArray | null} */ match;
  while ((match = pattern.exec(content)) !== null) {
    iconNames.push(match[1]);
  }
  return { content, iconNames };
}

/**
 * Compare and contrast two arrays of strings
 *
 * @param {string[]} A - First array
 * @param {string[]} B - Second array
 * @returns {boolean} - True if both arrays contain the same strings, otherwise
 *   false
 */
export function compareArrays(A, B) {
  if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) {
    return false;
  }
  // Sort the arrays to ensure consistent order for comparison
  A = A.slice().sort();
  B = B.slice().sort();
  // Check if all elements in the sorted arrays are equal
  return A.every((value, i) => value === B[i]);
}
