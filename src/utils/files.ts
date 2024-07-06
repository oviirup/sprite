import fs from 'node:fs';
import path from 'node:path';

/**
 * Ensure the directory exists
 *
 * @param targetPath Path to directory
 * @param isFilePath Specify if the given target path is a file
 */
export function ensureDirectory(
  targetPath: string,
  isFilePath: boolean = false,
) {
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
export async function readFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  return await fs.promises.readFile(filePath, 'utf-8').catch(() => '');
}

/**
 * Write to file only if content changed
 *
 * @param filePath - Target file path
 * @param content - File content
 * @param override - Override existing file
 */
export async function writeFile(
  filePath: string,
  content: string,
  override = false,
) {
  if (!override) {
    const current = await readFile(filePath);
    if (current === content) return false;
  }
  ensureDirectory(filePath, true);
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

/** Returns relative path of given file path */
export function relativePath(filePath: string, cwd = process.cwd()) {
  return path.relative(cwd, filePath).replace(/\\/g, '/');
}

type FileNameOverride = { prefix: string; suffix: string; ext: string };
/** Compose a new filename with suffix, prefix, and extension */
export function composeFileName(
  filePath: string,
  { prefix = '', suffix = '', ext }: Partial<FileNameOverride>,
) {
  const { dir, name, ext: fileExt } = path.parse(filePath);
  let fileName = prefix + name + suffix + (ext ? ext : fileExt);
  return path.join(dir, fileName);
}
