import { useState, useEffect, useCallback } from 'react';
import propertiesService from '../services/properties';
import { Property } from '../types';

interface UsePropertiesReturn {
  properties: Property[];
  property: Property | null;
  loading: boolean;
  error: string | null;
  stats: {
    totalProperties: number;
    totalValue: number;
    averageCapRate: number;
  } | null;
  fetchProperties: (skip?: number, limit?: number) => Promise<void>;
  fetchProperty: (id: string) => Promise<void>;
  createProperty: (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'document_ids'>) => Promise<Property>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  fetchPropertyStats: () => Promise<void>;
}

export const useProperties = (): UsePropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalProperties: number;
    totalValue: number;
    averageCapRate: number;
  } | null>(null);

  const fetchProperties = useCallback(async (skip = 0, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertiesService.getProperties(skip, limit);
      setProperties(data);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.response?.data?.detail || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProperty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertiesService.getProperty(id);
      setProperty(data);
    } catch (err: any) {
      console.error('Error fetching property:', err);
      setError(err.response?.data?.detail || 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProperty = useCallback(async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'document_ids'>) => {
    setLoading(true);
    setError(null);
    try {
      const newProperty = await propertiesService.createProperty(propertyData);
      setProperties(prev => [...prev, newProperty]);
      return newProperty;
    } catch (err: any) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.detail || 'Failed to create property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProperty = useCallback(async (id: string, propertyData: Partial<Property>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProperty = await propertiesService.updateProperty(id, propertyData);
      setProperties(prev => 
        prev.map(p => p.id === id ? updatedProperty : p)
      );
      if (property && property.id === id) {
        setProperty(updatedProperty);
      }
      return updatedProperty;
    } catch (err: any) {
      console.error('Error updating property:', err);
      setError(err.response?.data?.detail || 'Failed to update property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [property]);

  const deleteProperty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await propertiesService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      if (property && property.id === id) {
        setProperty(null);
      }
    } catch (err: any) {
      console.error('Error deleting property:', err);
      setError(err.response?.data?.detail || 'Failed to delete property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [property]);

  const fetchPropertyStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await propertiesService.getPropertyStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error fetching property stats:', err);
      setError(err.response?.data?.detail || 'Failed to fetch property statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    properties,
    property,
    loading,
    error,
    stats,
    fetchProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    fetchPropertyStats
  };
};

export default useProperties;
