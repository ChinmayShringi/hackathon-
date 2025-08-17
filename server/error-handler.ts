interface ErrorCategory {
  category: string;
  userMessage: string;
  shouldRefund: boolean;
  shouldRetry: boolean;
  technicalMessage?: string;
}

interface FailureAnalysis {
  category: ErrorCategory;
  originalError: any;
  generationId?: number;
  userId?: string;
}

export class ErrorHandler {
  private static errorCategories: Record<string, ErrorCategory> = {
    // API Key / Authentication Issues
    API_KEY_INVALID: {
      category: 'authentication',
      userMessage: 'There was an issue with our AI service connection. Our team has been notified and will resolve this quickly.',
      shouldRefund: true,
      shouldRetry: false,
      technicalMessage: 'Invalid API key or authentication failed'
    },
    API_KEY_QUOTA: {
      category: 'quota',
      userMessage: 'Our AI service is temporarily at capacity. We\'ve added your request to priority processing and will complete it soon.',
      shouldRefund: false,
      shouldRetry: true,
      technicalMessage: 'API quota exceeded'
    },

    // Content Policy Issues
    CONTENT_POLICY: {
      category: 'content',
      userMessage: 'Your prompt couldn\'t be processed due to content guidelines. Please try rephrasing with different words.',
      shouldRefund: true,
      shouldRetry: false,
      technicalMessage: 'Content violates AI service policies'
    },
    NSFW_CONTENT: {
      category: 'content',
      userMessage: 'Your request contains content that isn\'t supported. Please modify your prompt and try again.',
      shouldRefund: true,
      shouldRetry: false,
      technicalMessage: 'NSFW or inappropriate content detected'
    },

    // Technical Issues
    NETWORK_ERROR: {
      category: 'network',
      userMessage: 'There was a temporary connection issue. We\'re retrying your request automatically.',
      shouldRefund: false,
      shouldRetry: true,
      technicalMessage: 'Network connectivity problem'
    },
    SERVICE_UNAVAILABLE: {
      category: 'service',
      userMessage: 'Our AI service is temporarily unavailable. We\'ll process your request as soon as it\'s back online.',
      shouldRefund: false,
      shouldRetry: true,
      technicalMessage: 'External service unavailable'
    },
    TIMEOUT: {
      category: 'timeout',
      userMessage: 'Your request took longer than expected to process. We\'re trying again with optimized settings.',
      shouldRefund: false,
      shouldRetry: true,
      technicalMessage: 'Request timeout'
    },

    // Input Issues
    INVALID_PROMPT: {
      category: 'input',
      userMessage: 'There was an issue with your prompt format. Please try simplifying or rephrasing your request.',
      shouldRefund: true,
      shouldRetry: false,
      technicalMessage: 'Invalid prompt or parameters'
    },
    PROMPT_TOO_LONG: {
      category: 'input',
      userMessage: 'Your prompt is too detailed. Please try shortening it and focus on the key elements you want.',
      shouldRefund: true,
      shouldRetry: false,
      technicalMessage: 'Prompt exceeds length limits'
    },

    // System Issues
    STORAGE_ERROR: {
      category: 'storage',
      userMessage: 'There was an issue saving your generated content. Our team is looking into this and will resolve it quickly.',
      shouldRefund: true,
      shouldRetry: true,
      technicalMessage: 'File storage or database error'
    },
    UNKNOWN_ERROR: {
      category: 'unknown',
      userMessage: 'Something unexpected happened. We\'ve been notified and are working on a fix. Your credits have been refunded.',
      shouldRefund: true,
      shouldRetry: true,
      technicalMessage: 'Unclassified error'
    }
  };

  static analyzeError(error: any, context?: any): FailureAnalysis {
    const errorString = error?.message || error?.toString() || '';
    const errorCode = error?.code || error?.type || '';
    
    let category: ErrorCategory;

    // OpenAI specific errors
    if (errorString.includes('Missing required parameter') || errorString.includes('tools[0].function')) {
      category = this.errorCategories.INVALID_PROMPT;
    }
    // API Key issues
    else if (errorString.includes('Incorrect API key') || errorString.includes('invalid_api_key')) {
      category = this.errorCategories.API_KEY_INVALID;
    }
    // Quota/Rate limiting
    else if (errorString.includes('quota') || errorString.includes('rate_limit') || errorCode === 'rate_limit_exceeded') {
      category = this.errorCategories.API_KEY_QUOTA;
    }
    // Content policy violations
    else if (errorString.includes('content_policy') || errorString.includes('safety') || errorString.includes('inappropriate')) {
      category = this.errorCategories.CONTENT_POLICY;
    }
    // Network issues
    else if (errorString.includes('ECONNRESET') || errorString.includes('ENOTFOUND') || errorString.includes('timeout')) {
      category = this.errorCategories.NETWORK_ERROR;
    }
    // Service unavailable
    else if (errorCode === 'service_unavailable' || errorString.includes('503')) {
      category = this.errorCategories.SERVICE_UNAVAILABLE;
    }
    // Unknown/Generic
    else {
      category = this.errorCategories.UNKNOWN_ERROR;
    }

    return {
      category,
      originalError: error,
      generationId: context?.generationId,
      userId: context?.userId
    };
  }

  static getUserFriendlyMessage(error: any, context?: any): string {
    const analysis = this.analyzeError(error, context);
    return analysis.category.userMessage;
  }

  static shouldRefundCredits(error: any, context?: any): boolean {
    const analysis = this.analyzeError(error, context);
    return analysis.category.shouldRefund;
  }

  static shouldRetry(error: any, context?: any): boolean {
    const analysis = this.analyzeError(error, context);
    return analysis.category.shouldRetry;
  }

  static formatTechnicalDetails(error: any): any {
    return {
      message: error?.message || 'Unknown error',
      code: error?.code || null,
      type: error?.type || null,
      status: error?.status || null,
      timestamp: new Date().toISOString(),
      stack: error?.stack?.split('\n').slice(0, 5).join('\n') || null // First 5 lines only
    };
  }
}