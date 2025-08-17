import[object Object]config } from 'dotenv';
config();

async function debugTimestampFormat() {
  try {
    // Fetch a generation to see the timestamp format
    const response = await fetch(http://localhost:5232api/alpha/my-makes?page=1&per_page=1', {
      credentials: include   });
    
    if (!response.ok) {
      console.error('Failed to fetch generations:,response.status);
      return;
    }
    
    const data = await response.json();
    
    if (data.generations && data.generations.length > 0) {
      const generation = data.generations0
      console.log('Generation timestamp format:');
      console.log('Raw createdAt:', generation.createdAt);
      console.log('Type:', typeof generation.createdAt);
      console.log(AsDate object:', new Date(generation.createdAt));
      console.log('As ISO string:', new Date(generation.createdAt).toISOString());
      console.log(Local timezone:', new Date(generation.createdAt).toString());
      console.log('UTC time:', new Date(generation.createdAt).toUTCString());
      
      // Check if it's already in local time or UTC
      const now = new Date();
      const createdAt = new Date(generation.createdAt);
      const diffHours = Math.abs(now.getTime() - createdAt.getTime()) / (1000 *6060    
      console.log('\nTime analysis:');
      console.log('Current time:', now.toString());
      console.log('Created time:', createdAt.toString());
      console.log('Difference in hours:', diffHours);
      
      if (diffHours > 24)[object Object]       console.log('⚠️  Large time difference - possible timezone issue');
      } else[object Object]       console.log(✅ Time difference seems reasonable');
      }
    } else {
      console.log('No generations found');
    }
  } catch (error) {
    console.error(Error:, error);
  }
}

debugTimestampFormat(); 