import { Request, Response } from 'express';
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    nid: string;
    role?: string;
    organizationId?: string;
  };
}
import searchService from '../services/searchService';

/**
 * Search Controller for handling search-related API endpoints
 */
class SearchController {
  /**
   * Perform a search across all indexed data
   */
  public async search(req: Request, res: Response): Promise<void> {
    try {
      const { query, options } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }
      
      const results = await searchService.search(query, options || {});
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'An error occurred while searching' });
    }
  }
  
  /**
   * Get autocomplete suggestions based on partial query
   */
  public async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { query, types, limit } = req.query;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }
      
      // Parse types if provided
      let typesArray: ('citizens' | 'applications' | 'organizations')[] = ['citizens', 'applications', 'organizations'];
      if (types && typeof types === 'string') {
        typesArray = types.split(',') as any[];
      }
      
      // Parse limit if provided
      const limitNum = limit && typeof limit === 'string' ? parseInt(limit, 10) : 5;
      
      const suggestions = await searchService.getSuggestions(query, typesArray, limitNum);
      res.json(suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: 'An error occurred while getting suggestions' });
    }
  }
  
  /**
   * Search for a citizen by NIN (National ID Number)
   */
  public async searchByNIN(req: Request, res: Response): Promise<void> {
    try {
      const { nin } = req.params;
      
      if (!nin) {
        res.status(400).json({ error: 'NIN is required' });
        return;
      }
      
      const citizen = await searchService.searchByNIN(nin);
      
      if (!citizen) {
        res.status(404).json({ error: 'Citizen not found' });
        return;
      }
      
      res.json(citizen);
    } catch (error) {
      console.error('NIN search error:', error);
      res.status(500).json({ error: 'An error occurred while searching by NIN' });
    }
  }
  
  /**
   * Role-based search that filters results based on user role
   */
  public async roleSearch(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { query, role, options } = req.body;
      
      if (!query) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }
      
      if (!role) {
        res.status(400).json({ error: 'User role is required' });
        return;
      }
      
      // Base search options
      const searchOptions = { ...options };
      
      // Apply role-based filters
      switch (role) {
        case 'admin':
          // Admins can see everything
          break;
        
        case 'organization_admin':
          // Organization admins can only see their organization's data
          // In a real implementation, we would get the organization ID from the authenticated user
          const orgId = req.user?.organizationId;
          if (orgId) {
            if (!searchOptions.filters) searchOptions.filters = [];
            searchOptions.filters.push({
              field: 'organizationId',
              value: orgId
            });
          }
          break;
        
        case 'organization_staff':
          // Staff can only see their organization's public data
          const staffOrgId = req.user?.organizationId;
          if (staffOrgId) {
            if (!searchOptions.filters) searchOptions.filters = [];
            searchOptions.filters.push({
              field: 'organizationId',
              value: staffOrgId
            });
          }
          break;
          
        case 'citizen':
          // Citizens can only see their own data
          const citizenId = req.user?.id;
          if (citizenId) {
            if (!searchOptions.filters) searchOptions.filters = [];
            searchOptions.filters.push({
              field: 'citizenId',
              value: citizenId
            });
          }
          break;
          
        default:
          // Public users can only search public information
          if (!searchOptions.filters) searchOptions.filters = [];
          searchOptions.filters.push({
            field: 'isPublic',
            value: true
          });
          break;
      }
      
      const results = await searchService.search(query, searchOptions);
      res.json(results);
    } catch (error) {
      console.error('Role search error:', error);
      res.status(500).json({ error: 'An error occurred while performing role-based search' });
    }
  }
  
  /**
   * Check search service health
   */
  public async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const health = await searchService.checkHealth();
      res.json(health);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({ error: 'Search service is not available' });
    }
  }
}

export default new SearchController();
