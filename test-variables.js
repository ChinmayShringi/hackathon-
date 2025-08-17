// Test script to verify variable extraction
const { processRecipePrompt } = require('./server/recipe-processor');

// Test data
const testRecipes = [
    {
        slug: 'futuristic-ai-anatomy',
        prompt: 'A [GENDER] [AGE] character with [BODY_PART] highlighted. [DETAILS]'
    },
    {
        slug: 'cats-in-video-games',
        prompt: '[CAT_COUNT] playing in a [GAME_GENRE] world. [ACTION_DESCRIPTION]'
    },
    {
        slug: 'zoo-olympics',
        prompt: 'A [ANIMAL] competing in [OLYMPIC_SPORT] during [SPORT_ACTION]'
    },
    {
        slug: 'lava-food-asmr',
        prompt: 'A [PERSON_TYPE] eating [LAVA_OBJECT] with [EATING_STYLE] in [LOCATION]. [MOOD]'
    },
    {
        slug: 'based-ape-vlog',
        prompt: 'A gorilla vlogger with {{wardrobe_description}} in {{location_description}} doing {{action_description}}'
    }
];

const testFormData = [
    {
        gender: 'female',
        age: 'adult',
        bodyPart: 'heart',
        details: 'external'
    },
    {
        catCount: 'two',
        catColors: 'orange tabby',
        gameGenre: 'retro platformer',
        actionDescription: 'jumping across platforms'
    },
    {
        animal: 'elephant',
        olympicSport: 'swimming',
        sportAction: 'mid-stroke'
    },
    {
        personType: 'business professional',
        lavaObject: 'lava pizza',
        eatingStyle: 'normal expression',
        location: 'office',
        mood: 'absurd'
    },
    {
        fashionStyle: 'tracksuit',
        epicSetting: 'mountain_peaks',
        propInHand: 'cellphone',
        vloggingTopic: 'based_life'
    }
];

console.log('Testing variable extraction...\n');

testRecipes.forEach((recipe, index) => {
    const formData = testFormData[index];
    console.log(`Recipe: ${recipe.slug}`);
    console.log(`Form Data:`, formData);

    try {
        const result = processRecipePrompt(recipe, formData);
        console.log(`Processed Prompt: ${result.prompt}`);
        console.log(`Extracted Variables:`, result.extractedVariables);
        console.log('---\n');
    } catch (error) {
        console.error(`Error processing ${recipe.slug}:`, error.message);
    }
}); 