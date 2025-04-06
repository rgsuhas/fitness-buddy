/**
 * API Logger utility for consistent logging of API requests and responses
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  method: string;
  url: string;
  status?: number;
  duration?: number;
  error?: Error | unknown;
}

/**
 * Logs API requests and responses in a consistent format
 */
export const apiLogger = {
  /**
   * Log an API request
   */
  request: (method: string, url: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] 🔹 ${method} ${url} - Request received`);
    return Date.now(); // Return start time for duration calculation
  },

  /**
   * Log an API response
   */
  response: (options: LogOptions) => {
    const { method, url, status = 200, duration = 0 } = options;
    const timestamp = new Date().toISOString();
    
    // Format the log message similar to Next.js built-in logs
    console.log(`[${timestamp}] ✅ ${method} ${url} ${status} in ${duration}ms`);
  },

  /**
   * Log an API error
   */
  error: (options: LogOptions) => {
    const { method, url, status = 500, error } = options;
    const timestamp = new Date().toISOString();
    
    console.error(`[${timestamp}] ❌ ${method} ${url} ${status} - Error:`, error);
  },

  /**
   * Create a wrapper for API route handlers to automatically log requests and responses
   */
  withLogging: <T extends (...args: any[]) => Promise<Response>>(handler: T) => {
    return async (...args: Parameters<T>): Promise<Response> => {
      const request = args[0] as Request;
      const method = request.method;
      const url = new URL(request.url).pathname;
      
      const startTime = apiLogger.request(method, url);
      
      try {
        const response = await handler(...args);
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        apiLogger.response({
          method,
          url,
          status: response.status,
          duration
        });
        
        return response;
      } catch (error) {
        apiLogger.error({
          method,
          url,
          error
        });
        throw error;
      }
    };
  }
};
