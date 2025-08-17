#!/usr/bin/env tsx
import { config } from 'dotenv';
import { Pool } from 'pg';

config();

async function main() {
	if (!process.env.DATABASE_URL) {
		console.error('DATABASE_URL missing');
		process.exit(1);
	}

	const pool = new Pool({ connectionString: process.env.DATABASE_URL });
	try {
		console.log('🔍 Checking for user_assets table...');
		const existsRes = await pool.query(
			`SELECT to_regclass('public.user_assets') IS NOT NULL AS exists;`
		);
		const exists = Boolean(existsRes.rows[0]?.exists);
		if (exists) {
			console.log('✅ user_assets already exists. Skipping creation.');
			return;
		}

		console.log('🛠️ Creating user_assets table...');
		await pool.query(`
			CREATE TABLE public.user_assets (
				id SERIAL PRIMARY KEY,
				user_id VARCHAR NOT NULL,
				asset_id VARCHAR(64) NOT NULL,
				original_filename VARCHAR NOT NULL,
				display_name VARCHAR NOT NULL,
				normalized_name VARCHAR,
				s3_key VARCHAR NOT NULL,
				cdn_url VARCHAR NOT NULL,
				mime_type VARCHAR NOT NULL,
				file_size INTEGER NOT NULL,
				asset_type INTEGER NOT NULL,
				source INTEGER NOT NULL,
				dimensions JSONB,
				duration INTEGER,
				thumbnail_url VARCHAR,
				user_tags TEXT[],
				system_tags TEXT[],
				auto_classification JSONB,
				ai_classification JSONB,
				usage_count INTEGER DEFAULT 0 NOT NULL,
				last_used_at TIMESTAMP,
				created_at TIMESTAMP DEFAULT NOW(),
				updated_at TIMESTAMP DEFAULT NOW(),
				is_deleted BOOLEAN DEFAULT FALSE,
				deleted_at TIMESTAMP
			);
		`);

		console.log('🔗 Adding unique and indexes...');
		await pool.query(`
			CREATE UNIQUE INDEX user_assets_asset_id_unique ON public.user_assets (asset_id);
			CREATE INDEX idx_user_assets_user_type_created ON public.user_assets (user_id, asset_type, created_at DESC);
			CREATE INDEX idx_user_assets_normalized_name ON public.user_assets (normalized_name);
		`);

		console.log('✅ user_assets created successfully');
	} catch (e) {
		console.error('❌ Error creating user_assets:', e);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

main();
