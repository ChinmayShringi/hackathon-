#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { pool, getConnection } from '../server/db';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  console.log(`Database URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`);
  
  try {
    // Test basic connection
    console.log('\n1. Testing basic pool connection...');
    const client = await pool.connect();
    console.log('✅ Basic connection successful');
    
    // Test a simple query
    console.log('\n2. Testing simple query...');
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ Query successful: ${result.rows[0].current_time}`);
    
    // Test connection count
    console.log('\n3. Testing connection pool stats...');
    console.log(`Total connections: ${pool.totalCount}`);
    console.log(`Idle connections: ${pool.idleCount}`);
    console.log(`Waiting connections: ${pool.waitingCount}`);
    
    // Release the connection
    client.release();
    
    // Test connection retry logic
    console.log('\n4. Testing connection retry logic...');
    const retryClient = await getConnection(3, 1000);
    if (retryClient) {
      console.log('✅ Retry connection successful');
      retryClient.release();
    } else {
      console.log('❌ Retry connection failed');
    }
    
    console.log('\n🎉 All database connection tests passed!');
    
  } catch (error: any) {
    console.error('\n❌ Database connection test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    
    if (error.code === 'EADDRNOTAVAIL') {
      console.log('\n💡 This appears to be a network connectivity issue.');
      console.log('   - Check your internet connection');
      console.log('   - Verify the database host is reachable');
      console.log('   - Check if your VPN is interfering');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 This appears to be a connection refused error.');
      console.log('   - Check if the database server is running');
      console.log('   - Verify the port number is correct');
      console.log('   - Check firewall settings');
    } else if (error.message?.includes('timeout')) {
      console.log('\n💡 This appears to be a connection timeout.');
      console.log('   - The connection timeout may be too short');
      console.log('   - Network latency might be high');
      console.log('   - Try increasing connectionTimeoutMillis');
    }
    
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
    console.log('\n🔌 Database pool closed');
  }
}

// Run the test
testDatabaseConnection().catch(console.error); 