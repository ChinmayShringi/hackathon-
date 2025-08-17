#!/usr/bin/env tsx

import bcrypt from 'bcrypt';

async function generatePasswordHash() {
  const password = 'delula4lyfe';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('');
    console.log('Copy this hash to server/admin-auth.ts:');
    console.log(`const ADMIN_PASSWORD_HASH = '${hash}';`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash(); 