#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { generations, recipes } from '../shared/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import { generateTagDisplayData, processRecipePrompt, validateRecipeFormData } from '../server/recipe-processor';

interface MetadataAnalysis {
  hasFormData: boolean;
  hasTagDisplayData: boolean;
  hasExtractedVariables: boolean;
  hasWorkflowType: boolean;
  hasVideoGeneration: boolean;
  request_origin: string | null;
  missingFields: string[];
  hasCorruptedData: boolean;
}

async function analyzeMetadata(metadata: any): Promise<MetadataAnalysis> {
  const analysis: MetadataAnalysis = {
    hasFormData: !!(metadata?.formData && Object.keys(metadata.formData).length > 0),
    hasTagDisplayData: !!(metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0),
    hasExtractedVariables: !!(metadata?.extractedVariables && Object.keys(metadata.extractedVariables).length > 0),
    hasWorkflowType: !!metadata?.workflowType,
    hasVideoGeneration: !!metadata?.videoGeneration,
    request_origin: metadata?.request_origin || null,
    missingFields: [],
    hasCorruptedData: false
  };

  // Check for missing fields
  if (!analysis.hasFormData) analysis.missingFields.push('formData');
  if (!analysis.hasTagDisplayData) analysis.missingFields.push('tagDisplayData');
  if (!analysis.hasExtractedVariables) analysis.missingFields.push('extractedVariables');
  if (!analysis.hasWorkflowType) analysis.missingFields.push('workflowType');
  if (!analysis.hasVideoGeneration) analysis.missingFields.push('videoGeneration');
  if (!analysis.request_origin) analysis.missingFields.push('request_origin');

  // Check for corrupted data (double-quoted values)
  if (analysis.hasFormData) {
    const hasCorruptedFormData = Object.values(metadata.formData).some((value: any) => 
      typeof value === 'string' && value.startsWith('"') && value.endsWith('"') && value.length > 2
    );
    if (hasCorruptedFormData) {
      analysis.hasCorruptedData = true;
      analysis.missingFields.push('corruptedFormData');
    }
  }

  if (analysis.hasTagDisplayData) {
    const hasCorruptedTagData = Object.values(metadata.tagDisplayData).some((tagData: any) => 
      tagData?.value && typeof tagData.value === 'string' && 
      tagData.value.startsWith('"') && tagData.value.endsWith('"') && tagData.value.length > 2
    );
    if (hasCorruptedTagData) {
      analysis.hasCorruptedData = true;
      analysis.missingFields.push('corruptedTagDisplayData');
    }
  }

  return analysis;
}

function cleanFormData(formData: any): any {
  const cleaned: any = {};
  
  Object.entries(formData).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Remove extra quotes if present
      let cleanedValue = value;
      if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"') && cleanedValue.length > 2) {
        cleanedValue = cleanedValue.slice(1, -1);
      }
      cleaned[key] = cleanedValue;
    } else {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
}

