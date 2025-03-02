// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Property types
export interface Property {
  id: string;
  name: string;
  property_type: string;
  property_class?: string;
  year_built?: number;
  total_sf?: number;
  status: string;
  description?: string;
  features: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  financial_metrics: {
    noi?: number;
    cap_rate?: number;
    occupancy_rate?: number;
    property_value?: number;
    price_per_sf?: number;
  };
  tenants: Array<{
    name: string;
    lease_start?: string;
    lease_end?: string;
    sf_leased?: number;
    monthly_rent?: number;
    notes?: string;
  }>;
  document_ids: string[];
  created_at: string;
  updated_at: string;
}

// Document types
export interface Document {
  id: string;
  title: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_type: string;
  property_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

// Analysis types
export interface Analysis {
  id: string;
  title: string;
  description?: string;
  property_id: string;
  document_ids: string[];
  analysis_type: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
} 