# Backlog Cleanup System

## Overview

The Backlog Cleanup System is a critical maintenance component that prevents the accumulation of failed generations in the `system_backlog` user account during service interruptions. Without this system, a service outage could flood the backlog account with thousands of failed generations, wasting resources and potentially causing performance issues.

## 🚨 Why This System is Critical

### The Problem
During service interruptions (e.g., FAL.ai API downtime, network issues, or system failures), the backlog maintenance service continues to attempt generating content. Each failed attempt creates a generation record with `status = 'failed'`. Without cleanup:

- **Resource Waste**: Failed generations consume database space and memory
- **Performance Degradation**: Queries become slower with large numbers of failed records
- **System Instability**: Excessive failed generations can impact the entire backlog system
- **Debugging Difficulty**: Too many failed records make it hard to identify real issues

### The Solution
The Backlog Cleanup System automatically removes failed generations while preserving recent ones for debugging purposes:

- **Daily Cleanup**: Automatically runs every day at 2:00 AM UTC
- **Smart Retention**: Keeps up to 10 recent failed generations per recipe for debugging
- **Age-Based Cleanup**: Removes failed generations older than 24 hours
- **Emergency Cleanup**: Manual option to remove ALL failed generations when needed

## 🏗️ System Architecture

### Core Components

1. **BacklogCleanupService** (`server/service-backlog-cleanup.ts`)
   - Main cleanup logic and orchestration
   - Age-based cleanup with smart retention
   - Emergency cleanup capabilities

2. **PostgreSQL Function** (`backlog_cleanup_failed_generations()`)
   - Database-level cleanup function
   - Runs via pg_cron for automated daily execution
   - Efficient bulk deletion with proper indexing

3. **Admin API Endpoints** (`/api/admin/backlog-cleanup/*`)
   - Status monitoring
   - Manual cleanup execution
   - Emergency cleanup operations

4. **CLI Scripts** (`scripts/run-backlog-cleanup.ts`)
   - Command-line interface for manual operations
   - Status checking and monitoring
   - Emergency cleanup execution

### Cleanup Strategy

```typescript
interface CleanupConfig {
  CLEANUP_AGE_HOURS: 24;                    // Remove failed generations older than 24h
  MAX_FAILED_GENERATIONS_PER_RECIPE: 10;    // Keep up to 10 recent failed per recipe
  CLEANUP_SCHEDULE: '0 2 * * *';           // Daily at 2:00 AM UTC
}
```

#### Regular Cleanup Process
1. **Age Filtering**: Only consider failed generations older than 24 hours
2. **Recipe Grouping**: Group failed generations by recipe ID
3. **Smart Retention**: For each recipe, keep the 10 most recent failed generations
4. **Bulk Deletion**: Remove oldest failed generations in efficient batches
5. **Audit Logging**: Record cleanup operations in credit_transactions table

#### Emergency Cleanup Process
1. **Immediate Action**: Remove ALL failed generations regardless of age
2. **Complete Reset**: Clean slate for the backlog system
3. **Use with Caution**: Only when there's critical accumulation

## 🚀 Usage

### Automated Daily Cleanup

The system automatically runs daily cleanup via PostgreSQL's `pg_cron` extension:

```bash
# Set up the daily cron job (one-time setup)
npm run backlog-cleanup-setup
```

This creates:
- A PostgreSQL function: `backlog_cleanup_failed_generations()`
- A cron job: `backlog-cleanup-daily` running at 2:00 AM UTC daily

### Manual Operations

#### Check Current Status
```bash
# View backlog status including failed generation counts
npm run backlog-cleanup status

# Or directly with tsx
npx tsx scripts/run-backlog-cleanup.ts status
```

#### Run Manual Cleanup
```bash
# Run regular cleanup (removes old failed generations)
npm run backlog-cleanup cleanup

# Or directly with tsx
npx tsx scripts/run-backlog-cleanup.ts cleanup
```

#### Emergency Cleanup
```bash
# Remove ALL failed generations (use with caution)
npm run backlog-cleanup emergency

# Or directly with tsx
npx tsx scripts/run-backlog-cleanup.ts emergency
```

### Admin API Operations

#### Get Cleanup Status
```http
GET /api/admin/backlog-cleanup/status
```

**Response:**
```json
{
  "success": true,
  "totalGenerations": 150,
  "completedGenerations": 120,
  "failedGenerations": 25,
  "pendingGenerations": 3,
  "processingGenerations": 2,
  "recipesWithFailedGenerations": [
    {
      "recipeId": 16,
      "recipeName": "Cat Olympic Diving",
      "failedCount": 15,
      "oldestFailedAge": "2 hours ago"
    }
  ]
}
```

#### Run Manual Cleanup
```http
POST /api/admin/backlog-cleanup/run
```

**Response:**
```json
{
  "success": true,
  "message": "Backlog cleanup completed successfully",
  "totalFailedGenerations": 25,
  "cleanedUpGenerations": 15,
  "recipesAffected": 3,
  "cleanupDetails": [
    {
      "recipeId": 16,
      "recipeName": "Cat Olympic Diving",
      "failedCount": 15,
      "cleanedCount": 5,
      "keptCount": 10
    }
  ]
}
```

#### Emergency Cleanup
```http
POST /api/admin/backlog-cleanup/emergency
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency backlog cleanup completed successfully",
  "removedCount": 25,
  "recipesAffected": 3
}
```

## 📊 Monitoring and Analytics

### Key Metrics

#### Cleanup Performance
- **Total Failed Generations**: Count of all failed generations in backlog
- **Cleanup Rate**: Percentage of failed generations removed per cleanup cycle
- **Recipes Affected**: Number of recipes with failed generations
- **Cleanup Frequency**: How often cleanup runs and its success rate

