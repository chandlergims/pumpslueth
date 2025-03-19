// API functions for bounties

interface BountyData {
  title: string;
  description: string;
  imageUrl?: string;
  creator: string;
  bountyAmount: number;
  status?: 'open' | 'solved' | 'closed';
}

interface GetBountiesParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: string;
  creator?: string;
}

interface SolutionData {
  solver: string;
  solutionDetails: string;
  imageUrls?: string[];
}

export async function getBounties(params: GetBountiesParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.status) queryParams.append('status', params.status);
  if (params.creator) queryParams.append('creator', params.creator);
  
  // Add cache-busting timestamp to prevent caching
  queryParams.append('_t', Date.now().toString());
  
  const response = await fetch(`/api/bounties?${queryParams.toString()}`, {
    // Add cache: 'no-store' to prevent browser caching
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch bounties');
  }
  
  return response.json();
}

export async function createBounty(data: BountyData) {
  const response = await fetch('/api/bounties/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create bounty');
  }
  
  return response.json();
}

export async function getBounty(id: string) {
  const response = await fetch(`/api/bounties/${id}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch bounty');
  }
  
  return response.json();
}

export async function submitSolution(id: string, data: SolutionData) {
  const response = await fetch(`/api/bounties/${id}/solve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit solution');
  }
  
  return response.json();
}

export async function acceptSolution(id: string, data: {
  solutionId: string;
  creator: string;
}) {
  const response = await fetch(`/api/bounties/${id}/solve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to accept solution');
  }
  
  return response.json();
}

export async function incrementViews(id: string) {
  const response = await fetch(`/api/bounties/${id}/view`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    console.error('Failed to increment views');
  }
  
  return response.json();
}

export async function voteSolution(id: string, solutionId: string, voter: string) {
  const response = await fetch(`/api/bounties/${id}/solutions/${solutionId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voter }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to vote for solution');
  }
  
  return response.json();
}
