import api from './api';
import { Property, PaginatedResponse } from '../types';

// API endpoint
const PROPERTIES_ENDPOINT = '/api/properties';

/**
 * Properties service for handling property-related operations
 */
const propertiesService = {
  /**
   * Get all properties with pagination
   */
  async getProperties(skip = 0, limit = 10): Promise<Property[]> {
    const response = await api.get<Property[]>(PROPERTIES_ENDPOINT, {
      params: { skip, limit }
    });
    return response.data;
  },

  /**
   * Get a property by ID
   */
  async getProperty(id: string): Promise<Property> {
    const response = await api.get<Property>(`${PROPERTIES_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new property
   */
  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'document_ids'>): Promise<Property> {
    const response = await api.post<Property>(PROPERTIES_ENDPOINT, propertyData);
    return response.data;
  },

  /**
   * Update a property
   */
  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    const response = await api.put<Property>(`${PROPERTIES_ENDPOINT}/${id}`, propertyData);
    return response.data;
  },

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`${PROPERTIES_ENDPOINT}/${id}`);
  },

  /**
   * Get property statistics
   */
  async getPropertyStats(): Promise<{
    totalProperties: number;
    totalValue: number;
    averageCapRate: number;
  }> {
    // This would be a real endpoint in a full implementation
    // For now, we'll calculate stats from the properties list
    const properties = await this.getProperties(0, 100);
    
    const totalProperties = properties.length;
    let totalValue = 0;
    let totalCapRate = 0;
    let propertiesWithCapRate = 0;
    
    properties.forEach(property => {
      if (property.financial_metrics.property_value) {
        totalValue += property.financial_metrics.property_value;
      }
      
      if (property.financial_metrics.cap_rate) {
        totalCapRate += property.financial_metrics.cap_rate;
        propertiesWithCapRate++;
      }
    });
    
    return {
      totalProperties,
      totalValue,
      averageCapRate: propertiesWithCapRate > 0 ? totalCapRate / propertiesWithCapRate : 0
    };
  }
};

export default propertiesService;
