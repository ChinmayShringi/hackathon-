#!/usr/bin/env tsx

import { Command } from 'commander';

const program = new Command();

// Configuration
const API_BASE = process.env.API_BASE || 'http://localhost:5232';

interface RecipeUpdate {
  name?: string;
  slug?: string;
  description?: string;
  prompt?: string;
  instructions?: string;
  category?: string;
  style?: string;
  model?: string;
  creditCost?: number;
  isActive?: boolean;
}

// Helper function to make API calls
async function apiCall(endpoint: string, options: any = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ API Error: ${error.message}`);
    process.exit(1);
  }
}

// List all recipes
async function listRecipes() {
  console.log('📋 Fetching recipes...\n');
  const recipes = await apiCall('/api/recipes');
  
  if (recipes.length === 0) {
    console.log('No recipes found.');
    return;
  }

  recipes.forEach((recipe: any) => {
    console.log(`ID: ${recipe.id}`);
    console.log(`Name: ${recipe.name}`);
    console.log(`Slug: ${recipe.slug}`);
    console.log(`Description: ${recipe.description}`);
    console.log(`Category: ${recipe.category}`);
    console.log(`Active: ${recipe.isActive ? '✅' : '❌'}`);
    console.log(`Usage Count: ${recipe.usageCount}`);
    console.log('---');
  });
}

// Get a specific recipe
async function getRecipe(identifier: string) {
  console.log(`🔍 Fetching recipe: ${identifier}\n`);
  
  // Try as ID first, then as slug
  let recipe;
  if (!isNaN(Number(identifier))) {
    recipe = await apiCall(`/api/recipes/${identifier}`);
  } else {
    recipe = await apiCall(`/api/recipes/slug/${identifier}`);
  }
  
  console.log('Recipe Details:');
  console.log(JSON.stringify(recipe, null, 2));
}

// Update a recipe
async function updateRecipe(identifier: string, updates: RecipeUpdate) {
  console.log(`🔄 Updating recipe: ${identifier}\n`);
  
  let endpoint;
  if (!isNaN(Number(identifier))) {
    endpoint = `/api/recipes/${identifier}`;
  } else {
    endpoint = `/api/recipes/slug/${identifier}`;
  }
  
  const result = await apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  
  console.log('✅ Recipe updated successfully!');
  console.log('Updated recipe:');
  console.log(JSON.stringify(result.recipe, null, 2));
}

// Create a new recipe
async function createRecipe(recipeData: any) {
  console.log('➕ Creating new recipe...\n');
  
  const result = await apiCall('/api/recipes', {
    method: 'POST',
    body: JSON.stringify(recipeData),
  });
  
  console.log('✅ Recipe created successfully!');
  console.log('New recipe:');
  console.log(JSON.stringify(result, null, 2));
}

// CLI Setup
program
  .name('recipe-cli')
  .description('CLI tool for managing recipes')
  .version('1.0.0');

program
  .command('list')
  .description('List all recipes')
  .action(listRecipes);

program
  .command('get <identifier>')
  .description('Get a specific recipe by ID or slug')
  .action(getRecipe);

program
  .command('update <identifier>')
  .description('Update a recipe by ID or slug')
  .option('-n, --name <name>', 'Recipe name')
  .option('-s, --slug <slug>', 'Recipe slug')
  .option('-d, --description <description>', 'Recipe description')
  .option('-p, --prompt <prompt>', 'Recipe prompt')
  .option('-i, --instructions <instructions>', 'Recipe instructions')
  .option('-c, --category <category>', 'Recipe category')
  .option('-y, --style <style>', 'Recipe style')
  .option('-m, --model <model>', 'AI model')
  .option('--credit-cost <cost>', 'Credit cost', parseInt)
  .option('--active <active>', 'Is active (true/false)', (val) => val === 'true')
  .action((identifier, options) => {
    const updates: RecipeUpdate = {};
    
    if (options.name) updates.name = options.name;
    if (options.slug) updates.slug = options.slug;
    if (options.description) updates.description = options.description;
    if (options.prompt) updates.prompt = options.prompt;
    if (options.instructions) updates.instructions = options.instructions;
    if (options.category) updates.category = options.category;
    if (options.style) updates.style = options.style;
    if (options.model) updates.model = options.model;
    if (options.creditCost) updates.creditCost = options.creditCost;
    if (options.active !== undefined) updates.isActive = options.active;
    
    if (Object.keys(updates).length === 0) {
      console.error('❌ No updates specified. Use --help to see available options.');
      process.exit(1);
    }
    
    updateRecipe(identifier, updates);
  });

program
  .command('create')
  .description('Create a new recipe')
  .requiredOption('-n, --name <name>', 'Recipe name')
  .requiredOption('-d, --description <description>', 'Recipe description')
  .requiredOption('-p, --prompt <prompt>', 'Recipe prompt')
  .requiredOption('-c, --category <category>', 'Recipe category')
  .option('-s, --style <style>', 'Recipe style', 'photorealistic')
  .option('-m, --model <model>', 'AI model', 'flux-1')
  .option('--credit-cost <cost>', 'Credit cost', parseInt, 4)
  .option('-i, --instructions <instructions>', 'Recipe instructions')
  .action((options) => {
    const recipeData = {
      name: options.name,
      description: options.description,
      prompt: options.prompt,
      category: options.category,
      style: options.style,
      model: options.model,
      creditCost: options.creditCost,
      instructions: options.instructions || `Generate ${options.name.toLowerCase()}`,
      type: 'image',
      isPublic: false,
      hasContentRestrictions: true,
      steps: [{
        id: '1',
        type: 'text_prompt',
        config: { prompt: options.prompt }
      }]
    };
    
    createRecipe(recipeData);
  });



program.parse(process.argv); 