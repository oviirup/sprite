import path from 'path';
import { IconData, ResolvedConfig } from '@/types';
import { parse } from 'node-html-parser';
import { composeFileName, writeFile } from './files';
import { logger } from './helpers';

function getSymbols(content: string) {
  const svgRoot = parse(content);
  const svg = svgRoot.getElementsByTagName('svg')[0];

  const symbols: { name: string; content: string }[] = [];

  svg?.querySelectorAll('>symbol').forEach((el) => {
    const name = el.getAttribute('id');
    el.removeAttribute('id');
    el.tagName = 'svg';
    el.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const content = el.toString();
    if (name) symbols.push({ name, content });
  });

  return symbols;
}

type ExtractSpriteProps = {
  svgSprite: string;
  outputPath: string;
  config: ResolvedConfig;
  timer?: number;
};
export async function extractSprite({
  svgSprite,
  outputPath,
  config,
  timer,
}: ExtractSpriteProps) {
  const { iconPrefix } = config;
  const symbols = getSymbols(svgSprite);

  const prefixed = symbols.every((e) => e.name.startsWith(iconPrefix));
  const prefixRegex = new RegExp(`^${iconPrefix}`);
  // construct array of svg icon data
  const svgIcons: IconData[] = symbols.map(({ name, content }) => {
    name = prefixed ? name.replace(prefixRegex, '') : name;
    const fileName = composeFileName(name, { ext: '.svg' });
    const filePath = path.join(outputPath, fileName);
    return { name, content, filePath };
  });
  // write all svg icon into outputPath

  await Promise.all(
    svgIcons.map(async ({ filePath, content }) => {
      await writeFile(filePath, content);
    }),
  );

  logger('Extraction finished', timer);
}
