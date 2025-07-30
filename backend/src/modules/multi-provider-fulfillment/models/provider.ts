// Basic TypeScript interfaces for type safety
export interface Provider {
  id: string
  name: string
  description?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface ProviderFulfillment {
  id: string
  order_id: string
  provider_id: string
  status: string
  created_at: Date
  updated_at: Date
}

export interface ProviderFulfillmentItem {
  id: string
  provider_fulfillment_id: string
  order_item_id: string
  quantity: number
  metadata?: Record<string, unknown>
  created_at: Date
  updated_at: Date
}

export interface Product {
  id: string
  product_id: string
  provider_id: string
  provider_product_id?: string
  cost_price?: number
  is_available: boolean
  created_at: Date
  updated_at: Date
}