#### System Health
- **Failed Generation Accumulation**: Rate of failed generation creation
- **Cleanup Effectiveness**: Whether cleanup is keeping pace with failures
- **Recipe-Specific Issues**: Which recipes are generating the most failures

### Monitoring Queries

#### Check Failed Generation Counts
```sql
-- Overall failed generation count
SELECT COUNT(*) as failed_count
FROM generations 
WHERE user_id = 'system_backlog' 
  AND status = 'failed';

-- Failed generations by recipe
SELECT 
  r.name as recipe_name,
  COUNT(g.id) as failed_count,
  MAX(g.updated_at) as latest_failure
FROM generations g
JOIN recipes r ON g.recipe_id = r.id
WHERE g.user_id = 'system_backlog' 
  AND g.status = 'failed'
GROUP BY r.id, r.name
ORDER BY failed_count DESC;
```

#### Monitor Cleanup Operations
```sql
-- Recent cleanup operations
SELECT 
  user_id,
  amount as generations_removed,
  description,
  created_at
FROM credit_transactions 
WHERE type = 'backlog_cleanup'
ORDER BY created_at DESC
LIMIT 10;
```

#### Check Cron Job Status
```sql
-- Verify cleanup cron job is active
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  active
FROM cron.job 
WHERE jobname = 'backlog-cleanup-daily';
```

## 🔧 Configuration

### Environment Variables

No additional environment variables are required beyond the standard database configuration.

### Database Requirements

#### Required Extensions
```sql
-- pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS cron;
```

**Note**: pg_cron requires superuser privileges to install.

#### Required Tables
- `generations` - Contains the generation records to clean up
- `users` - Contains the system_backlog user account
- `credit_transactions` - For audit logging of cleanup operations

### Cleanup Parameters

#### Adjustable Constants
```typescript
const CLEANUP_AGE_HOURS = 24;                    // Age threshold for cleanup
const MAX_FAILED_GENERATIONS_PER_RECIPE = 10;    // Retention limit per recipe
const CLEANUP_SCHEDULE = '0 2 * * *';           // Cron schedule (daily at 2 AM UTC)
```

#### Customization
To modify cleanup parameters:

1. **Update the service**: Modify constants in `service-backlog-cleanup.ts`
2. **Update the function**: Modify the PostgreSQL function via the setup script
3. **Update the cron schedule**: Modify the schedule in the setup script

## 🚨 Troubleshooting

### Common Issues

#### Cleanup Not Running
**Symptoms**: Failed generations accumulating, no cleanup logs
**Diagnosis**: Check if pg_cron extension is installed and cron job is active
**Solution**: Run `npm run backlog-cleanup-setup` to verify setup

#### Insufficient Permissions
**Symptoms**: "pg_cron extension not found" error
**Diagnosis**: Database user lacks superuser privileges
**Solution**: Contact database administrator to install pg_cron extension

#### Cleanup Function Errors
**Symptoms**: Cleanup operations failing with database errors
**Diagnosis**: Check database logs for function execution errors
**Solution**: Verify the cleanup function exists and has proper permissions

### Debug Commands

#### Check System Status
```bash
# Verify all components are working
npm run backlog-cleanup status

# Check if cron job is active
npx tsx scripts/run-backlog-cleanup.ts status
```

#### Test Cleanup Function
```sql
-- Test the cleanup function directly
SELECT backlog_cleanup_failed_generations();

-- Check for any errors in the logs
SELECT * FROM pg_stat_activity WHERE query LIKE '%backlog_cleanup%';
```

#### Verify Cron Job
```sql
-- Check cron job status
SELECT * FROM cron.job WHERE jobname = 'backlog-cleanup-daily';

-- Check recent job runs
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'backlog-cleanup-daily')
ORDER BY start_time DESC LIMIT 5;
```

## 🔮 Future Enhancements

### Planned Improvements

1. **Adaptive Cleanup**: Adjust cleanup frequency based on failure rates
2. **Selective Cleanup**: Clean up specific recipes or failure types
3. **Cleanup Analytics**: Detailed reporting on cleanup effectiveness
4. **Alerting**: Notify administrators when cleanup thresholds are exceeded
5. **Cleanup Policies**: Configurable cleanup rules per recipe or failure type

### Performance Optimizations

1. **Batch Processing**: Process cleanup in larger batches for better performance
2. **Parallel Cleanup**: Clean up multiple recipes simultaneously
3. **Index Optimization**: Add specific indexes for cleanup queries
4. **Cleanup Scheduling**: Run cleanup during low-traffic periods

## 📝 Conclusion

The Backlog Cleanup System is essential for maintaining the health and performance of the Delula platform's backlog system. By automatically removing failed generations while preserving recent ones for debugging, it prevents resource waste and system degradation during service interruptions.

### Key Benefits
- **Automatic Maintenance**: Daily cleanup without manual intervention
- **Smart Retention**: Preserves recent failures for debugging
- **Emergency Recovery**: Manual cleanup when needed
- **Performance Protection**: Prevents system degradation from failed generation accumulation
- **Audit Trail**: Complete logging of all cleanup operations

### Best Practices
1. **Monitor Regularly**: Check cleanup status weekly
2. **Review Failures**: Investigate patterns in failed generations
3. **Use Emergency Cleanup Sparingly**: Only when absolutely necessary
4. **Maintain Cleanup Schedule**: Ensure daily cleanup is running
5. **Monitor Cleanup Effectiveness**: Verify cleanup is keeping pace with failures

This system ensures that the Delula platform remains stable and performant even during extended service interruptions, protecting both system resources and user experience.
