import axios from 'axios';

// Import types from our search service
export interface SearchResult {
  id: string;
  type: 'citizen' | 'application' | 'organization' | 'service';
  title: string;
  subtitle?: string;
  highlight?: string;
  url: string;
  score?: number;
  data?: any;
}

export interface SearchOptions {
  filters?: {
    field: string;
    value: any;
    operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'range';
  }[];
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  page?: number;
  limit?: number;
  highlight?: boolean;
  fuzzy?: boolean;
  fields?: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  aggregations?: any;
}

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Search API Client for frontend components
 */
class SearchAPI {
  /**
   * Search across all indexed data
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    try {
      const response = await axios.post(`${API_URL}/search`, {
        query,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error performing search:', error);
      return { results: [], total: 0 };
    }
  }

  /**
   * Get quick suggestions for search autocomplete
   */
  async getSuggestions(
    query: string, 
    types: ('citizens' | 'applications' | 'organizations')[] = ['citizens', 'applications', 'organizations'],
    limit: number = 5
  ): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${API_URL}/search/suggestions`, {
        params: { query, types: types.join(','), limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  /**
   * Search for a citizen by National ID Number (NIN)
   */
  async searchByNIN(nin: string): Promise<SearchResult | null> {
    try {
      const response = await axios.get(`${API_URL}/search/nin/${nin}`);
      return response.data;
    } catch (error) {
      console.error('Error searching by NIN:', error);
      return null;
    }
  }

  /**
   * Search based on role permissions
   * This method automatically filters results based on user's role
   */
  async roleSearch(query: string, role: string, options: SearchOptions = {}): Promise<SearchResponse> {
    try {
      const response = await axios.post(`${API_URL}/search/role`, {
        query,
        role,
        options
      });
      return response.data;
    } catch (error) {
      console.error('Error performing role-based search:', error);
      return { results: [], total: 0 };
    }
  }
}

// Create and export a singleton instance
const searchAPI = new SearchAPI();
export default searchAPI;
