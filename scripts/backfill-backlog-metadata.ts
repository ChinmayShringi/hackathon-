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
}

async function analyzeMetadata(metadata: any): Promise<MetadataAnalysis> {
  const analysis: MetadataAnalysis = {
    hasFormData: !!(metadata?.formData && Object.keys(metadata.formData).length > 0),
    hasTagDisplayData: !!(metadata?.tagDisplayData && Object.keys(metadata.tagDisplayData).length > 0),
    hasExtractedVariables: !!(metadata?.extractedVariables && Object.keys(metadata.extractedVariables).length > 0),
    hasWorkflowType: !!metadata?.workflowType,
    hasVideoGeneration: !!metadata?.videoGeneration,
    request_origin: metadata?.request_origin || null,
    missingFields: []
  };

  if (!analysis.hasFormData) analysis.missingFields.push('formData');
  if (!analysis.hasTagDisplayData) analysis.missingFields.push('tagDisplayData');
  if (!analysis.hasExtractedVariables) analysis.missingFields.push('extractedVariables');
  if (!analysis.hasWorkflowType) analysis.missingFields.push('workflowType');
  if (!analysis.hasVideoGeneration && metadata?.workflowType === 'text_to_video') analysis.missingFields.push('videoGeneration');
  if (!analysis.request_origin) analysis.missingFields.push('request_origin');

  return analysis;
}

