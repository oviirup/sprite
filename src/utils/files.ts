import fs from 'node:fs';
import path from 'node:path';

/**
 * Ensure the directory exists
 *
 * @param targetPath - Path to directory
 * @param isFilePath - Specify if the given target path is a file
 */
export function ensureDirectory(targetPath: string, isFilePath: boolean = false) {
  targetPath = isFilePath ? path.dirname(targetPath) : targetPath;
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
}

/**
 * Read files asynchronously
 *
 * @param filePath - Target file path
 */
export function readFile(filePath: string, encoding: BufferEncoding = 'utf-8') {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch {
    return null;
  }
}

/**
 * Write to file only if content changed
 *
 * @param filePath - Target file path
 * @param content - File content
 * @param override - Override existing file
 */
export function writeFile(filePath: string, content: string) {
  try {
    const current = readFile(filePath);
    if (current !== content) {
      ensureDirectory(filePath, true);
      fs.writeFileSync(filePath, content, 'utf-8');
      return true;
    }
  } catch {}
  return false;
}

/** Returns relative path of given file path */
export function relativePath(filePath: string, cwd = process.cwd()) {
  return path.relative(cwd, filePath).replace(/\\/g, '/');
}
