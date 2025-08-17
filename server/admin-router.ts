import express from 'express';
import { requireAdminAuth, adminLogin, adminLogout, checkAdminStatus } from './admin-auth';
import { db } from './db';
import { recipeOptionTagIcons } from '../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Admin authentication endpoints
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/status', checkAdminStatus);

// Recipe Tag Icon Management endpoints (require admin auth)
router.get('/recipe-tag-icons', requireAdminAuth, async (req, res) => {
  try {
    const icons = await db
      .select({
        id: recipeOptionTagIcons.id,
        display: recipeOptionTagIcons.display,
        icon: recipeOptionTagIcons.icon,
        color: recipeOptionTagIcons.color,
        createdAt: recipeOptionTagIcons.createdAt,
        updatedAt: recipeOptionTagIcons.updatedAt
      })
      .from(recipeOptionTagIcons)
      .orderBy(recipeOptionTagIcons.id);

    res.json({ success: true, icons });
  } catch (error) {
    console.error('Error fetching recipe tag icons:', error);
    res.status(500).json({ error: 'Failed to fetch recipe tag icons' });
  }
});

router.post('/recipe-tag-icons', requireAdminAuth, async (req, res) => {
  try {
    const { id, display, icon, color } = req.body;

    if (!id || !display) {
      return res.status(400).json({ error: 'ID and display are required' });
    }

    await db
      .insert(recipeOptionTagIcons)
      .values({
        id,
        display,
        icon: icon || null,
        color: color || null
      })
      .onConflictDoUpdate({
        target: recipeOptionTagIcons.id,
        set: {
          display,
          icon: icon || null,
          color: color || null,
          updatedAt: new Date()
        }
      });

    res.json({ success: true, message: 'Recipe tag icon saved successfully' });
  } catch (error) {
    console.error('Error saving recipe tag icon:', error);
    res.status(500).json({ error: 'Failed to save recipe tag icon' });
  }
});

router.put('/recipe-tag-icons/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { display, icon, color } = req.body;

    if (!display) {
      return res.status(400).json({ error: 'Display is required' });
    }

    await db
      .update(recipeOptionTagIcons)
      .set({
        display,
        icon: icon || null,
        color: color || null,
        updatedAt: new Date()
      })
      .where(eq(recipeOptionTagIcons.id, id));

    res.json({ success: true, message: 'Recipe tag icon updated successfully' });
  } catch (error) {
    console.error('Error updating recipe tag icon:', error);
    res.status(500).json({ error: 'Failed to update recipe tag icon' });
  }
});

router.delete('/recipe-tag-icons/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await db
      .delete(recipeOptionTagIcons)
      .where(eq(recipeOptionTagIcons.id, id));

    res.json({ success: true, message: 'Recipe tag icon deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe tag icon:', error);
    res.status(500).json({ error: 'Failed to delete recipe tag icon' });
  }
});

// Backlog Maintenance endpoints
router.get('/backlog-maintenance', requireAdminAuth, async (req, res) => {
  try {
    const { backlogRetainMinimumService } = await import('./service-backlog-retain-minimum');
    const stats = await backlogRetainMinimumService.getBacklogStatistics();
    res.json({ success: true, ...stats });
  } catch (error) {
    console.error('Error fetching backlog maintenance data:', error);
    res.status(500).json({ error: 'Failed to fetch backlog maintenance data' });
  }
});

router.get('/backlog-maintenance/generations', requireAdminAuth, async (req, res) => {
  try {
    const { backlogRetainMinimumService } = await import('./service-backlog-retain-minimum');
    const generations = await backlogRetainMinimumService.getBacklogGenerations();
    res.json({ success: true, generations });
  } catch (error) {
    console.error('Error fetching backlog generations:', error);
    res.status(500).json({ error: 'Failed to fetch backlog generations' });
  }
});

// Backlog Cleanup endpoints
router.get('/backlog-cleanup/status', requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService } = await import('./service-backlog-cleanup');
    const status = await backlogCleanupService.getBacklogStatus();
    res.json({ success: true, ...status });
  } catch (error) {
    console.error('Error fetching backlog cleanup status:', error);
    res.status(500).json({ error: 'Failed to fetch backlog cleanup status' });
  }
});

router.post('/backlog-cleanup/run', requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService } = await import('./service-backlog-cleanup');
    const stats = await backlogCleanupService.cleanupFailedBacklogGenerations();
    res.json({ success: true, message: 'Backlog cleanup completed successfully', ...stats });
  } catch (error) {
    console.error('Error running backlog cleanup:', error);
    res.status(500).json({ error: 'Failed to run backlog cleanup' });
  }
});

router.post('/backlog-cleanup/emergency', requireAdminAuth, async (req, res) => {
  try {
    const { backlogCleanupService } = await import('./service-backlog-cleanup');
    const result = await backlogCleanupService.emergencyCleanup();
    res.json({ 
      success: true, 
      message: 'Emergency backlog cleanup completed successfully', 
      ...result 
    });
  } catch (error) {
    console.error('Error running emergency backlog cleanup:', error);
    res.status(500).json({ error: 'Failed to run emergency backlog cleanup' });
  }
});

export default router; 