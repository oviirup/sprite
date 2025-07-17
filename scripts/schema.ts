import fs from 'fs';
import path from 'path';
import { toJSONSchema } from 'zod/v4';
import { zSpriteRecord } from '../src/lib/schema';

const result = toJSONSchema(zSpriteRecord);

const schemaFilePath = path.resolve(process.cwd(), 'schema.json');
fs.writeFileSync(schemaFilePath, JSON.stringify(result));
