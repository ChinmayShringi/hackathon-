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

async function updateLavaFoodRecipe() {
  console.log('🔄 Updating Lava Food ASMR recipe with new field structure...');

  const newRecipeSteps = [
    {
      id: "gender",
      type: "radio",
      label: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" }
      ],
      required: true,
      defaultValue: "female"
    },
    {
      id: "age",
      type: "slider",
      label: "Age",
      config: {
        min: 18,
        max: 100,
        step: 1,
        showValue: true
      },
      required: true,
      defaultValue: "30"
    },
    {
      id: "lavaFoodItem",
      type: "dropdown",
      label: "Lava Food Item",
      options: [
        { label: "Lava Pizza", value: "lava pizza" },
        { label: "Lava Spoonful of Honey", value: "lava spoonful of honey" },
        { label: "Lava Chocolate Cake", value: "lava chocolate cake" },
        { label: "Lava Plate of Food", value: "lava plate of food" }
      ],
      required: true,
      defaultValue: "lava pizza"
    },
    {
      id: "eatingExpression",
      type: "emoji_button",
      label: "Eating Expression",
      options: [
        { label: "Joyful", value: "joyful", emoji: "😀", subtitle: "Joyful" },
        { label: "Totally Cool", value: "totally_cool", emoji: "😎", subtitle: "Totally Cool" },
        { label: "Sophisticated Enjoyment", value: "sophisticated_enjoyment", emoji: "🧐", subtitle: "Sophisticated" },
        { label: "Absolutely Loving It", value: "absolutely_loving_it", emoji: "😍", subtitle: "Loving It" },
        { label: "Bored", value: "bored", emoji: "🤭", subtitle: "Bored" },
        { label: "Confused... but OK?", value: "confused_but_ok", emoji: "🥴", subtitle: "Confused" }
      ],
      required: true,
      defaultValue: "joyful"
    },
    {
      id: "venue",
      type: "dropdown",
      label: "Venue",
      options: [
        { label: "Home Kitchen", value: "home kitchen" },
        { label: "Japanese Hibachi", value: "japanese hibachi" },
        { label: "Sports Grill", value: "sports grill" },
        { label: "Science Lab Table", value: "science lab table" },
        { label: "Office Cubicle", value: "office cubicle" },
        { label: "TV Tray Dinner on Couch", value: "tv tray dinner on couch" }
      ],
      required: true,
      defaultValue: "home kitchen"
    },
    {
      id: "asmrSoundStyle",
      type: "dropdown",
      label: "ASMR Sound Style",
      options: [
        { label: "Crunchy", value: "crunchy" },
        { label: "Oozing", value: "oozing" },
        { label: "Dripping", value: "dripping" },
        { label: "Bubbling", value: "bubbling" }
      ],
      required: true,
      defaultValue: "crunchy"
    }
  ];

  const newPrompt = "Hyper-realistic, cinematic studio photograph of a {{gender}} {{age}}-year-old person sitting at a {{venue}}, taking slow bites from {{lavaFoodItem}} with a {{eatingExpression}} expression. The molten lava food gently bubbles with glowing magma colors; each mouthful produces sticky, gurgling textures with {{asmrSoundStyle}} sounds. The camera is static, focusing on mouth and hands with a shallow depth of field. Warm, soft rim-lighting and subtle ambient background noise enhance ASMR appeal. 8K, wide shot.";

  try {
    const result = await db
      .update(recipes)
      .set({
        recipeSteps: newRecipeSteps,
        prompt: newPrompt,
        instructions: "Create bizarre, funny scenes of people treating molten lava like an everyday snack with customizable characters, food items, expressions, venues, and ASMR sound styles."
      })
      .where(eq(recipes.slug, 'lava-food-asmr'))
      .returning();

    if (result.length > 0) {
      console.log('✅ Successfully updated Lava Food ASMR recipe!');
      console.log('📝 New recipe structure:');
      console.log(JSON.stringify(result[0], null, 2));
    } else {
      console.log('❌ Recipe not found or update failed');
    }
  } catch (error) {
    console.error('❌ Error updating recipe:', error);
  } finally {
    await pool.end();
  }
}

updateLavaFoodRecipe().catch(console.error); 