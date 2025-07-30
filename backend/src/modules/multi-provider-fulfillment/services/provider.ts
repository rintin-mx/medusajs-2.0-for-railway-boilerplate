import { Logger, MedusaContainer } from '@medusajs/framework/types'
import {
  Provider,
  CreateProviderData,
  UpdateProviderData,
  ProviderListSelector,
  ProviderFulfillment,
  CreateProviderFulfillmentData
} from '../types'

type InjectedDependencies = {
  logger: Logger
  container: MedusaContainer
}

export class ProviderService {
  protected readonly logger_: Logger
  protected readonly container_: MedusaContainer
  protected providers_: Map<string, Provider> = new Map()
  protected fulfillments_: Map<string, ProviderFulfillment> = new Map()

  constructor({ logger, container }: InjectedDependencies) {
    this.logger_ = logger
    this.container_ = container
    this.logger_.info('ProviderService initialized')
  }

  // ============ PROVIDER CRUD OPERATIONS ============

  /**
   * Create a new provider
   */
  async createProvider(data: CreateProviderData): Promise<Provider> {
    this.logger_.info(`Creating provider: ${data.name}`)

    const providerId = `prov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const provider: Provider = {
      id: providerId,
      name: data.name,
      type: data.type,
      status: 'pending',
      config: data.config,
      metadata: data.metadata || {},
      created_at: new Date(),
      updated_at: new Date()
    }

    // Store in memory (en producción esto iría a la base de datos)
    this.providers_.set(providerId, provider)

    this.logger_.info(`Provider created successfully: ${providerId}`)
    return provider
  }

  /**
   * Get provider by ID
   */
  async getProvider(providerId: string): Promise<Provider | null> {
    this.logger_.info(`Retrieving provider: ${providerId}`)

    const provider = this.providers_.get(providerId)
    if (!provider) {
      this.logger_.warn(`Provider not found: ${providerId}`)
      return null
    }

    return provider
  }

  /**
   * Update provider
   */
  async updateProvider(providerId: string, data: UpdateProviderData): Promise<Provider> {
    this.logger_.info(`Updating provider: ${providerId}`)

    const provider = this.providers_.get(providerId)
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`)
    }

    const updatedProvider: Provider = {
      ...provider,
      name: data.name || provider.name,
      status: data.status || provider.status,
      config: data.config ? { ...provider.config, ...data.config } : provider.config,
      metadata: data.metadata ? { ...provider.metadata, ...data.metadata } : provider.metadata,
      updated_at: new Date()
    }

    this.providers_.set(providerId, updatedProvider)
    this.logger_.info(`Provider updated successfully: ${providerId}`)

    return updatedProvider
  }

  /**
   * Delete provider
   */
  async deleteProvider(providerId: string): Promise<boolean> {
    this.logger_.info(`Deleting provider: ${providerId}`)

    const provider = this.providers_.get(providerId)
    if (!provider) {
      this.logger_.warn(`Provider not found for deletion: ${providerId}`)
      return false
    }

    // Check if provider has active fulfillments
    const activeFulfillments = Array.from(this.fulfillments_.values())
      .filter(f => f.provider_id === providerId && f.status !== 'completed' && f.status !== 'cancelled')

    if (activeFulfillments.length > 0) {
      throw new Error(`Cannot delete provider ${providerId}: has ${activeFulfillments.length} active fulfillments`)
    }

    this.providers_.delete(providerId)
    this.logger_.info(`Provider deleted successfully: ${providerId}`)

    return true
  }

  /**
   * List providers with filtering
   */
  async listProviders(selector: ProviderListSelector = {}): Promise<Provider[]> {
    this.logger_.info(`Listing providers with selector: ${JSON.stringify(selector)}`)

    let providers = Array.from(this.providers_.values())

    // Apply filters
    if (selector.type) {
      providers = providers.filter(p => p.type === selector.type)
    }
    if (selector.status) {
      providers = providers.filter(p => p.status === selector.status)
    }
    if (selector.name) {
      providers = providers.filter(p => p.name.toLowerCase().includes(selector.name!.toLowerCase()))
    }

    // Apply pagination
    const offset = selector.offset || 0
    const limit = selector.limit || 50
    providers = providers.slice(offset, offset + limit)

    this.logger_.info(`Found ${providers.length} providers`)
    return providers
  }

  /**
   * Get providers by type
   */
  async getProvidersByType(type: 'shipping' | 'fulfillment' | 'inventory'): Promise<Provider[]> {
    return this.listProviders({ type, status: 'active' })
  }

  /**
   * Activate/Deactivate provider
   */
  async toggleProviderStatus(providerId: string): Promise<Provider> {
    const provider = await this.getProvider(providerId)
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`)
    }

    const newStatus = provider.status === 'active' ? 'inactive' : 'active'
    return this.updateProvider(providerId, { status: newStatus })
  }

  // ============ PROVIDER FULFILLMENT OPERATIONS ============

  /**
   * Create provider fulfillment
   */
  async createProviderFulfillment(data: CreateProviderFulfillmentData): Promise<ProviderFulfillment> {
    this.logger_.info(`Creating provider fulfillment for provider: ${data.provider_id}`)

    // Verify provider exists and is active
    const provider = await this.getProvider(data.provider_id)
    if (!provider) {
      throw new Error(`Provider not found: ${data.provider_id}`)
    }
    if (provider.status !== 'active') {
      throw new Error(`Provider is not active: ${data.provider_id}`)
    }

    const fulfillmentId = `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fulfillment: ProviderFulfillment = {
      id: fulfillmentId,
      provider_id: data.provider_id,
      order_id: data.order_id,
      status: 'pending',
      items: data.items.map(item => ({
        ...item,
        id: `pfi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fulfilled_quantity: 0
      })),
      metadata: data.metadata || {},
      created_at: new Date(),
      updated_at: new Date()
    }

    this.fulfillments_.set(fulfillmentId, fulfillment)
    this.logger_.info(`Provider fulfillment created: ${fulfillmentId}`)

    return fulfillment
  }

  /**
   * Get provider fulfillment
   */
  async getProviderFulfillment(fulfillmentId: string): Promise<ProviderFulfillment | null> {
    this.logger_.info(`Retrieving provider fulfillment: ${fulfillmentId}`)
    return this.fulfillments_.get(fulfillmentId) || null
  }

  /**
   * Update provider fulfillment
   */
  async updateProviderFulfillment(
    fulfillmentId: string,
    data: Partial<Pick<ProviderFulfillment, 'status' | 'tracking_number' | 'metadata'>>
  ): Promise<ProviderFulfillment> {
    this.logger_.info(`Updating provider fulfillment: ${fulfillmentId}`)

    const fulfillment = this.fulfillments_.get(fulfillmentId)
    if (!fulfillment) {
      throw new Error(`Provider fulfillment not found: ${fulfillmentId}`)
    }

    const updatedFulfillment: ProviderFulfillment = {
      ...fulfillment,
      status: data.status || fulfillment.status,
      tracking_number: data.tracking_number || fulfillment.tracking_number,
      metadata: data.metadata ? { ...fulfillment.metadata, ...data.metadata } : fulfillment.metadata,
      updated_at: new Date()
    }

    this.fulfillments_.set(fulfillmentId, updatedFulfillment)
    this.logger_.info(`Provider fulfillment updated: ${fulfillmentId}`)

    return updatedFulfillment
  }

  /**
   * List provider fulfillments
   */
  async listProviderFulfillments(selector: {
    provider_id?: string
    order_id?: string
    status?: string
    limit?: number
    offset?: number
  } = {}): Promise<ProviderFulfillment[]> {
    this.logger_.info(`Listing provider fulfillments with selector: ${JSON.stringify(selector)}`)

    let fulfillments = Array.from(this.fulfillments_.values())

    if (selector.provider_id) {
      fulfillments = fulfillments.filter(f => f.provider_id === selector.provider_id)
    }
    if (selector.order_id) {
      fulfillments = fulfillments.filter(f => f.order_id === selector.order_id)
    }
    if (selector.status) {
      fulfillments = fulfillments.filter(f => f.status === selector.status)
    }

    const offset = selector.offset || 0
    const limit = selector.limit || 50
    fulfillments = fulfillments.slice(offset, offset + limit)

    return fulfillments
  }

  /**
   * Cancel provider fulfillment
   */
  async cancelProviderFulfillment(fulfillmentId: string): Promise<ProviderFulfillment> {
    return this.updateProviderFulfillment(fulfillmentId, { status: 'cancelled' })
  }

  /**
   * Complete provider fulfillment
   */
  async completeProviderFulfillment(fulfillmentId: string, trackingNumber?: string): Promise<ProviderFulfillment> {
    return this.updateProviderFulfillment(fulfillmentId, {
      status: 'completed',
      tracking_number: trackingNumber
    })
  }

  // ============ UTILITY METHODS ============

  /**
   * Get provider statistics
   */
  async getProviderStats(providerId: string): Promise<{
    total_fulfillments: number
    pending: number
    processing: number
    completed: number
    failed: number
    cancelled: number
  }> {
    const fulfillments = await this.listProviderFulfillments({ provider_id: providerId })

    return {
      total_fulfillments: fulfillments.length,
      pending: fulfillments.filter(f => f.status === 'pending').length,
      processing: fulfillments.filter(f => f.status === 'processing').length,
      completed: fulfillments.filter(f => f.status === 'completed').length,
      failed: fulfillments.filter(f => f.status === 'failed').length,
      cancelled: fulfillments.filter(f => f.status === 'cancelled').length
    }
  }

  /**
   * Initialize with sample data (for testing)
   */
  async initializeSampleData(): Promise<void> {
    this.logger_.info('Initializing sample provider data...')

    // Sample providers
    await this.createProvider({
      name: 'DHL Express',
      type: 'shipping',
      config: {
        api_key: 'dhl_api_key_sample',
        endpoint: 'https://api.dhl.com',
        region: 'US'
      },
      metadata: { priority: 'high' }
    })

    await this.createProvider({
      name: 'FedEx Ground',
      type: 'shipping',
      config: {
        api_key: 'fedex_api_key_sample',
        endpoint: 'https://api.fedex.com',
        service_type: 'ground'
      }
    })

    await this.createProvider({
      name: 'Local Warehouse',
      type: 'fulfillment',
      config: {
        address: '123 Warehouse St',
        capacity: 10000,
        operating_hours: '9:00-17:00'
      }
    })

    // Activate the first two providers
    const providers = await this.listProviders()
    if (providers.length >= 2) {
      await this.updateProvider(providers[0].id, { status: 'active' })
      await this.updateProvider(providers[1].id, { status: 'active' })
    }

    this.logger_.info('Sample provider data initialized')
  }
}
