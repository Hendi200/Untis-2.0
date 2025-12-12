// Simple API wrapper for JSONBlob.com to enable serverless syncing

const BASE_URL = 'https://jsonblob.com/api/jsonBlob';

export const cloudApi = {
  // Create a new storage slot
  createSession: async (data: any): Promise<string> => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      // The location header contains the URL to the new blob
      const location = response.headers.get('Location');
      // Extract just the ID from the end of the URL
      const id = location?.split('/').pop();
      
      if (!id) throw new Error('No ID returned');
      return id;
    } catch (error) {
      console.error('Error creating cloud session:', error);
      throw error;
    }
  },

  // Update existing slot
  updateSession: async (id: string, data: any): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating cloud session:', error);
      throw error;
    }
  },

  // Get data
  fetchSession: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Session not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cloud session:', error);
      throw error;
    }
  }
};