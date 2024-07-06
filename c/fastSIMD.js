import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const fastSIMD_C = require(join(__dirname, '../build/Release/fastSIMD.node'));

export const isPalindromeFastSIMD = fastSIMD_C.isPalindromeFastSIMD;
