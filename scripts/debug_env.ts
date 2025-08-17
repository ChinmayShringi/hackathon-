import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("🔍 Environment Variables Debug:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PGDATABASE:", process.env.PGDATABASE);
console.log("PGHOST:", process.env.PGHOST);
console.log("PGUSER:", process.env.PGUSER);
console.log("PGPASSWORD:", process.env.PGPASSWORD ? "***HIDDEN***" : "undefined"); 