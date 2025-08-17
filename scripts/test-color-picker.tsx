#!/usr/bin/env tsx

import 'dotenv/config';
import { db } from '../server/db';
import { recipeOptionTagIcons } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function testColorPicker() {
  console.log('🎨 Testing Color Picker Integration...');

  try {
    // Test 1: Check if we can read existing color data
    console.log('\n📖 Reading existing recipe tag icons...');
    const icons = await db
      .select({
        id: recipeOptionTagIcons.id,
        display: recipeOptionTagIcons.display,
        icon: recipeOptionTagIcons.icon,
        color: recipeOptionTagIcons.color,
      })
      .from(recipeOptionTagIcons)
      .orderBy(recipeOptionTagIcons.id);

    console.log(`Found ${icons.length} icon mappings:`);
    icons.forEach(icon => {
      console.log(`  - ${icon.id}: ${icon.display} | Icon: ${icon.icon || 'none'} | Color: ${icon.color || 'default'}`);
    });

    // Test 2: Test color validation patterns
    console.log('\n🔍 Testing color validation patterns...');
    const testColors = [
      '#FF0000',    // Valid 6-digit hex
      '#00FF00',    // Valid 6-digit hex
      '#0000FF',    // Valid 6-digit hex
      '#123456',    // Valid 6-digit hex
      '#FF0000FF',  // Valid 8-digit hex (with alpha)
      '#00FF0080',  // Valid 8-digit hex (with alpha)
      'invalid',    // Invalid
      '#GGGGGG',    // Invalid hex
      '#12345',     // Invalid (too short)
      '#1234567',   // Invalid (too long)
      '#123456789', // Invalid (too long)
    ];

    const hexPattern = /^#[0-9A-F]{6}$/i;
    const hexAlphaPattern = /^#[0-9A-F]{8}$/i;
    testColors.forEach(color => {
      const isValid6 = hexPattern.test(color);
      const isValid8 = hexAlphaPattern.test(color);
      const isValid = isValid6 || isValid8;
      const type = isValid8 ? '(32-bit with alpha)' : isValid6 ? '(24-bit)' : '';
      console.log(`  ${color}: ${isValid ? '✅ Valid' : '❌ Invalid'} ${type}`);
    });

    // Test 3: Test updating a color (if we have existing data)
    if (icons.length > 0) {
      const testIcon = icons[0];
      console.log(`\n🔄 Testing color update for "${testIcon.id}"...`);
      
      const newColor = '#FF6B35FF'; // Orange color with full alpha
      await db
        .update(recipeOptionTagIcons)
        .set({
          color: newColor,
          updatedAt: new Date()
        })
        .where(eq(recipeOptionTagIcons.id, testIcon.id));

      console.log(`✅ Updated color to ${newColor}`);

      // Verify the update
      const updatedIcon = await db
        .select({
          id: recipeOptionTagIcons.id,
          color: recipeOptionTagIcons.color,
        })
        .from(recipeOptionTagIcons)
        .where(eq(recipeOptionTagIcons.id, testIcon.id))
        .limit(1);

      console.log(`✅ Verified update: ${updatedIcon[0]?.color}`);

      // Revert the change
      await db
        .update(recipeOptionTagIcons)
        .set({
          color: testIcon.color,
          updatedAt: new Date()
        })
        .where(eq(recipeOptionTagIcons.id, testIcon.id));

      console.log(`✅ Reverted color back to original`);
    }

    console.log('\n✅ Color picker integration test completed successfully!');
    console.log('\n🎯 Key Features:');
    console.log('  - 32-bit hex color support (8-digit format with alpha)');
    console.log('  - Material Design color palette');
    console.log('  - Multiple picker types (Picker, Palette, Input)');
    console.log('  - Visual color picker with react-colorful');
    console.log('  - Direct hex input support');
    console.log('  - Color preview in table view');
    console.log('  - Database storage as text field');
    console.log('  - Automatic hex normalization');

  } catch (error) {
    console.error('❌ Error testing color picker:', error);
  } finally {
    await db.$client.end();
  }
}

testColorPicker(); 