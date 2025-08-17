-- Migration: Add Component Registry System
-- This migration adds tables to support the new Abstract Component System

-- Component registry table
CREATE TABLE component_registry (
  id SERIAL PRIMARY KEY,
  component_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  description TEXT,
  category VARCHAR(100),
  tags TEXT[],
  credit_cost INTEGER DEFAULT 0,
  estimated_processing_time INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Component input channels table
CREATE TABLE component_input_channels (
  id SERIAL PRIMARY KEY,
  component_id VARCHAR(100) NOT NULL,
  channel_id VARCHAR(100) NOT NULL,
  channel_name VARCHAR(200) NOT NULL,
  type INTEGER NOT NULL,
  position INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT false,
  description TEXT,
  validation_rules JSONB,
  default_value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique channel per component
  UNIQUE(component_id, channel_id),
  
  -- Foreign key to component registry
  FOREIGN KEY (component_id) REFERENCES component_registry(component_id) ON DELETE CASCADE
);

-- Component output channels table
CREATE TABLE component_output_channels (
  id SERIAL PRIMARY KEY,
  component_id VARCHAR(100) NOT NULL,
  channel_id VARCHAR(100) NOT NULL,
  channel_name VARCHAR(200) NOT NULL,
  type INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique channel per component
  UNIQUE(component_id, channel_id),
  
  -- Foreign key to component registry
  FOREIGN KEY (component_id) REFERENCES component_registry(component_id) ON DELETE CASCADE
);

-- Component usage tracking table
CREATE TABLE component_usage (
  id SERIAL PRIMARY KEY,
  component_id VARCHAR(100) NOT NULL,
  user_id VARCHAR(100),
  execution_id VARCHAR(100),
  input_data JSONB,
  output_data JSONB,
  processing_time_ms INTEGER,
  credit_cost INTEGER,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key to component registry
  FOREIGN KEY (component_id) REFERENCES component_registry(component_id),
  
  -- Foreign key to users (optional)
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Component dependencies table
CREATE TABLE component_dependencies (
  id SERIAL PRIMARY KEY,
  component_id VARCHAR(100) NOT NULL,
  depends_on_component_id VARCHAR(100) NOT NULL,
  dependency_type VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign keys to component registry
  FOREIGN KEY (component_id) REFERENCES component_registry(component_id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_component_id) REFERENCES component_registry(component_id) ON DELETE CASCADE,
  
  -- Prevent self-dependencies
  CHECK (component_id != depends_on_component_id)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_component_registry_component_id ON component_registry(component_id);
CREATE INDEX idx_component_registry_category ON component_registry(category);
CREATE INDEX idx_component_registry_is_active ON component_registry(is_active);

CREATE INDEX idx_component_input_channels_component_id ON component_input_channels(component_id);
CREATE INDEX idx_component_input_channels_position ON component_input_channels(position);

CREATE INDEX idx_component_output_channels_component_id ON component_output_channels(component_id);

CREATE INDEX idx_component_usage_component_id ON component_usage(component_id);
CREATE INDEX idx_component_usage_user_id ON component_usage(user_id);
CREATE INDEX idx_component_usage_execution_id ON component_usage(execution_id);
CREATE INDEX idx_component_usage_created_at ON component_usage(created_at);
CREATE INDEX idx_component_usage_success ON component_usage(success);

CREATE INDEX idx_component_dependencies_component_id ON component_dependencies(component_id);
CREATE INDEX idx_component_dependencies_depends_on ON component_dependencies(depends_on_component_id);

-- Add comments for documentation
COMMENT ON TABLE component_registry IS 'Registry of available components for the Abstract Component System';
COMMENT ON TABLE component_input_channels IS 'Input channel definitions for components';
COMMENT ON TABLE component_output_channels IS 'Output channel definitions for components';
COMMENT ON TABLE component_usage IS 'Usage tracking and analytics for components';
COMMENT ON TABLE component_dependencies IS 'Dependency relationships between components';

COMMENT ON COLUMN component_registry.component_id IS 'Unique identifier for the component (e.g., get-frames-from-video)';
COMMENT ON COLUMN component_registry.category IS 'Component category (e.g., video-processing, image-generation)';
COMMENT ON COLUMN component_registry.tags IS 'Array of tags for searching and filtering';
COMMENT ON COLUMN component_registry.credit_cost IS 'Credit cost for using this component';
COMMENT ON COLUMN component_registry.estimated_processing_time IS 'Estimated processing time in seconds';

COMMENT ON COLUMN component_input_channels.type IS 'ComponentInputType constant for type safety';
COMMENT ON COLUMN component_input_channels.position IS 'Processing order (0-based) for input channels';
COMMENT ON COLUMN component_input_channels.validation_rules IS 'JSON validation rules for the input channel';

COMMENT ON COLUMN component_output_channels.type IS 'ComponentInputType constant for type safety';
COMMENT ON COLUMN component_output_channels.metadata IS 'Format and quality metadata for the output';

COMMENT ON COLUMN component_usage.execution_id IS 'Workflow execution identifier for tracking';
COMMENT ON COLUMN component_usage.input_data IS 'Input parameters used in the execution';
COMMENT ON COLUMN component_usage.output_data IS 'Output results from the execution';

COMMENT ON COLUMN component_dependencies.dependency_type IS 'Type of dependency: required, optional, conflicts';
COMMENT ON COLUMN component_dependencies.description IS 'Explanation of why this dependency exists';
