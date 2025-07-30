export interface ProviderFulfillment {
  id: string
  order_id: string
  provider_id: string
  status: string
  created_at: Date
  updated_at: Date
}

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

// Service class for provider fulfillment management
export class ProviderFulfillmentService {
  private fulfillments: Map<string, ProviderFulfillment> = new Map()
  private providers: Map<string, Provider> = new Map()

  // Provider management methods
  async createProvider(data: Partial<Provider>): Promise<Provider> {
    const provider: Provider = {
      id: `prov_${Date.now()}`,
      name: data.name!,
      description: data.description,
      email: data.email,
      phone: data.phone,
      website: data.website,
      address: data.address,
      is_active: data.is_active ?? true,
      created_at: new Date(),
      updated_at: new Date()
    }

    this.providers.set(provider.id, provider)
    return provider
  }

  async getProvider(providerId: string): Promise<Provider | null> {
    return this.providers.get(providerId) || null
  }

  async listProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values())
  }

  async updateProvider(providerId: string, update: Partial<Provider>): Promise<Provider | null> {
    const provider = this.providers.get(providerId)
    if (!provider) return null

    const updatedProvider = {
      ...provider,
      ...update,
      updated_at: new Date()
    }

    this.providers.set(providerId, updatedProvider)
    return updatedProvider
  }

  // Fulfillment management methods
  async createProviderFulfillment(data: Partial<ProviderFulfillment>): Promise<ProviderFulfillment> {
    const fulfillment: ProviderFulfillment = {
      id: `pf_${Date.now()}`,
      order_id: data.order_id!,
      provider_id: data.provider_id!,
      status: data.status || 'pending',
      created_at: new Date(),
      updated_at: new Date()
    }

    this.fulfillments.set(fulfillment.id, fulfillment)
    return fulfillment
  }

  async getProviderFulfillment(fulfillmentId: string): Promise<ProviderFulfillment | null> {
    return this.fulfillments.get(fulfillmentId) || null
  }

  async listProviderFulfillments(filters?: { order_id?: string, provider_id?: string }): Promise<ProviderFulfillment[]> {
    let fulfillments = Array.from(this.fulfillments.values())

    if (filters?.order_id) {
      fulfillments = fulfillments.filter(f => f.order_id === filters.order_id)
    }

    if (filters?.provider_id) {
      fulfillments = fulfillments.filter(f => f.provider_id === filters.provider_id)
    }

    return fulfillments
  }

  async updateProviderFulfillment(fulfillmentId: string, update: Partial<ProviderFulfillment>): Promise<ProviderFulfillment | null> {
    const fulfillment = this.fulfillments.get(fulfillmentId)
    if (!fulfillment) return null

    const updatedFulfillment = {
      ...fulfillment,
      ...update,
      updated_at: new Date()
    }

    this.fulfillments.set(fulfillmentId, updatedFulfillment)
    return updatedFulfillment
  }
}

// Export singleton instance
export const providerFulfillmentService = new ProviderFulfillmentService()
