import { Component, InputChannel, OutputChannel } from './component-system';
import { ComponentInputType } from './component-types';

/**
 * Connection between components in a workflow
 */
export interface ComponentConnection {
  /** Source component ID */
  fromComponent: string;
  
  /** Source output channel ID */
  fromChannel: string;
  
  /** Target component ID */
  toComponent: string;
  
  /** Target input channel ID */
  toChannel: string;
}

/**
 * Workflow definition
 */
export interface Workflow {
  /** Unique identifier for the workflow */
  id: string;
  
  /** Human-readable name for the workflow */
  name: string;
  
  /** Description of what the workflow does */
  description?: string;
  
  /** Components in the workflow */
  components: Component[];
  
  /** Connections between components */
  connections: ComponentConnection[];
  
  /** Workflow metadata */
  metadata?: {
    version?: string;
    author?: string;
    tags?: string[];
    estimatedCost?: number;
    estimatedTime?: number;
    [key: string]: any;
  };
}

/**
 * Workflow execution result
 */
export interface WorkflowResult {
  /** Workflow execution ID */
  executionId: string;
  
  /** Status of the execution */
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  
  /** Results from each component */
  componentResults: Map<string, any>;
  
  /** Final outputs from the workflow */
  finalOutputs: Record<string, any>;
  
  /** Execution metadata */
  metadata: {
    startTime: Date;
    endTime?: Date;
    duration?: number;
    totalCost: number;
    errors: string[];
    [key: string]: any;
  };
}

/**
 * Workflow Engine
 * 
 * Executes workflows composed of components by managing data flow between them.
 * Ensures inputs are processed in the correct order and handles component dependencies.
 */
export class WorkflowEngine {
  private executionCounter = 0;
  
  /**
   * Execute a workflow with the given inputs
   * @param workflow - The workflow to execute
   * @param initialInputs - Initial inputs for the workflow
   * @returns Promise resolving to workflow execution result
   */
  async executeWorkflow(workflow: Workflow, initialInputs: Record<string, any> = {}): Promise<WorkflowResult> {
    const executionId = `workflow_${++this.executionCounter}_${Date.now()}`;
    const startTime = new Date();
    
    console.log(`🚀 Starting workflow execution: ${workflow.name} (${executionId})`);
    
    try {
      // Validate workflow
      this.validateWorkflow(workflow);
      
      // Create execution context
      const context = new WorkflowExecutionContext(workflow, initialInputs);
      
      // Execute workflow
      const result = await this.executeWorkflowInternal(context);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.log(`✅ Workflow completed successfully in ${duration}ms`);
      
      return {
        executionId,
        status: 'completed',
        componentResults: context.componentResults,
        finalOutputs: context.getFinalOutputs(),
        metadata: {
          startTime,
          endTime,
          duration,
          totalCost: this.calculateTotalCost(workflow),
          errors: []
        }
      };
      
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      console.error(`❌ Workflow execution failed:`, error);
      
      return {
        executionId,
        status: 'failed',
        componentResults: new Map(),
        finalOutputs: {},
        metadata: {
          startTime,
          endTime,
          duration,
          totalCost: 0,
          errors: [error instanceof Error ? error.message : String(error)]
        }
      };
    }
  }
  
  /**
   * Validate workflow structure and connections
   */
  private validateWorkflow(workflow: Workflow): void {
    // Check for duplicate component IDs
    const componentIds = workflow.components.map(c => c.id);
    const uniqueIds = new Set(componentIds);
    if (componentIds.length !== uniqueIds.size) {
      throw new Error('Workflow contains duplicate component IDs');
    }
    
    // Check for duplicate connection IDs
    const connectionIds = workflow.connections.map(c => `${c.fromComponent}:${c.fromChannel}->${c.toComponent}:${c.toChannel}`);
    const uniqueConnections = new Set(connectionIds);
    if (connectionIds.length !== uniqueConnections.size) {
      throw new Error('Workflow contains duplicate connections');
    }
    
    // Validate connections reference valid components and channels
    for (const connection of workflow.connections) {
      const fromComponent = workflow.components.find(c => c.id === connection.fromComponent);
      const toComponent = workflow.components.find(c => c.id === connection.toComponent);
      
      if (!fromComponent) {
        throw new Error(`Connection references non-existent source component: ${connection.fromComponent}`);
      }
      
      if (!toComponent) {
        throw new Error(`Connection references non-existent target component: ${connection.toComponent}`);
      }
      
      const fromChannel = fromComponent.outputChannels.find(c => c.id === connection.fromChannel);
      const toChannel = toComponent.inputChannels.find(c => c.id === connection.toChannel);
      
      if (!fromChannel) {
        throw new Error(`Connection references non-existent source channel: ${connection.fromComponent}:${connection.fromChannel}`);
      }
      
      if (!toChannel) {
        throw new Error(`Connection references non-existent target channel: ${connection.toComponent}:${connection.toChannel}`);
      }
      
      // Check type compatibility
      if (fromChannel.type !== toChannel.type) {
        throw new Error(`Type mismatch in connection: ${connection.fromComponent}:${connection.fromChannel} (${ComponentInputType.getTypeName(fromChannel.type)}) -> ${connection.toComponent}:${connection.toChannel} (${ComponentInputType.getTypeName(toChannel.type)})`);
      }
    }
    
    // Check for cycles (simplified check)
    if (this.hasCycles(workflow)) {
      throw new Error('Workflow contains cycles which are not supported');
    }
  }
  
