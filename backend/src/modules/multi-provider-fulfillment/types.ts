// Types and interfaces for Provider management
export interface Provider {
  id: string
  name: string
  type: 'shipping' | 'fulfillment' | 'inventory'
  status: 'active' | 'inactive' | 'pending'
  config: Record<string, any>
  metadata?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface CreateProviderData {
  name: string
  type: 'shipping' | 'fulfillment' | 'inventory'
  config: Record<string, any>
  metadata?: Record<string, any>
}

export interface UpdateProviderData {
  name?: string
  status?: 'active' | 'inactive' | 'pending'
  config?: Record<string, any>
  metadata?: Record<string, any>
}

export interface ProviderListSelector {
  type?: 'shipping' | 'fulfillment' | 'inventory'
  status?: 'active' | 'inactive' | 'pending'
  name?: string
  limit?: number
  offset?: number
}

export interface ProviderFulfillment {
  id: string
  provider_id: string
  order_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  tracking_number?: string
  items: ProviderFulfillmentItem[]
  metadata?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface ProviderFulfillmentItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  fulfilled_quantity: number
}

export interface CreateProviderFulfillmentData {
  provider_id: string
  order_id: string
  items: Omit<ProviderFulfillmentItem, 'id' | 'fulfilled_quantity'>[]
  metadata?: Record<string, any>
}
