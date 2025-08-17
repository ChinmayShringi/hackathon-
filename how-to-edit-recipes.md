# How to Edit Recipes: Advanced Variable Architecture Guide

## Overview

This guide explains how to modify recipes in the Delula system, with a focus on the new compound variable architecture that supports sophisticated prompt generation for AI video models like Veo 3 Fast.

## Table of Contents

1. [Recipe Structure](#recipe-structure)
2. [Field Types](#field-types)
3. [Variable Architecture](#variable-architecture)
4. [Compound Variable Mappings](#compound-variable-mappings)
5. [JSON Prompt Templates](#json-prompt-templates)
6. [Step-by-Step Recipe Editing](#step-by-step-recipe-editing)
7. [Testing Your Changes](#testing-your-changes)

## Recipe Structure

Each recipe in the database has the following key components:

```typescript
interface Recipe {
  id: number;
  name: string;
  slug: string;
  description: string;
  prompt: string;           // The template with variables
  instructions: string;
  category: string;
  recipeSteps: RecipeStep[]; // Form field definitions
  generationType: "image" | "video";
  // ... other fields
}
```

### Recipe Steps Structure

```typescript
interface RecipeStep {
  id: string;                    // Unique identifier for the field
  type: 'radio' | 'dropdown' | 'slider' | 'emoji_button' | 'text' | 'text_prompt';
  label: string;                 // Display label
  required?: boolean;
  defaultValue?: string;
  options?: Array<{
    label: string;
    value: string;
    emoji?: string;              // For emoji_button type
    subtitle?: string;           // For emoji_button type
  }>;
  config?: {
    min?: number;                // For slider type
    max?: number;                // For slider type
    step?: number;               // For slider type
    showValue?: boolean;         // For slider type
  };
}
```

## Field Types

### 1. Radio Buttons
```json
{
  "id": "gender",
  "type": "radio",
  "label": "Gender",
  "options": [
    { "label": "Male", "value": "male" },
    { "label": "Female", "value": "female" }
  ],
  "required": true,
  "defaultValue": "female"
}
```

### 2. Dropdown Select
```json
{
  "id": "lavaFoodItem",
  "type": "dropdown",
  "label": "Lava Food Item",
  "options": [
    { "label": "Lava Pizza", "value": "lava pizza" },
    { "label": "Lava Chocolate Cake", "value": "lava chocolate cake" }
  ],
  "required": true,
  "defaultValue": "lava pizza"
}
```

### 3. Slider
```json
{
  "id": "age",
  "type": "slider",
  "label": "Age",
  "config": {
    "min": 18,
    "max": 100,
    "step": 1,
    "showValue": true
  },
  "required": true,
  "defaultValue": "30"
}
```

### 4. Emoji Buttons
```json
{
  "id": "eatingExpression",
  "type": "emoji_button",
  "label": "Eating Expression",
  "options": [
    {
      "label": "Joyful",
      "value": "joyful",
      "emoji": "😀",
      "subtitle": "Joyful"
    },
    {
      "label": "Bored",
      "value": "bored",
      "emoji": "🤭",
      "subtitle": "Bored"
    }
  ],
  "required": true,
  "defaultValue": "joyful"
}
```

## Variable Architecture

### Simple Variables
Basic variable substitution uses double curly braces:

```json
{
  "subject": {
    "description": "{{age}} year old {{gender}}"
  }
}
```

### Compound Variables
Complex variables that combine multiple form fields:

```json
{
  "visual_details": {
    "action": "{{action_description}}",
    "props": "{{props_description}}"
  }
}
```

## Compound Variable Mappings

The power of the system comes from compound variable mappings in `server/recipe-processor.ts`. These create sophisticated descriptions based on multiple form field combinations.

### Example: Action Descriptions
```typescript
// Map food items to action descriptions
const actionMap: Record<string, string> = {
  'lava pizza': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression]} expression on their face`,
  'lava chocolate cake': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression]} expression on their face`,
  // ... more mappings
};
```

### Example: Props Descriptions
```typescript
// Map food items to props descriptions
const propsMap: Record<string, string> = {
  'lava pizza': 'using their bare hands to eat the lava pizza',
  'lava spoonful of honey': 'using a spoon to scoop up the lava honey from a bowl',
  'lava chocolate cake': 'using only one fork in one hand to lift and take a bite out of the lava chocolate cake made of real lava',
  'lava plate of food': 'using a fork and knife in each hand to cut into a five course fine dining meal'
};
```

### Example: Venue-Specific Mappings
```typescript
// Map venues to ambient sounds
const ambientSoundsMap: Record<string, string> = {
  'home kitchen': 'gentle sounds of a home kitchen with nothing much going on',
  'japanese hibachi': 'restaurant sounds, excited yells and oohs and aahs, whooshes of grill flames',
  'sports grill': 'background sports on tv, fans cheering for their teams on occasion',
  'science lab table': 'chemistry sounds of beakers and solutions',
  'office cubicle': 'office noise, phones ringing, typing on computers',
  'tv tray dinner on couch': 'background television with a random daytime tv show barely audible'
};
```

## JSON Prompt Templates

For advanced AI models like Veo 3 Fast, structured JSON prompts work better than plain text. The system supports JSON templates with variable substitution:

```json
{
  "shot": {
    "composition": "close shot, handheld camera",
    "aspect_ratio": "9:16",
    "camera_motion": "slight natural shake",
    "frame_rate": "30fps",
    "film_grain": "none"
  },
  "subject": {
    "description": "{{age}} year old {{gender}}",
    "wardrobe": "a random outfit appropriate for the setting"
  },
  "scene": {
    "location": "{{venue}}",
    "time_of_day": "daytime but indoors",
    "environment": "the environment should seem surreally hot, invoking the idea that the subject is eating food made of lava"
  },
  "visual_details": {
    "action": "{{action_description}}",
    "props": "{{props_description}}"
  },
  "cinematography": {
    "lighting": "indoors warm lighting with vibrant, flickering shadows",
    "tone": "lighthearted and surreal"
  },
  "audio": {
    "ambient": "{{ambient_sounds}}",
    "asmr": "{{asmr_sound_style}}"
  },
  "special_effects": "the food is actually made of lava/magma that drips, burns, and oozes across surfaces",
  "color_palette": "the lava should be bright yellow and orange, glowing with heat and bright light, reflected on skin"
}
```

## Step-by-Step Recipe Editing

### 1. Plan Your Recipe Structure
- Identify the variables you need
- Determine which field types to use
- Plan compound variable mappings
- Design your prompt template

### 2. Create/Update Recipe Steps
Use a database update script:

```typescript
// scripts/update-recipe.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import { recipes } from '../migrations/schema';
import { eq } from 'drizzle-orm';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function updateRecipe() {
  const newRecipeSteps = [
    // Your recipe steps here
  ];

  const newPrompt = `{
    // Your JSON prompt template here
  }`;

  try {
    const result = await db
      .update(recipes)
      .set({
        recipeSteps: newRecipeSteps,
        prompt: newPrompt,
        instructions: "Your recipe instructions"
      })
      .where(eq(recipes.slug, 'your-recipe-slug'))
      .returning();

    console.log('✅ Recipe updated successfully!');
  } catch (error) {
    console.error('❌ Error updating recipe:', error);
  } finally {
    await pool.end();
  }
}

updateRecipe().catch(console.error);
```

### 3. Update Backend Processing
Add your recipe's processing logic to `server/recipe-processor.ts`:

```typescript
// Special handling for your recipe
if (recipe.slug === 'your-recipe-slug') {
  // Define your mapping functions
  const expressionMap: Record<string, string> = {
    'joyful': 'joyful and delighted',
    'bored': 'completely bored and indifferent',
    // ... more mappings
  };

  const actionMap: Record<string, string> = {
    'item1': `action description with ${expressionMap[formData.expression]}`,
    // ... more mappings
  };

  // Apply variable substitutions
  prompt = prompt
    .replace('{{age}}', formData.age || '30')
    .replace('{{gender}}', formData.gender || 'female')
    .replace('{{action_description}}', actionMap[formData.item] || 'default action')
    // ... more replacements
}
```

### 4. Update Validation
Add validation logic for your recipe:

```typescript
if (recipe.slug === 'your-recipe-slug') {
  if (!formData.gender) {
    errors.push('Gender selection is required');
  }
  if (!formData.age) {
    errors.push('Age selection is required');
  }
  // ... more validation
}
```

## Testing Your Changes

### 1. Create a Test Script
```typescript
// scripts/test-recipe-processing.ts
import { processRecipePrompt } from '../server/recipe-processor';
import type { Recipe } from '../shared/schema';

const mockRecipe: Recipe = {
  // Your recipe data
};

const testCases = [
  {
    name: "Test Case 1",
    formData: {
      gender: "female",
      age: "30",
      // ... other fields
    }
  }
  // ... more test cases
];

function testPromptProcessing() {
  testCases.forEach((testCase) => {
    console.log(`\n--- ${testCase.name} ---`);
    console.log('Form Data:', JSON.stringify(testCase.formData, null, 2));
    
    const result = processRecipePrompt(mockRecipe, testCase.formData);
    
    console.log('\nProcessed Prompt:');
    console.log(result.prompt);
    
    // Validate that all placeholders were replaced
    const remainingPlaceholders = result.prompt.match(/\{\{[^}]+\}\}/g);
    if (remainingPlaceholders) {
      console.log('\n⚠️  WARNING: Unreplaced placeholders found:', remainingPlaceholders);
    } else {
      console.log('\n✅ All placeholders successfully replaced');
    }
  });
}

testPromptProcessing();
```

### 2. Run Your Tests
```bash
npx tsx scripts/test-recipe-processing.ts
```

### 3. Verify Database State
```bash
npx tsx scripts/check-db-schema.ts
```

## Best Practices

### 1. Variable Naming
- Use descriptive variable names: `{{age}}` not `{{a}}`
- Use snake_case for compound variables: `{{action_description}}`
- Keep variable names consistent across your recipe

### 2. Mapping Functions
- Create separate mapping objects for different types of substitutions
- Use descriptive keys that match your form field values
- Always provide fallback values for missing data

### 3. JSON Structure
- Keep JSON well-formatted and readable
- Use consistent indentation
- Group related fields together (shot, subject, scene, etc.)

### 4. Testing
- Test with various combinations of form data
- Verify all placeholders are replaced
- Test edge cases and missing data scenarios

### 5. Documentation
- Document your compound variable mappings
- Explain the logic behind complex substitutions
- Keep examples of expected outputs

## Example: Complete Recipe Implementation

Here's a complete example of how the Lava Food ASMR recipe was implemented:

### Recipe Steps
```json
[
  {
    "id": "gender",
    "type": "radio",
    "label": "Gender",
    "options": [
      { "label": "Male", "value": "male" },
      { "label": "Female", "value": "female" }
    ],
    "required": true,
    "defaultValue": "female"
  },
  {
    "id": "age",
    "type": "slider",
    "label": "Age",
    "config": {
      "min": 18,
      "max": 100,
      "step": 1,
      "showValue": true
    },
    "required": true,
    "defaultValue": "30"
  }
  // ... more steps
]
```

### Prompt Template
```json
{
  "subject": {
    "description": "{{age}} year old {{gender}}"
  },
  "visual_details": {
    "action": "{{action_description}}",
    "props": "{{props_description}}"
  },
  "audio": {
    "ambient": "{{ambient_sounds}}",
    "asmr": "{{asmr_sound_style}}"
  }
}
```

### Processing Logic
```typescript
if (recipe.slug === 'lava-food-asmr') {
  const expressionMap: Record<string, string> = {
    'joyful': 'joyful and delighted',
    'bored': 'completely bored and indifferent'
  };

  const actionMap: Record<string, string> = {
    'lava pizza': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression]} expression on their face`
  };

  const ambientSoundsMap: Record<string, string> = {
    'home kitchen': 'gentle sounds of a home kitchen with nothing much going on',
    'sports grill': 'background sports on tv, fans cheering for their teams on occasion'
  };

  prompt = prompt
    .replace('{{age}}', formData.age || '30')
    .replace('{{gender}}', formData.gender || 'female')
    .replace('{{action_description}}', actionMap[formData.lavaFoodItem])
    .replace('{{ambient_sounds}}', ambientSoundsMap[formData.venue]);
}
```

This architecture allows for incredibly sophisticated prompt generation while maintaining a clean, maintainable codebase that can easily be extended for new recipes. 