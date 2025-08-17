// Load environment variables synchronously
import dotenv from 'dotenv';

// Suppress punycode deprecation warning (DEP0040)
(process as any).noDeprecation = true;

dotenv.config();

export {}; 