import type { Recipe } from "@shared/schema";

interface RecipeFormData {
  [key: string]: string;
}

function getAutoCameraStyle(gameGenre: string): string {
  const lowerGenre = gameGenre.toLowerCase();

  if (lowerGenre.includes('platformer') || lowerGenre.includes('side-scroll')) {
    return 'side scroller';
  } else if (lowerGenre.includes('rpg') || lowerGenre.includes('strategy') || lowerGenre.includes('tactical')) {
    return 'top-down view';
  } else if (lowerGenre.includes('shooter') || lowerGenre.includes('fps')) {
    return 'first-person';
  } else if (lowerGenre.includes('open-world') || lowerGenre.includes('adventure') || lowerGenre.includes('3d')) {
    return '3D third-person open-world';
  } else if (lowerGenre.includes('retro') || lowerGenre.includes('pixel') || lowerGenre.includes('8-bit')) {
    return 'side scroller';
  } else {
    return 'isometric';
  }
}

export function processRecipePrompt(recipe: Recipe, formData: RecipeFormData): { prompt: string; extractedVariables: Record<string, string> } {
  let prompt = recipe.prompt;

  // Special handling for Futuristic AI Anatomy recipe
  if (recipe.slug === 'futuristic-ai-anatomy') {
    // Map form values to prompt variables
    const genderMap: Record<string, string> = {
      'female': 'female',
      'male': 'male'
    };

    const ageMap: Record<string, string> = {
      'child': "child's",
      'teenager': "teenager's",
      'adult': "adult's",
      'elderly': 'elderly'
    };

    const detailsMap: Record<string, string> = {
      'external': 'Show external outlines.',
      'internal': 'Include other organs & skeleton.'
    };

    // Replace placeholders with form data
    prompt = prompt
      .replace('[GENDER]', genderMap[formData.gender] || 'adult')
      .replace('[AGE]', ageMap[formData.age] || "adult's")
      .replace('[BODY_PART]', formData.bodyPart || 'heart')
      .replace('[DETAILS]', detailsMap[formData.details] || 'Show external outlines.');
  }

  // Special handling for Cats in Video Games recipe
  if (recipe.slug === 'cats-in-video-games') {
    const catCountMap: Record<string, string> = {
      'one': 'a cat',
      'two': 'two cats',
      'three': 'three cats',
      'many': 'lots of cats'
    };

    const cameraStyleMap: Record<string, string> = {
      'auto': getAutoCameraStyle(formData.gameGenre || ''),
      'side-scroller': 'side scroller',
      'top-down': 'top-down view',
      'first-person': 'first-person',
      'third-person': '3D third-person open-world',
      'isometric': 'isometric'
    };

    // Replace placeholders with form data
    prompt = prompt
      .replace('[CAT_COUNT]', catCountMap[formData.catCount] || 'a cat')
      .replace('[CAT_COLORS]', formData.catColors || 'orange tabby')
      .replace('[GAME_GENRE]', formData.gameGenre || 'colorful platforming dreamscape')
      .replace('[SETTING_DESCRIPTION]', formData.settingDescription || 'bright blue sky, vanilla clouds, floating islands')
      .replace('[ACTION_DESCRIPTION]', formData.actionDescription || 'jumping across floating platforms')
      .replace('[CAMERA_STYLE]', cameraStyleMap[formData.cameraStyle] || 'side scroller');
  }

  // Special handling for Cat Olympic Diving recipe
  if (recipe.slug === 'cat-olympic-diving') {
    // Map age values to descriptive text
    const ageMap: Record<string, string> = {
      '0': 'kitten',
      '1': 'adult',
      '2': 'senior citizen'
    };

    // Map weight values to descriptive text
    const weightMap: Record<string, string> = {
      '0': 'athletic build',
      '1': 'average weight',
      '2': 'overweight',
      '3': 'obese'
    };

    // Map diving styles to action descriptions
    const divingStyleMap: Record<string, string> = {
      'backflip': 'performing a backflip',
      'forward somersault': 'performing a forward somersault',
      'twisting dive': 'performing a twisting dive',
      'forward dive': 'performing a forward dive'
    };

    // Map attitudes to style descriptions
    const attitudeMap: Record<string, string> = {
      'professional sports athlete': 'in a professional sports athlete style',
      'clumsy amateur': 'in a clumsy amateur style',
      'sophisticated and poised': 'in a sophisticated and poised style'
    };

    // Map water entry styles to special effects
    const waterEntryMap: Record<string, string> = {
      'neat dive': 'clean, minimal splash entry',
      'cannonball splash': 'overexaggerated cannonball splash',
      'meteoric': 'explosive meteoric entry with massive water displacement'
    };

    // Map sound styles to ambient sounds
    const ambientSoundsMap: Record<string, string> = {
      'stadium cheering': 'lots of clapping and audience cheering and whistling in the background, with Olympic Sports Commentator narration about what they\'re seeing',
      'hushed stadium': 'muffled clapping and whispers of anticipation, the splashing of water, with Olympic Sports Commentator narration about what they\'re seeing'
    };

    // Build cat description
    const catDescription = `${weightMap[formData.weight] || 'athletic build'} ${formData.breed || 'black american shorthair'} ${ageMap[formData.age] || 'adult'} cat`;

    // Build action description
    const actionDescription = `running down the diving board ${attitudeMap[formData.attitude] || 'in a clumsy amateur style'}, ${divingStyleMap[formData.divingStyle] || 'performing a backflip'}, and entering the water with a ${formData.waterEntryStyle || 'cannonball splash'}`;

    prompt = prompt
      .replace('{{cat_description}}', catDescription)
      .replace('{{action_description}}', actionDescription)
      .replace('{{ambient_sounds}}', ambientSoundsMap[formData.soundStyle] || ambientSoundsMap['stadium cheering'])
      .replace('{{special_effects_description}}', waterEntryMap[formData.waterEntryStyle] || waterEntryMap['cannonball splash']);

    // Add "Avoid" section inside the JSON structure
    const avoidSection = `,
  "Negative Prompt": "blurry, distorted, mutated, deformed, extra limbs, missing limbs, extra tails, fused body parts, blob shapes, non-realistic proportions, cartoonish, caricature, unrealistic eyes, unnatural colors, bad anatomy, disfigured, malformed, grotesque, low detail, unrealistic fur, doll-like, wax figure, plastic texture, poorly drawn paws, poorly drawn face, fused legs, broken spine, floating body parts, glitch, AI artifacts"`;

    // Insert the avoid section before the closing brace
    const lastBraceIndex = prompt.lastIndexOf('}');
    prompt = prompt.slice(0, lastBraceIndex) + avoidSection + prompt.slice(lastBraceIndex);
  }

  // Special handling for Lava Food recipe
  if (recipe.slug === 'lava-food-asmr') {
    // Map eating expressions to descriptive text
    const expressionMap: Record<string, string> = {
      'joyful': 'joyful and delighted',
      'totally_cool': 'completely cool and unfazed',
      'sophisticated_enjoyment': 'sophisticated culinary appreciation',
      'absolutely_loving_it': 'absolutely loving every bite',
      'bored': 'completely bored and indifferent',
      'confused_but_ok': 'confused but accepting the situation'
    };

    // Map food items to action descriptions
    const actionMap: Record<string, string> = {
      'lava pizza': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || 'joyful and delighted'} expression on their face`,
      'lava spoonful of honey': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || 'joyful and delighted'} expression on their face`,
      'lava chocolate cake': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || 'joyful and delighted'} expression on their face`,
      'lava plate of food': `eating ${formData.lavaFoodItem} made out of lava with a ${expressionMap[formData.eatingExpression] || 'joyful and delighted'} expression on their face`
    };

    // Map food items to props descriptions
    const propsMap: Record<string, string> = {
      'lava pizza': 'using their bare hands to eat the lava pizza',
      'lava spoonful of honey': 'using a spoon to scoop up the lava honey from a bowl',
      'lava chocolate cake': 'using only one fork in one hand to lift and take a bite out of the lava chocolate cake made of real lava',
      'lava plate of food': 'using a fork and knife in each hand to cut into a five course fine dining meal'
    };

    // Map venues to ambient sounds
    const ambientSoundsMap: Record<string, string> = {
      'home kitchen': 'gentle sounds of a home kitchen with nothing much going on',
      'japanese hibachi': 'restaurant sounds, excited yells and oohs and aahs, whooshes of grill flames',
      'sports grill': 'background sports on tv, fans cheering for their teams on occasion',
      'science lab table': 'chemistry sounds of beakers and solutions',
      'office cubicle': 'office noise, phones ringing, typing on computers',
      'tv tray dinner on couch': 'background television with a random daytime tv show barely audible'
    };

    // Map venues to detailed descriptions
    const venueDescriptionMap: Record<string, string> = {
      'home kitchen': 'a cozy home kitchen with warm lighting',
      'japanese hibachi': 'a lively Japanese hibachi restaurant with sizzling grills',
      'sports grill': 'a bustling sports grill with multiple TVs showing games',
      'science lab table': 'a sterile science laboratory with beakers and equipment',
      'office cubicle': 'a typical office cubicle with fluorescent lighting',
      'tv tray dinner on couch': 'a comfortable living room with a TV tray and couch'
    };

    prompt = prompt
      .replace('{{age}}', formData.age || '30')
      .replace('{{gender}}', formData.gender || 'female')
      .replace('{{venue}}', venueDescriptionMap[formData.venue] || 'home kitchen')
      .replace('{{action_description}}', actionMap[formData.lavaFoodItem] || actionMap['lava pizza'])
      .replace('{{props_description}}', propsMap[formData.lavaFoodItem] || propsMap['lava pizza'])
      .replace('{{ambient_sounds}}', ambientSoundsMap[formData.venue] || ambientSoundsMap['home kitchen'])
      .replace('{{asmr_sound_style}}', formData.asmrSoundStyle || 'crunchy');
  }

  // Special handling for BASEd Ape Vlog recipe
  if (recipe.slug === 'based-ape-vlog') {
    // Map fashion styles to wardrobe descriptions
    const wardrobeMap: Record<string, string> = {
      'tracksuit': 'Tracksuit with sleek lines and a sporty vibe. Over this are the straps from his parachute pack.',
      'neon_fur_coat': 'Neon fur coat with vibrant colors that pop against the natural environment',
      'casual_streetwear': 'Casual streetwear with a laid-back, urban aesthetic',
      'blazer_gold_chains': 'Blazer with gold chains, giving off luxury influencer vibes',
      'formal_black_tie': 'Formal black tie attire, completely out of place in the epic setting',
      'safari': 'Safari gear with khaki colors and practical pockets',
      'retro_80s': 'Retro 80s fashion with bright colors and bold patterns',
      'rustic': 'Rustic, outdoorsy clothing that fits the natural environment'
    };

    // Map epic settings to location descriptions
    const locationMap: Record<string, string> = {
      'mountain_peaks': 'mountain peaks surrounded by swirling clouds, where crisp air and endless horizons set the stage for high-altitude vibes',
      'canyon': 'deep canyon with towering rock walls and dramatic shadows',
      'urban_skyline': 'urban skyline with city lights and modern architecture',
      'small_airplane': 'small airplane cockpit with controls and instruments visible'
    };

    // Map epic settings to environment descriptions
    const environmentMap: Record<string, string> = {
      'mountain_peaks': 'thin, crisp air swirling around jagged peaks, with sunlight glinting off snow-dusted stone and endless sky above',
      'canyon': 'echoing canyon walls with natural rock formations and dramatic lighting',
      'urban_skyline': 'urban environment with city sounds and modern architecture',
      'small_airplane': 'confined airplane interior with engine sounds and wind rushing past'
    };

    // Map props to props descriptions
    const propsMap: Record<string, string> = {
      'none': 'no props in hand, just pure YOLO energy',
      'cellphone': 'smartphone mounted on a selfie stick',
      'selfie_stick': 'smartphone mounted on a selfie stick',
      'microphone': 'professional microphone for vlogging'
    };

    // Map vlogging topics to topic descriptions
    const topicMap: Record<string, string> = {
      'based_life': 'speaking about living a BASEd life',
      'extreme_yolo': 'discussing extreme YOLO activities',
      'survival_tips': 'sharing survival tips and wilderness knowledge',
      'boujee_bragging': 'bragging about luxury lifestyle and expensive possessions',
      'crypto_riches': 'speaking about Crypto Riches',
      'burning_daddys_money': 'talking about spending money recklessly'
    };

    // Map vlogging topics to audio effects
    const audioEffectsMap: Record<string, string> = {
      'based_life': 'yells something like aaaaah or wooooo after he jumps off',
      'extreme_yolo': 'yells something like aaaaah or wooooo after he jumps off',
      'survival_tips': 'yells something like aaaaah or wooooo after he jumps off',
      'boujee_bragging': 'yells something like aaaaah or wooooo after he jumps off',
      'crypto_riches': 'yells something like aaaaah or wooooo after he jumps off',
      'burning_daddys_money': 'yells something like aaaaah or wooooo after he jumps off'
    };

    // Map epic settings to ambient sounds
    const ambientSoundsMap: Record<string, string> = {
      'mountain_peaks': 'steady wind with occasional sharp gusts',
      'canyon': 'echoing canyon sounds with wind through rock formations',
      'urban_skyline': 'city sounds with traffic and urban ambience',
      'small_airplane': 'airplane engine sounds with wind rushing past'
    };

    // Build action description based on prop and topic
    const actionDescription = `Gorilla holds ${propsMap[formData.propInHand] || propsMap['none']}, speaking excitedly to the camera about ${topicMap[formData.vloggingTopic] || topicMap['based_life']} before letting out a dramatic scream`;

    // Map vlogging topics to additional action descriptions
    const additionalActionMap: Record<string, string> = {
      'based_life': 'gorilla talks to the camera about living a BASEd life and then jumps off the edge and parachutes down and away',
      'extreme_yolo': 'gorilla talks to the camera about extreme YOLO activities and then jumps off the edge and parachutes down and away',
      'survival_tips': 'gorilla talks to the camera about survival tips and wilderness knowledge and then jumps off the edge and parachutes down and away',
      'boujee_bragging': 'gorilla talks to the camera about luxury lifestyle and expensive possessions and then jumps off the edge and parachutes down and away',
      'crypto_riches': 'gorilla talks to the camera about Crypto Riches and then jumps off the edge and parachutes down and away',
      'burning_daddys_money': 'gorilla talks to the camera about spending money recklessly and then jumps off the edge and parachutes down and away'
    };

    // Build additional action description
    const additionalActionDescription = additionalActionMap[formData.vloggingTopic] || additionalActionMap['based_life'];

    prompt = prompt
      .replace('{{wardrobe_description}}', wardrobeMap[formData.fashionStyle] || wardrobeMap['tracksuit'])
      .replace('{{location_description}}', locationMap[formData.epicSetting] || locationMap['mountain_peaks'])
      .replace('{{environment_description}}', environmentMap[formData.epicSetting] || environmentMap['mountain_peaks'])
      .replace('{{action_description}}', actionDescription)
      .replace('{{props_description}}', propsMap[formData.propInHand] || propsMap['none'])
      .replace('{{audio_effects}}', audioEffectsMap[formData.vloggingTopic] || audioEffectsMap['based_life'])
      .replace('{{ambient_sounds}}', ambientSoundsMap[formData.epicSetting] || ambientSoundsMap['mountain_peaks'])
      .replace('{{additional_action_description}}', additionalActionDescription);
  }

  return {
    prompt,
    extractedVariables: formData
  };
}



export interface TagDisplayData {
  [key: string]: {
    value: string;
  };
}

export async function generateTagDisplayData(recipe: Recipe, formData: RecipeFormData): Promise<TagDisplayData> {
  const tagDisplayData: TagDisplayData = {};

  if (!recipe.recipeSteps || !Array.isArray(recipe.recipeSteps)) {
    return tagDisplayData;
  }

  // Label transformation function for Cat Olympic Diving recipe
  function transformLabel(recipeSlug: string, originalLabel: string): string {
    if (recipeSlug === 'cat-olympic-diving') {
      const labelMap: Record<string, string> = {
        'Attitude': 'Cattitude',
      };

      return labelMap[originalLabel] || originalLabel;
    }

    return originalLabel;
  }

  // Tick label transformation for Cat Olympic Diving recipe
  function transformTickLabel(recipeSlug: string, originalLabel: string): string {
    if (recipeSlug === 'cat-olympic-diving') {
      // Transform weight labels to meme terms
      if (originalLabel === 'Athletic Build') return 'SMOL';
      if (originalLabel === 'Average Weight') return 'Buff';
      if (originalLabel === 'Overweight') return 'Chonk';
      if (originalLabel === 'Obese') return 'Heck \'n Chonk';
      if (originalLabel === 'Senior Citizen Cat') return 'Senior Cat';
    }

    return originalLabel;
  }



  for (const step of recipe.recipeSteps) {
    const fieldValue = formData[step.id];
    if (!fieldValue) continue;

    let displayValue = fieldValue; // Default to the raw value

    // Handle different field types
    switch (step.type) {
      case 'radio':
      case 'dropdown':
        // Find the option with matching value and use its label
        const option = step.options?.find((opt: any) => opt.value === fieldValue);
        if (option) {
          displayValue = option.label;
        }
        break;

      case 'slider':
        // For sliders with ticks, find the tick with matching value
        if (step.config?.ticks) {
          const tick = step.config.ticks.find((t: any) => t.value.toString() === fieldValue);
          if (tick) {
            displayValue = transformTickLabel(recipe.slug, tick.label);
          }
        }
        break;

      case 'emoji_button':
        // For emoji buttons, combine emoji with label (preserve emoji values)
        const emojiOption = step.options?.find((opt: any) => opt.value === fieldValue);
        if (emojiOption) {
          const emoji = emojiOption.emoji || '';
          displayValue = emoji ? `${emoji} ${emojiOption.label}` : emojiOption.label;
        }
        break;

      case 'text':
      case 'text_prompt':
        // For text fields, use the value as-is
        displayValue = fieldValue;
        break;

      default:
        // For unknown types, use the value as-is
        displayValue = fieldValue;
        break;
    }

    // Store tag display data with transformed label
    const transformedLabel = transformLabel(recipe.slug, step.label);
    tagDisplayData[transformedLabel] = {
      value: displayValue
      // No icon or color fields - these will be computed dynamically
    };
  }

  return tagDisplayData;
}

export function getImageSizeFromOrientation(orientation: string): string {
  switch (orientation) {
    case 'portrait':
      return 'portrait_4_3';
    case 'landscape':
      return 'landscape_4_3';
    case 'square':
      return 'square_hd';
    default:
      return 'portrait_4_3';
  }
}

export function validateRecipeFormData(recipe: Recipe, formData: RecipeFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Add validation logic for specific recipes if needed
  if (recipe.slug === 'futuristic-ai-anatomy') {
    if (!formData.bodyPart || formData.bodyPart.trim().length === 0) {
      errors.push('Body part is required');
    }
  }

  if (recipe.slug === 'cats-in-video-games') {
    if (!formData.catColors || formData.catColors.trim().length === 0) {
      errors.push('Cat colors are required');
    }
    if (!formData.gameGenre || formData.gameGenre.trim().length === 0) {
      errors.push('Game genre is required');
    }
    if (!formData.actionDescription || formData.actionDescription.trim().length === 0) {
      errors.push('Action description is required');
    }
  }

  // Validation for Alpha site guest recipes
  if (recipe.slug === 'cat-olympic-diving') {
    if (!formData.breed) {
      errors.push('Cat breed selection is required');
    }
    if (!formData.age) {
      errors.push('Age selection is required');
    }
    if (!formData.weight) {
      errors.push('Weight selection is required');
    }
    if (!formData.divingStyle) {
      errors.push('Diving style selection is required');
    }
    if (!formData.attitude) {
      errors.push('Attitude selection is required');
    }
    if (!formData.waterEntryStyle) {
      errors.push('Water entry style selection is required');
    }
    if (!formData.soundStyle) {
      errors.push('Sound style selection is required');
    }
  }

  if (recipe.slug === 'lava-food-asmr') {
    if (!formData.gender) {
      errors.push('Gender selection is required');
    }
    if (!formData.age) {
      errors.push('Age selection is required');
    }
    if (!formData.lavaFoodItem) {
      errors.push('Lava food item selection is required');
    }
    if (!formData.eatingExpression) {
      errors.push('Eating expression selection is required');
    }
    if (!formData.venue) {
      errors.push('Venue selection is required');
    }
    if (!formData.asmrSoundStyle) {
      errors.push('ASMR sound style selection is required');
    }
  }

  if (recipe.slug === 'based-ape-vlog') {
    if (!formData.fashionStyle) {
      errors.push('Fashion style selection is required');
    }
    if (!formData.epicSetting) {
      errors.push('Epic setting selection is required');
    }
    if (!formData.propInHand) {
      errors.push('Prop in hand selection is required');
    }
    if (!formData.vloggingTopic) {
      errors.push('Vlogging topic selection is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}