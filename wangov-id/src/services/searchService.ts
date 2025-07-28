// import { Client } from '@opensearch-project/opensearch';
// TODO: Install OpenSearch dependency for production
type Client = any;

/**
 * Search result type for OpenSearch responses
 */
export interface SearchResult {
  id: string;
  type: 'citizen' | 'application' | 'organization' | 'service';
  title: string;
  subtitle?: string;
  highlight?: string;
  url: string;
  score?: number;
  data?: any; // Full data object
}

/**
 * Search options for advanced queries
 */
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

/**
 * Mapping configuration for different entity types
 */
const INDEX_MAPPINGS = {
  citizens: {
    properties: {
      id: { type: 'keyword' },
      nin: { type: 'keyword' },
      firstName: { 
        type: 'text',
        analyzer: 'standard',
        fields: { 
          keyword: { type: 'keyword' },
          completion: { type: 'completion' }
        }
      },
      lastName: { 
        type: 'text',
        analyzer: 'standard',
        fields: { 
          keyword: { type: 'keyword' },
          completion: { type: 'completion' }
        }
      },
      email: { type: 'keyword' },
      phone: { type: 'keyword' },
      dateOfBirth: { type: 'date' },
      gender: { type: 'keyword' },
      address: { type: 'text' },
      district: { type: 'keyword' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      documents: {
        type: 'nested',
        properties: {
          id: { type: 'keyword' },
          type: { type: 'keyword' },
          number: { type: 'keyword' },
          issuedDate: { type: 'date' },
          expiryDate: { type: 'date' },
          status: { type: 'keyword' }
        }
      }
    }
  },
  applications: {
    properties: {
      id: { type: 'keyword' },
      citizenId: { type: 'keyword' },
      type: { type: 'keyword' },
      serviceId: { type: 'keyword' },
      serviceName: { 
        type: 'text',
        fields: { 
          keyword: { type: 'keyword' }
        }
      },
      organizationId: { type: 'keyword' },
      organizationName: { 
        type: 'text',
        fields: { 
          keyword: { type: 'keyword' }
        }
      },
      status: { type: 'keyword' },
      submittedAt: { type: 'date' },
      updatedAt: { type: 'date' },
      completedAt: { type: 'date' }
    }
  },
  organizations: {
    properties: {
      id: { type: 'keyword' },
      name: { 
        type: 'text',
        analyzer: 'standard',
        fields: { 
          keyword: { type: 'keyword' },
          completion: { type: 'completion' }
        }
      },
      type: { type: 'keyword' },
      email: { type: 'keyword' },
      phone: { type: 'keyword' },
      address: { type: 'text' },
      district: { type: 'keyword' },
      website: { type: 'keyword' },
      services: {
        type: 'nested',
        properties: {
          id: { type: 'keyword' },
          name: { 
            type: 'text',
            fields: { 
              keyword: { type: 'keyword' },
              completion: { type: 'completion' }
            }
          },
          description: { type: 'text' },
          category: { type: 'keyword' }
        }
      }
    }
  }
};

/**
 * OpenSearch service for WanGov platform
 */
class SearchService {
  private client: Client;
  private indices = {
    citizens: 'wangov-citizens',
    applications: 'wangov-applications',
    organizations: 'wangov-organizations'
  };

  constructor() {
    // Mock OpenSearch client for deployment
    // TODO: Replace with actual OpenSearch client when dependency is installed
    this.client = {
      search: async () => ({ body: { hits: { hits: [] } } }),
      index: async () => ({ body: { result: 'created' } }),
      delete: async () => ({ body: { result: 'deleted' } })
    } as any;
    
    // Initialize indices if they don't exist (optional for deployment)
    this.initializeIndices().catch(error => {
      console.warn('OpenSearch initialization failed (using mock client):', error.message);
    });
  }

  /**
   * Initialize OpenSearch indices with mappings if they don't exist
   */
  public async initializeIndices(): Promise<void> {
    try {
      // Skip initialization if using mock client
      if (!this.client.indices) {
        console.log('Using mock OpenSearch client - skipping index initialization');
        return;
      }
      
      // Check and create each index with proper mappings
      for (const [type, indexName] of Object.entries(this.indices)) {
        const exists = await this.client.indices.exists({ index: indexName });
        
        if (!exists.body) {
          await this.client.indices.create({
            index: indexName,
            body: {
              mappings: INDEX_MAPPINGS[type as keyof typeof INDEX_MAPPINGS]
            }
          });
          console.log(`Created index: ${indexName}`);
        }
      }
    } catch (error) {
      console.error('Error initializing OpenSearch indices:', error);
      throw error;
    }
  }

  /**
   * Index a single citizen document
   */
  public async indexCitizen(citizen: any): Promise<void> {
    try {
      await this.client.index({
        index: this.indices.citizens,
        id: citizen.id,
        body: citizen,
        refresh: true // Ensure document is immediately searchable
      });
    } catch (error) {
      console.error('Error indexing citizen:', error);
      throw error;
    }
  }

  /**
   * Index a single application document
   */
  public async indexApplication(application: any): Promise<void> {
    try {
      await this.client.index({
        index: this.indices.applications,
        id: application.id,
        body: application,
        refresh: true
      });
    } catch (error) {
      console.error('Error indexing application:', error);
      throw error;
    }
  }

  /**
   * Index a single organization document
   */
  public async indexOrganization(organization: any): Promise<void> {
    try {
      await this.client.index({
        index: this.indices.organizations,
        id: organization.id,
        body: organization,
        refresh: true
      });
    } catch (error) {
      console.error('Error indexing organization:', error);
      throw error;
    }
  }

  /**
   * Bulk index multiple documents of the same type
   */
  public async bulkIndex(type: 'citizens' | 'applications' | 'organizations', documents: any[]): Promise<void> {
    try {
      if (!documents.length) return;
      
      const operations = documents.flatMap(doc => [
        { index: { _index: this.indices[type], _id: doc.id } },
        doc
      ]);
      
      await this.client.bulk({
        refresh: true,
        body: operations
      });
    } catch (error) {
      console.error(`Error bulk indexing ${type}:`, error);
      throw error;
    }
  }

  /**
   * Search across multiple indices based on query and options
   */
  public async search(query: string, options: SearchOptions = {}): Promise<{
    results: SearchResult[];
    total: number;
    aggregations?: any;
  }> {
    try {
      const {
        filters = [],
        sort,
        page = 1,
        limit = 10,
        highlight = true,
        fuzzy = true,
        fields
      } = options;
      
      // Build search body
      const body: any = {
        query: {
          bool: {
            should: [
              // Main query with fuzzy matching if enabled
              {
                multi_match: {
                  query,
                  fields: fields || [
                    'firstName^3', 'lastName^3', 'nin^4',
                    'serviceName^2', 'organizationName^2',
                    'name^3', 'email', 'phone', 'address'
                  ],
                  fuzziness: fuzzy ? 'AUTO' : 0
                }
              },
              // Exact match on important fields gets a boost
              {
                multi_match: {
                  query,
                  fields: ['nin^5', 'id^5', 'firstName.keyword^4', 'lastName.keyword^4'],
                  type: 'phrase'
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        from: (page - 1) * limit,
        size: limit,
        _source: true
      };
      
      // Add filters if provided
      if (filters.length > 0) {
        body.query.bool.filter = filters.map(filter => {
          if (filter.operator === 'range') {
            return {
              range: {
                [filter.field]: filter.value
              }
            };
          }
          
          return {
            term: {
              [filter.field]: filter.value
            }
          };
        });
      }
      
      // Add sorting if provided
      if (sort) {
        body.sort = [
          { [sort.field]: { order: sort.order } },
          '_score'
        ];
      }
      
      // Add highlighting if enabled
      if (highlight) {
        body.highlight = {
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
          fields: {
            '*': {}
          }
        };
      }
      
      // Add aggregations for faceted search
      body.aggs = {
        types: {
          terms: {
            field: 'type.keyword'
          }
        },
        organizations: {
          terms: {
            field: 'organizationName.keyword',
            size: 10
          }
        },
        status: {
          terms: {
            field: 'status.keyword',
            size: 10
          }
        }
      };
      
      // Search across all indices
      const response = await this.client.search({
        index: Object.values(this.indices).join(','),
        body
      });
      
      // Format search results
      const hits = response.body.hits.hits;
      const results: SearchResult[] = hits.map((hit: any) => {
        const source = hit._source;
        const type = this.determineDocumentType(hit._index);
        
        // Create appropriate result object based on document type
        let result: SearchResult = {
          id: source.id,
          type: type as any,
          title: this.getDocumentTitle(source, type) as string,
          subtitle: this.getDocumentSubtitle(source, type),
          url: this.getDocumentUrl(source, type),
          score: hit._score,
          data: source
        };
        
        // Add highlights if available
        if (highlight && hit.highlight) {
          const highlightFields = Object.values(hit.highlight).flat();
          if (highlightFields.length > 0) {
            result.highlight = highlightFields[0] as string;
          }
        }
        
        return result;
      });
      
      return {
        results,
        total: response.body.hits.total.value,
        aggregations: response.body.aggregations
      };
    } catch (error) {
      console.error('Error performing search:', error);
      throw error;
    }
  }
  
  /**
   * Get search suggestions for autocomplete
   */
  public async getSuggestions(query: string, types: ('citizens' | 'applications' | 'organizations')[] = ['citizens', 'applications', 'organizations'], limit: number = 5): Promise<SearchResult[]> {
    try {
      if (!query.trim()) return [];
      
      const indices = types.map(type => this.indices[type]);
      
      const response = await this.client.search({
        index: indices.join(','),
        body: {
          size: limit,
          query: {
            multi_match: {
              query,
              type: 'bool_prefix',
              fields: [
                'firstName^3', 'lastName^3',
                'nin^4', 'name^3',
                'serviceName^2', 'organizationName^2'
              ]
            }
          },
          _source: ['id', 'nin', 'firstName', 'lastName', 'name', 'type', 'status', 'serviceName', 'organizationName']
        }
      });
      
      return response.body.hits.hits.map((hit: any) => {
        const source = hit._source;
        const type = this.determineDocumentType(hit._index);
        
        return {
          id: source.id,
          type: type as any,
          title: this.getDocumentTitle(source, type) as string,
          subtitle: this.getDocumentSubtitle(source, type),
          url: this.getDocumentUrl(source, type),
          score: hit._score,
          data: source
        };
      });
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }
  
  /**
   * Exact search by NIN (National ID Number)
   */
  public async searchByNIN(nin: string): Promise<SearchResult | null> {
    try {
      const response = await this.client.search({
        index: this.indices.citizens,
        body: {
          query: {
            term: {
              nin: nin
            }
          }
        }
      });
      
      const hits = response.body.hits.hits;
      
      if (hits.length === 0) {
        return null;
      }
      
      const source = hits[0]._source;
      
      return {
        id: source.id,
        type: 'citizen',
        title: `${source.firstName} ${source.lastName}`,
        subtitle: `NIN: ${source.nin}`,
        url: `/admin/citizens/${source.id}`,
        data: source
      };
    } catch (error) {
      console.error('Error searching by NIN:', error);
      return null;
    }
  }
  
  /**
   * Delete document from index
   */
  public async deleteDocument(type: 'citizens' | 'applications' | 'organizations', id: string): Promise<boolean> {
    try {
      await this.client.delete({
        index: this.indices[type],
        id,
        refresh: true
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting ${type} document:`, error);
      return false;
    }
  }
  
  /**
   * Check OpenSearch cluster health
   */
  public async checkHealth(): Promise<any> {
    try {
      const response = await this.client.cluster.health();
      return response.body;
    } catch (error) {
      console.error('Error checking OpenSearch health:', error);
      throw error;
    }
  }
  
  /**
   * Helper: Determine document type from index name
   */
  private determineDocumentType(index: string): string {
    if (index === this.indices.citizens) return 'citizen';
    if (index === this.indices.applications) return 'application';
    if (index === this.indices.organizations) return 'organization';
    return 'unknown';
  }
  
  /**
   * Helper: Get appropriate title for document type
   */
  private getDocumentTitle(source: any, type: string): string {
    switch (type) {
      case 'citizens':
        return `${source.firstName} ${source.lastName}`;
      case 'applications':
        return source.serviceName || `Application #${source.id}`;
      case 'organizations':
        return source.name;
      default:
        return source.name || source.title || `Item #${source.id}`;
    }
  }
  
  /**
   * Helper: Get appropriate subtitle for document type
   */
  private getDocumentSubtitle(source: any, type: string): string {
    switch (type) {
      case 'citizens':
        return `NIN: ${source.nin}`;
      case 'applications':
        return `Status: ${source.status}`;
      case 'organizations':
        return source.type || 'Organization';
      default:
        return '';
    }
  }
  
  /**
   * Helper: Get appropriate URL for document type
   */
  private getDocumentUrl(source: any, type: string): string {
    switch (type) {
      case 'citizens':
        return `/admin/citizens/${source.id}`;
      case 'applications':
        return `/admin/applications/${source.id}`;
      case 'organizations':
        return `/admin/organizations/${source.id}`;
      default:
        return `/search?id=${source.id}`;
    }
  }
}

// Create and export a singleton instance
const searchService = new SearchService();
export default searchService;
