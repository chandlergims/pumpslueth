/**
 * Utility functions for making API requests
 */

// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Make an authenticated API request
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');

  // Set up headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Make the request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Try to parse the JSON response
  try {
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If JSON parsing fails, it might be HTML or another format
      console.error('Failed to parse response as JSON:', text.substring(0, 100) + '...');
      throw new Error('Invalid response format. Expected JSON.');
    }

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Error processing response:', error);
    throw error;
  }
}

/**
 * Get cards with pagination and sorting
 */
export async function getCards(options: {
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}) {
  const { limit = 10, page = 1, sort = 'votes', order = 'desc' } = options;
  
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sort,
    order,
  });

  return fetchWithAuth(`/api/cards?${queryParams.toString()}`);
}

/**
 * Create a new card
 */
export async function createCard(cardData: {
  title: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string | number | boolean>;
}) {
  return fetchWithAuth('/api/cards/create', {
    method: 'POST',
    body: JSON.stringify(cardData),
  });
}

/**
 * Vote for a card
 */
export async function voteForCard(cardId: string) {
  return fetchWithAuth('/api/cards/vote', {
    method: 'POST',
    body: JSON.stringify({ cardId }),
  });
}