async function fixCorruptedTagDisplayData() {
  console.log('🔧 Fixing corrupted tagDisplayData...\n');

  try {
    // Get all generations with formData
    const generationsWithFormData = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        status: generations.status,
        recipeTitle: generations.recipeTitle,
        recipeId: generations.recipeId,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .where(isNotNull(generations.metadata))
      .orderBy(generations.createdAt);

    console.log(`📊 Found ${generationsWithFormData.length} generations with metadata`);

    // Get all recipes for reference
    const allRecipes = await db
      .select({
        id: recipes.id,
        name: recipes.name,
        slug: recipes.slug,
        prompt: recipes.prompt,
        workflowType: recipes.workflowType,
        workflowComponents: recipes.workflowComponents,
        recipeSteps: recipes.recipeSteps
      })
      .from(recipes);

    const recipeMap = new Map(allRecipes.map(r => [r.id, r]));

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const generation of generationsWithFormData) {
      console.log(`\n🎬 Processing generation ${generation.id} (${generation.shortId}):`);
      console.log(`   Recipe: ${generation.recipeTitle}`);
      console.log(`   Status: ${generation.status}`);

      // Analyze current metadata
      const currentMetadata = generation.metadata as any || {};
      const analysis = await analyzeMetadata(currentMetadata);

      console.log(`   📋 Current metadata analysis:`);
      console.log(`      formData: ${analysis.hasFormData ? '✅' : '❌'}`);
      console.log(`      tagDisplayData: ${analysis.hasTagDisplayData ? '✅' : '❌'}`);
      console.log(`      corruptedData: ${analysis.hasCorruptedData ? '❌' : '✅'}`);

      // Skip if no corrupted data and no missing fields
      if (!analysis.hasCorruptedData && analysis.missingFields.length === 0) {
        console.log(`   ✅ No issues found, skipping`);
        skippedCount++;
        continue;
      }

      if (analysis.hasCorruptedData) {
        console.log(`   🔄 Found corrupted data, will fix`);
      }

      if (analysis.missingFields.length > 0) {
        console.log(`   🔄 Missing fields: ${analysis.missingFields.join(', ')}`);
      }

      // Get the recipe for this generation
      const recipe = generation.recipeId ? recipeMap.get(generation.recipeId) : null;
      if (!recipe) {
        console.log(`   ❌ Recipe ${generation.recipeId} not found, skipping`);
        errorCount++;
        continue;
      }

      // Fix the metadata
      let updatedMetadata = { ...currentMetadata };
      let hasUpdates = false;

      // 1. Clean formData if corrupted
      if (analysis.hasCorruptedData && updatedMetadata.formData) {
        const originalFormData = updatedMetadata.formData;
        updatedMetadata.formData = cleanFormData(originalFormData);
        hasUpdates = true;
        console.log(`   ✅ Cleaned corrupted formData`);
      }

      // 2. Regenerate tagDisplayData with clean formData
      if (updatedMetadata.formData) {
        try {
          const tagDisplayData = await generateTagDisplayData(recipe, updatedMetadata.formData);
          updatedMetadata.tagDisplayData = tagDisplayData;
          hasUpdates = true;
          console.log(`   ✅ Regenerated tagDisplayData with ${Object.keys(tagDisplayData).length} tags`);
        } catch (error) {
          console.log(`   ❌ Failed to generate tagDisplayData:`, error);
        }
      }

      // 3. Regenerate extractedVariables with clean formData
      if (updatedMetadata.formData) {
        try {
          if (!recipe.prompt) {
            console.log(`   ⚠️  Recipe has no prompt, using formData as extractedVariables`);
            updatedMetadata.extractedVariables = updatedMetadata.formData;
          } else {
            const processedResult = processRecipePrompt(recipe, updatedMetadata.formData);
            updatedMetadata.extractedVariables = processedResult.extractedVariables;
            console.log(`   ✅ Regenerated extractedVariables with ${Object.keys(processedResult.extractedVariables).length} variables`);
          }
          hasUpdates = true;
        } catch (error) {
          console.log(`   ⚠️  Failed to generate extractedVariables, using formData as fallback:`, error);
          updatedMetadata.extractedVariables = updatedMetadata.formData;
          hasUpdates = true;
        }
      }

      // 4. Add missing metadata fields
      if (!analysis.hasWorkflowType && recipe.workflowType) {
        updatedMetadata.workflowType = recipe.workflowType;
        hasUpdates = true;
        console.log(`   ✅ Added workflowType: ${recipe.workflowType}`);
      }

      if (!analysis.hasVideoGeneration && recipe.workflowType === 'text_to_video') {
        updatedMetadata.videoGeneration = 'minimax-hailuo-02-pro';
        hasUpdates = true;
        console.log(`   ✅ Added videoGeneration: minimax-hailuo-02-pro`);
      }

      if (!analysis.request_origin) {
        updatedMetadata.request_origin = 'backlog';
        hasUpdates = true;
        console.log(`   ✅ Added request_origin flag`);
      }

      // Update the generation if we have changes
      if (hasUpdates) {
        await db
          .update(generations)
          .set({
            metadata: updatedMetadata,
            updatedAt: new Date().toISOString()
          })
          .where(eq(generations.id, generation.id));

        updatedCount++;
        console.log(`   ✅ Updated generation metadata`);
      } else {
        console.log(`   ⚠️  No updates made`);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} generations`);
    console.log(`   ⚠️  Skipped: ${skippedCount} generations (no issues)`);
    console.log(`   ❌ Errors: ${errorCount} generations (could not be updated)`);
    console.log(`   📋 Total: ${generationsWithFormData.length} generations`);

  } catch (error) {
    console.error('❌ Error during tagDisplayData fix:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

fixCorruptedTagDisplayData().catch(console.error); 