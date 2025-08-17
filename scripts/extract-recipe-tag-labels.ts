#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { recipes } from '../shared/schema';
import { inArray } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function extractRecipeTagLabels() {
  // Slugs for the three main recipe options
  const slugs = [
    'cat-olympic-diving',
    'lava-food-asmr',
    'disinterested-apes-vlog', // BASEd Ape Vlog (old slug)
    'based-ape-vlog' // BASEd Ape Vlog (new slug, if exists)
  ];

  const foundLabels = new Set<string>();

  // 1. Extract from DB
  const recipeRows = await db
    .select({ slug: recipes.slug, recipeSteps: recipes.recipeSteps })
    .from(recipes)
    .where(inArray(recipes.slug, slugs));

  for (const recipe of recipeRows) {
    if (Array.isArray(recipe.recipeSteps)) {
      for (const step of recipe.recipeSteps) {
        if (step.label) foundLabels.add(step.label);
      }
    }
  }

  // 2. Extract from hardcoded files (server/recipe-processor.ts)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const processorPath = path.resolve(__dirname, '../server/recipe-processor.ts');
  if (fs.existsSync(processorPath)) {
    const fileContent = fs.readFileSync(processorPath, 'utf8');
    const labelRegex = /label:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = labelRegex.exec(fileContent)) !== null) {
      foundLabels.add(match[1]);
    }
  }

  // Output
  console.log('All unique variable labels (for icon mapping):');
  Array.from(foundLabels).sort().forEach(label => console.log(' -', label));
}

extractRecipeTagLabels().catch(console.error); 