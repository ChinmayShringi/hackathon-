import { Pinecone } from '@pinecone-database/pinecone';

// Pinecone configuration
const pineconeApiKey = process.env.PINECONE_API_KEY || '';
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || 'us-east-1-aws';
const indexName = 'magicvid-recipes';

let pinecone: Pinecone | null = null;

export async function initializePinecone() {
  if (!pineconeApiKey) {
    console.warn('Pinecone API key not provided, vector search will be disabled');
    return null;
  }

  try {
    pinecone = new Pinecone({
      apiKey: pineconeApiKey,
    });

    // Check if index exists
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.indexes?.some(index => index.name === indexName);

    if (!indexExists) {
      console.log('Creating Pinecone index for recipe embeddings...');
      await pinecone.createIndex({
        name: indexName,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
    }

    console.log('Pinecone initialized successfully');
    return pinecone;
  } catch (error) {
    console.error('Failed to initialize Pinecone:', error);
    return null;
  }
}

export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    // Use OpenAI to generate embeddings
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

export async function upsertRecipeEmbedding(
  recipeId: number,
  title: string,
  description: string,
  category: string,
  type: 'image' | 'video'
) {
  if (!pinecone) return;

  try {
    const index = pinecone.index(indexName);
    const text = `${title} ${description} ${category}`;
    const embedding = await generateEmbedding(text);

    if (!embedding) return;

    await index.upsert([
      {
        id: `recipe-${recipeId}`,
        values: embedding,
        metadata: {
          recipeId,
          title,
          description,
          category,
          type,
          text
        }
      }
    ]);

    console.log(`Upserted embedding for recipe ${recipeId}`);
  } catch (error) {
    console.error('Error upserting recipe embedding:', error);
  }
}

export async function searchRecipesByVector(
  query: string,
  type?: 'image' | 'video',
  limit: number = 10
): Promise<any[]> {
  if (!pinecone) return [];

  try {
    const index = pinecone.index(indexName);
    const queryEmbedding = await generateEmbedding(query);

    if (!queryEmbedding) return [];

    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
      filter: type ? { type: { $eq: type } } : undefined
    });

    return searchResults.matches?.map(match => ({
      recipeId: match.metadata?.recipeId,
      title: match.metadata?.title,
      description: match.metadata?.description,
      category: match.metadata?.category,
      type: match.metadata?.type,
      score: match.score
    })) || [];
  } catch (error) {
    console.error('Error searching recipes by vector:', error);
    return [];
  }
}

export async function initializeRecipeEmbeddings(recipes: any[]) {
  if (!pinecone) {
    console.log('Pinecone not initialized, skipping recipe embeddings');
    return;
  }

  // Check if embeddings are disabled via environment variable
  if (process.env.DISABLE_VECTOR_EMBEDDINGS === 'true') {
    console.log('Vector embeddings disabled via environment variable');
    return;
  }

  console.log('Initializing recipe embeddings...');
  
  for (const recipe of recipes) {
    await upsertRecipeEmbedding(
      recipe.id,
      recipe.name,
      recipe.description,
      recipe.category,
      recipe.category.toLowerCase().includes('video') ? 'video' : 'image'
    );
  }

  console.log('Recipe embeddings initialized');
}