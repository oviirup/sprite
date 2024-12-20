export function getByteSize(content: string): number {
  if (!content) return 0;
  return Buffer.byteLength(content, 'utf-8');
}

export function kebabCase(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  } else if (/^(?:[-a-z\d]*)$/.test(str)) {
    return str;
  }

  return str
    .trim()
    .replace(/([A-Z]{2,})(\d+)/g, '$1-$2')
    .replace(/([a-z\d]+)([A-Z]{2,})/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-rt-z\d]+)/g, '$1 $2')
    .replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

export function pascalCase(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  } else if (/^(?:[A-Z][a-zA-Z\d]*)$/.test(str)) {
    return str;
  }

  return kebabCase(str.trim())
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
    .replace(/[\W_]+(.|$)/g, (_, chr) => chr.toUpperCase());
}