  /**
   * Check if workflow has cycles (simplified implementation)
   */
  private hasCycles(workflow: Workflow): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycleDFS = (componentId: string): boolean => {
      if (recursionStack.has(componentId)) return true;
      if (visited.has(componentId)) return false;
      
      visited.add(componentId);
      recursionStack.add(componentId);
      
      const outgoingConnections = workflow.connections.filter(c => c.fromComponent === componentId);
      for (const connection of outgoingConnections) {
        if (hasCycleDFS(connection.toComponent)) return true;
      }
      
      recursionStack.delete(componentId);
      return false;
    };
    
    for (const component of workflow.components) {
      if (!visited.has(component.id)) {
        if (hasCycleDFS(component.id)) return true;
      }
    }
    
    return false;
  }
  
  /**
   * Execute workflow internally
   */
  private async executeWorkflowInternal(context: WorkflowExecutionContext): Promise<void> {
    // Get execution order (topological sort)
    const executionOrder = this.getExecutionOrder(context.workflow);
    
    console.log(`📋 Execution order: ${executionOrder.map(id => context.workflow.components.find(c => c.id === id)?.name || id).join(' -> ')}`);
    
    // Execute components in order
    for (const componentId of executionOrder) {
      const component = context.workflow.components.find(c => c.id === componentId)!;
      
      console.log(`⚙️  Executing component: ${component.name} (${component.id})`);
      
      // Collect inputs for this component
      const inputs = this.collectComponentInputs(component, context);
      
      // Execute component
      const outputs = await component.process(inputs);
      
      // Store results
      context.setComponentOutputs(componentId, outputs);
      
      console.log(`✅ Component ${component.name} completed with ${outputs.length} outputs`);
    }
  }
  
  /**
   * Get execution order using topological sort
   */
  private getExecutionOrder(workflow: Workflow): string[] {
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();
    
    // Initialize
    for (const component of workflow.components) {
      inDegree.set(component.id, 0);
      graph.set(component.id, []);
    }
    
    // Build graph and calculate in-degrees
    for (const connection of workflow.connections) {
      const fromId = connection.fromComponent;
      const toId = connection.toComponent;
      
      graph.get(fromId)!.push(toId);
      inDegree.set(toId, inDegree.get(toId)! + 1);
    }
    
    // Topological sort
    const queue: string[] = [];
    const result: string[] = [];
    
    // Add components with no dependencies
    for (const [componentId, degree] of Array.from(inDegree.entries())) {
      if (degree === 0) {
        queue.push(componentId);
      }
    }
    
    while (queue.length > 0) {
      const componentId = queue.shift()!;
      result.push(componentId);
      
      // Reduce in-degree for dependent components
      for (const dependentId of graph.get(componentId)!) {
        inDegree.set(dependentId, inDegree.get(dependentId)! - 1);
        if (inDegree.get(dependentId) === 0) {
          queue.push(dependentId);
        }
      }
    }
    
    if (result.length !== workflow.components.length) {
      throw new Error('Workflow has cycles or disconnected components');
    }
    
    return result;
  }
  
  /**
   * Collect inputs for a component from the execution context
   */
  private collectComponentInputs(component: Component, context: WorkflowExecutionContext): any[] {
    const inputs = new Array(component.inputChannels.length);
    
    // Get incoming connections for this component
    const incomingConnections = context.workflow.connections.filter(c => c.toComponent === component.id);
    
    for (const connection of incomingConnections) {
      const inputChannel = component.inputChannels.find(c => c.id === connection.toChannel);
      if (inputChannel) {
        const outputValue = context.getComponentOutput(connection.fromComponent, connection.fromChannel);
        inputs[inputChannel.position] = outputValue;
      }
    }
    
    // Fill in default values for missing inputs
    component.inputChannels.forEach((channel, index) => {
      if (inputs[index] == null && channel.defaultValue != null) {
        inputs[index] = channel.defaultValue;
      }
    });
    
    return inputs;
  }
  
  /**
   * Calculate total cost of workflow
   */
  private calculateTotalCost(workflow: Workflow): number {
    return workflow.components.reduce((total, component) => {
      return total + (component.creditCost || 0);
    }, 0);
  }
}

/**
 * Workflow execution context
 * Manages data flow between components during execution
 */
class WorkflowExecutionContext {
  public componentResults = new Map<string, any[]>();
  
  constructor(
    public workflow: Workflow,
    public initialInputs: Record<string, any>
  ) {}
  
  /**
   * Set outputs for a component
   */
  setComponentOutputs(componentId: string, outputs: any[]): void {
    this.componentResults.set(componentId, outputs);
  }
  
  /**
   * Get output from a specific component and channel
   */
  getComponentOutput(componentId: string, channelId: string): any {
    const outputs = this.componentResults.get(componentId);
    if (!outputs) {
      throw new Error(`No outputs found for component: ${componentId}`);
    }
    
    const component = this.workflow.components.find(c => c.id === componentId);
    if (!component) {
      throw new Error(`Component not found: ${componentId}`);
    }
    
    const channelIndex = component.outputChannels.findIndex(c => c.id === channelId);
    if (channelIndex === -1) {
      throw new Error(`Output channel not found: ${componentId}:${channelId}`);
    }
    
    return outputs[channelIndex];
  }
  
  /**
   * Get final outputs from the workflow
   */
  getFinalOutputs(): Record<string, any> {
    const finalOutputs: Record<string, any> = {};
    
    // Find components with no outgoing connections (final outputs)
    const finalComponents = this.workflow.components.filter(component => {
      return !this.workflow.connections.some(conn => conn.fromComponent === component.id);
    });
    
    for (const component of finalComponents) {
      const outputs = this.componentResults.get(component.id);
      if (outputs) {
        component.outputChannels.forEach((channel, index) => {
          const outputKey = `${component.id}:${channel.id}`;
          finalOutputs[outputKey] = outputs[index];
        });
      }
    }
    
    return finalOutputs;
  }
}
