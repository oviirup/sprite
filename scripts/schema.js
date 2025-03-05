import fs from 'fs';
import path from 'path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { zSpriteRecord } from '../src/lib/schema';

const result = zodToJsonSchema(zSpriteRecord);

const schemaFilePath = path.resolve(process.cwd(), 'schema.json');
fs.writeFileSync(schemaFilePath, JSON.stringify(result));
