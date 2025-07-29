import { EntityManager } from "@mikro-orm/core"
import { ProviderFulfillment } from "../models/provider-fulfillment"

type ProviderFulfillmentServiceProps = {
  manager: EntityManager
}

class ProviderFulfillmentService {
  protected manager_: EntityManager

  constructor({ manager }: ProviderFulfillmentServiceProps) {
    this.manager_ = manager
  }

  /**
   * Creates a provider fulfillment
   * @param data - the fulfillment to create
   * @return created fulfillment
   */
  async create(data: Partial<ProviderFulfillment>): Promise<ProviderFulfillment> {
    const fulfillment = this.manager_.create(ProviderFulfillment, data)
    await this.manager_.persistAndFlush(fulfillment)
    return fulfillment
  }

  /**
   * Retrieves a provider fulfillment by id
   * @param fulfillmentId - the id of the fulfillment to retrieve
   * @return the fulfillment
   */
  async retrieve(fulfillmentId: string): Promise<ProviderFulfillment> {
    const fulfillment = await this.manager_.findOne(ProviderFulfillment, fulfillmentId)

    if (!fulfillment) {
      throw new Error(`Provider fulfillment with id: ${fulfillmentId} not found`)
    }

    return fulfillment
  }

  /**
   * Lists provider fulfillments
   */
  async list(selector: any = {}, config: any = { skip: 0, take: 50 }): Promise<ProviderFulfillment[]> {
    return await this.manager_.find(ProviderFulfillment, selector, {
      limit: config.take,
      offset: config.skip
    })
  }

  /**
   * Lists provider fulfillments by order ID
   */
  async listByOrder(orderId: string, config: any = { skip: 0, take: 50 }): Promise<ProviderFulfillment[]> {
    return await this.manager_.find(ProviderFulfillment, { order_id: orderId }, {
      limit: config.take,
      offset: config.skip
    })
  }

  /**
   * Updates a provider fulfillment
   */
  async update(fulfillmentId: string, update: Partial<ProviderFulfillment>): Promise<ProviderFulfillment> {
    const fulfillment = await this.retrieve(fulfillmentId)

    for (const [key, value] of Object.entries(update)) {
      if (value !== undefined) {
        (fulfillment as any)[key] = value
      }
    }

    await this.manager_.persistAndFlush(fulfillment)
    return fulfillment
  }

  /**
   * Deletes a provider fulfillment
   */
  async delete(fulfillmentId: string): Promise<void> {
    const fulfillment = await this.retrieve(fulfillmentId)
    await this.manager_.removeAndFlush(fulfillment)
  }
}

export default ProviderFulfillmentService