async function backfillBacklogMetadata() {
  console.log('🔧 Backfilling missing metadata for ALL generations with formData...\n');

  try {
    // Get all generations with non-empty formData in metadata
    const allGenerations = await db
      .select({
        id: generations.id,
        shortId: generations.shortId,
        recipeId: generations.recipeId,
        recipeTitle: generations.recipeTitle,
        status: generations.status,
        metadata: generations.metadata,
        createdAt: generations.createdAt
      })
      .from(generations)
      .orderBy(generations.createdAt);

    // Filter to only those with non-empty formData
    const generationsWithFormData = allGenerations.filter(gen => {
      const metadata = gen.metadata as any;
      return metadata?.formData && Object.keys(metadata.formData).length > 0;
    });

    console.log(`📊 Found ${generationsWithFormData.length} generations with formData`);

    if (generationsWithFormData.length === 0) {
      console.log('✅ No generations with formData found');
      return;
    }

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
      console.log(`      extractedVariables: ${analysis.hasExtractedVariables ? '✅' : '❌'}`);
      console.log(`      workflowType: ${analysis.hasWorkflowType ? '✅' : '❌'}`);
      console.log(`      videoGeneration: ${analysis.hasVideoGeneration ? '✅' : '❌'}`);
      console.log(`      request_origin: ${analysis.request_origin ? '✅' : '❌'}`);

      // Skip if no missing fields
      if (analysis.missingFields.length === 0) {
        console.log(`   ✅ No missing fields, skipping`);
        skippedCount++;
        continue;
      }

      console.log(`   🔄 Missing fields: ${analysis.missingFields.join(', ')}`);

      // Get the recipe for this generation
      const recipe = generation.recipeId ? recipeMap.get(generation.recipeId) : null;
      if (!recipe) {
        console.log(`   ❌ Recipe ${generation.recipeId} not found, skipping`);
        errorCount++;
        continue;
      }

      // Try to reconstruct missing metadata
      let updatedMetadata = { ...currentMetadata };
      let hasUpdates = false;

      // 1. Ensure request_origin is set (required for proper classification)
      if (!analysis.request_origin) {
        updatedMetadata.request_origin = 'backlog';
        hasUpdates = true;
        console.log(`   ✅ Added request_origin flag`);
      }

      // 2. Add workflowType if missing
      if (!analysis.hasWorkflowType && recipe.workflowType) {
        updatedMetadata.workflowType = recipe.workflowType;
        hasUpdates = true;
        console.log(`   ✅ Added workflowType: ${recipe.workflowType}`);
      }

      // 3. Add videoGeneration for text_to_video workflows
      if (!analysis.hasVideoGeneration && recipe.workflowType === 'text_to_video') {
        updatedMetadata.videoGeneration = 'minimax-hailuo-02-pro';
        hasUpdates = true;
        console.log(`   ✅ Added videoGeneration: minimax-hailuo-02-pro`);
      }

      // 4. Reconstruct formData if missing (shouldn't happen, but keep for robustness)
      if (!analysis.hasFormData) {
        // Try to reconstruct from other metadata fields
        let reconstructedFormData = {};
        
        if (currentMetadata.extractedVariables) {
          reconstructedFormData = { ...currentMetadata.extractedVariables };
          console.log(`   📝 Reconstructed formData from extractedVariables`);
        } else if (currentMetadata.originalParameters) {
          reconstructedFormData = { ...currentMetadata.originalParameters };
          console.log(`   📝 Reconstructed formData from originalParameters`);
        } else if (currentMetadata.variables) {
          reconstructedFormData = { ...currentMetadata.variables };
          console.log(`   📝 Reconstructed formData from variables`);
        } else {
          console.log(`   ⚠️  Cannot reconstruct formData - no source data available`);
          errorCount++;
          continue;
        }

        updatedMetadata.formData = reconstructedFormData;
        hasUpdates = true;
      }

      // 5. Generate tagDisplayData if missing and we have formData
      if (!analysis.hasTagDisplayData && updatedMetadata.formData) {
        try {
          const tagDisplayData = await generateTagDisplayData(recipe, updatedMetadata.formData);
          updatedMetadata.tagDisplayData = tagDisplayData;
          hasUpdates = true;
          console.log(`   ✅ Generated tagDisplayData with ${Object.keys(tagDisplayData).length} tags`);
        } catch (error) {
          console.log(`   ❌ Failed to generate tagDisplayData:`, error);
        }
      }

      // 6. Generate extractedVariables if missing and we have formData
      if (!analysis.hasExtractedVariables && updatedMetadata.formData) {
        try {
          // Check if recipe has a prompt before processing
          if (!recipe.prompt) {
            console.log(`   ⚠️  Recipe has no prompt, using formData as extractedVariables`);
            updatedMetadata.extractedVariables = updatedMetadata.formData;
          } else {
            const processedResult = processRecipePrompt(recipe, updatedMetadata.formData);
            updatedMetadata.extractedVariables = processedResult.extractedVariables;
            console.log(`   ✅ Generated extractedVariables with ${Object.keys(processedResult.extractedVariables).length} variables`);
          }
          hasUpdates = true;
        } catch (error) {
          console.log(`   ⚠️  Failed to generate extractedVariables, using formData as fallback:`, error);
          updatedMetadata.extractedVariables = updatedMetadata.formData;
          hasUpdates = true;
        }
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
    console.log(`   ⚠️  Skipped: ${skippedCount} generations (no missing fields)`);
    console.log(`   ❌ Errors: ${errorCount} generations (could not be updated)`);
    console.log(`   📋 Total: ${generationsWithFormData.length} generations`);

    // Final verification
    console.log(`\n🔍 Final verification:`);
    const finalAnalysis = generationsWithFormData;

    let completeMetadataCount = 0;
    let incompleteMetadataCount = 0;

    for (const gen of finalAnalysis) {
      const analysis = await analyzeMetadata(gen.metadata);
      if (analysis.missingFields.length === 0) {
        completeMetadataCount++;
      } else {
        incompleteMetadataCount++;
      }
    }

    console.log(`   ✅ Complete metadata: ${completeMetadataCount} generations`);
    console.log(`   ❌ Incomplete metadata: ${incompleteMetadataCount} generations`);

    if (incompleteMetadataCount === 0) {
      console.log(`\n🎉 All generations with formData now have complete metadata!`);
    } else {
      console.log(`\n⚠️  ${incompleteMetadataCount} generations still have incomplete metadata`);
    }

  } catch (error) {
    console.error('❌ Error during backlog metadata backfill:', error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

backfillBacklogMetadata().catch(console.error); 