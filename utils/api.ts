// Simple API wrapper for JSONBlob.com to enable serverless syncing

const BASE_URL = 'https://jsonblob.com/api/jsonBlob';

// Helper for default fetch options to bypass common browser restrictions
const getOptions = (method: string, body?: any) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*', // Accept anything to be less strict
  },
  body: body ? JSON.stringify(body) : undefined,
  referrerPolicy: 'no-referrer' as const, // Prevents sending referrer which some firewalls block
  credentials: 'omit' as const, // Don't send cookies
  mode: 'cors' as const,
});

export const cloudApi = {
  // Create a new storage slot
  createSession: async (data: any): Promise<string> => {
    try {
      const response = await fetch(BASE_URL, getOptions('POST', data));

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      
      // Attempt 1: Get ID from Location header (standard)
      let id = response.headers.get('Location')?.split('/').pop() || response.headers.get('location')?.split('/').pop();
      
      // Attempt 2: If header is missing (CORS issues), check if response was a redirect/has URL
      if (!id && response.url && response.url.includes('/jsonBlob/')) {
         id = response.url.split('/').pop();
      }

      // Attempt 3: Check x-jsonblob header if available
      if (!id) {
         id = response.headers.get('x-jsonblob');
      }
      
      if (!id) throw new Error('Could not retrieve Sync-ID from server. (Header missing or blocked)');
      
      return id;
    } catch (error) {
      console.error('Error creating cloud session:', error);
      throw error;
    }
  },

  // Update existing slot
  updateSession: async (id: string, data: any): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/${id}`, getOptions('PUT', data));
    } catch (error) {
      console.error('Error updating cloud session:', error);
      throw error;
    }
  },

  // Get data
  fetchSession: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, getOptions('GET'));

      if (!response.ok) throw new Error('Session not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cloud session:', error);
      throw error;
    }
  }
};