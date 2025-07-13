// RTVI Connection Testing Utilities
export async function testRTVIConnection(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/health`);
    return response.ok;
  } catch (error) {
    console.error('RTVI connection test failed:', error);
    return false;
  }
}

export async function validateRTVIEndpoint(baseUrl: string): Promise<{
  isHealthy: boolean;
  version?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`${baseUrl}/health`);
    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        isHealthy: true,
        version: data.version || 'unknown'
      };
    }
    return {
      isHealthy: false,
      error: `HTTP ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}