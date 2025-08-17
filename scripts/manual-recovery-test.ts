#!/usr/bin/env tsx

import './_setup-env.ts';
import { db } from '../server/db.ts';
import { generations } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import * as fal from '@fal-ai/serverless-client';
import { mediaTransferService } from '../server/media-transfer-service';

async function manualRecoveryTest() {
  const jobId = 82; // The stuck job from the logs
  
  console.log(`🔧 Manual Recovery Test for Job ${jobId}...`);
  
  try {
    // Get the current job status
    const job = await db.select({
      id: generations.id,
      status: generations.status,
      falJobId: generations.falJobId,
      metadata: generations.metadata,
      createdAt: generations.createdAt,
      recipeTitle: generations.recipeTitle
    })
    .from(generations)
    .where(eq(generations.id, jobId))
    .limit(1);

    if (!job.length) {
      console.error(`❌ Job ${jobId} not found`);
      return;
    }

    const generation = job[0];
    console.log(`Current status: ${generation.status}`);
    console.log(`FAL Job ID: ${generation.falJobId}`);
    console.log(`Recipe: ${generation.recipeTitle}`);
    console.log(`Created: ${generation.createdAt}`);

    if (!generation.falJobId) {
      console.error(`❌ No FAL job ID found for generation ${jobId}`);
      return;
    }

    // Check FAL job status directly
    console.log(`\n🌐 Checking FAL API status for job ${generation.falJobId}...`);
    
    const metadata = generation.metadata as any;
    const endpoint = metadata?.endpoint || "fal-ai/flux/dev";
    
    console.log(`Using endpoint: ${endpoint}`);
    
    // Check job status using FAL API
    const status = await fal.queue.status(endpoint, { requestId: generation.falJobId });
    console.log(`FAL Status: ${status.status}`);
    
    if (status.status === 'COMPLETED') {
      console.log(`✅ FAL job completed, fetching result...`);
      
      // Get the result
      const result = await fal.queue.result(endpoint, { requestId: generation.falJobId }) as any;
      console.log(`Result available:`, JSON.stringify(result, null, 2).slice(0, 500) + '...');
      
      // Transfer media to S3 if it's a video
      if (result?.video?.url) {
        console.log(`\n📤 Transferring video to S3...`);
        const transferResult = await mediaTransferService.transferMedia({
          remoteUrl: result.video.url,
          mediaType: 'video'
        });
        
        if (transferResult.success) {
          console.log(`✅ Media transfer successful: ${transferResult.cdnUrl}`);
          
          // Update the generation with the completed result
          console.log(`\n💾 Updating generation ${jobId} with completed result...`);
          
          await db.update(generations)
            .set({
              status: 'completed',
              s3Key: transferResult.s3Key,
              assetId: transferResult.assetId,
              metadata: {
                ...metadata,
                finalJobId: generation.falJobId,
                transferredToS3: true,
                cdnUrl: transferResult.cdnUrl,
                s3Key: transferResult.s3Key,
                assetId: transferResult.assetId,
                completedAt: new Date().toISOString()
              },
              updatedAt: new Date()
            })
            .where(eq(generations.id, jobId));
          
          console.log(`✅ Generation ${jobId} successfully completed!`);
          console.log(`📺 Video available at: ${transferResult.cdnUrl}`);
          
        } else {
          console.error(`❌ Media transfer failed:`, transferResult.error);
        }
      } else {
        console.error(`❌ No video URL found in result`);
      }
      
    } else {
      const statusValue = status.status as string;
      if (statusValue === 'FAILED' || statusValue === 'ERROR') {
        console.log(`❌ FAL job failed:`, JSON.stringify(status, null, 2));
        
        // Mark as failed
        await db.update(generations)
          .set({
            status: 'failed',
            failureReason: `FAL job failed: ${JSON.stringify(status)}`,
            updatedAt: new Date()
          })
          .where(eq(generations.id, jobId));
        
        console.log(`❌ Generation ${jobId} marked as failed`);
      } else {
        console.log(`⏳ FAL job still processing: ${statusValue}`);
        console.log(`📊 Status details:`, JSON.stringify(status, null, 2));
      }
    }
    
  } catch (error) {
    console.error(`❌ Error during manual recovery:`, error);
  } finally {
    await db.$client.end();
  }
}

// Run the manual recovery test
manualRecoveryTest().catch(console.error); 