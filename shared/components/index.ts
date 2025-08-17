/**
 * Abstract Component System - Main Exports
 * 
 * This module exports all the core components of the new abstract component system.
 * The system is designed to be completely separate from existing production code.
 */

// Core system types and interfaces
export { Component, InputChannel, OutputChannel, BaseComponent } from '../component-system';

// Type constants
export { ComponentInputType } from '../component-types';

// Workflow engine and types
export { 
  WorkflowEngine, 
  Workflow, 
  ComponentConnection, 
  WorkflowResult 
} from '../workflow-engine';

// Example components
export { ImageToVideoComponent } from './image-to-video-component';
export { GetFramesFromVideoComponent } from './get-frames-from-video-component';
export { AssetImageComponent } from './asset-image-component';

// Re-export everything for convenience
export * from '../component-system';
export * from '../component-types';
export * from '../workflow-engine';
