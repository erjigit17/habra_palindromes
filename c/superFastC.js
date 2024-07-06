import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const superFastC = require(join(__dirname, '../build/Release/superFast.node'));

export const isPalindromeSuperFastС = superFastC.isPalindromeSuperFast;
