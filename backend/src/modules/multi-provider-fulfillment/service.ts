import { Logger, MedusaContainer } from '@medusajs/framework/types'
import { ProviderService } from './services/provider'
import { ProductInventoryService } from './services/product-inventory'

type InjectedDependencies = {
  logger: Logger
  container: MedusaContainer
}

interface MultiProviderFulfillmentOptions {
  // Configuration options for the module
}

class MultiProviderFulfillmentService {
  static identifier = 'multi-provider-fulfillment'
  protected readonly logger_: Logger
  protected readonly options_: MultiProviderFulfillmentOptions
  protected readonly providerService_: ProviderService
  protected readonly inventoryService_: ProductInventoryService

  constructor({ logger, container }: InjectedDependencies, options: MultiProviderFulfillmentOptions = {}) {
    this.logger_ = logger
    this.options_ = options

    // Initialize sub-services
    this.providerService_ = new ProviderService({ logger, container })
    this.inventoryService_ = new ProductInventoryService({ logger, container })

    this.logger_.info('MultiProviderFulfillmentService initialized with all sub-services')
  }

  // ============ PROVIDER METHODS ============
  get providers() {
    return this.providerService_
  }

  // ============ INVENTORY METHODS ============
  get inventory() {
    return this.inventoryService_
  }

  // ============ LEGACY METHODS (for backward compatibility) ============

  /**
   * Creates a provider fulfillment
   */
  async createProviderFulfillment(data: any) {
    return this.providerService_.createProviderFulfillment(data)
  }

  /**
   * Retrieves a provider fulfillment by id
   */
  async getProviderFulfillment(fulfillmentId: string) {
    return this.providerService_.getProviderFulfillment(fulfillmentId)
  }

  /**
   * Lists provider fulfillments
   */
  async listProviderFulfillments(selector: any = {}) {
    return this.providerService_.listProviderFulfillments(selector)
  }

  /**
   * Updates a provider fulfillment
   */
  async updateProviderFulfillment(fulfillmentId: string, update: any) {
    return this.providerService_.updateProviderFulfillment(fulfillmentId, update)
  }

  /**
   * Deletes a provider fulfillment
   */
  async deleteProviderFulfillment(fulfillmentId: string) {
    const fulfillment = await this.providerService_.getProviderFulfillment(fulfillmentId)
    if (fulfillment) {
      await this.providerService_.cancelProviderFulfillment(fulfillmentId)
      return { success: true }
    }
    return { success: false }
  }

  // ============ INITIALIZATION METHODS ============

  /**
   * Initialize the service with sample data
   */
  async initialize(): Promise<void> {
    this.logger_.info('Initializing MultiProviderFulfillmentService...')
    await this.providerService_.initializeSampleData()
    this.logger_.info('MultiProviderFulfillmentService initialization complete')
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<{
    status: 'healthy' | 'unhealthy'
    services: {
      providers: boolean
      inventory: boolean
    }
    timestamp: Date
  }> {
    return {
      status: 'healthy',
      services: {
        providers: true,
        inventory: true
      },
      timestamp: new Date()
    }
  }
}

export default MultiProviderFulfillmentService
