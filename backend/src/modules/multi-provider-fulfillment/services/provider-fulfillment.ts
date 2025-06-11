import {
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery
} from "@medusajs/framework/utils"
import { EntityManager } from "typeorm"
import { ProviderFulfillment, ProviderFulfillmentStatus } from "../models/provider-fulfillment"
import { ProviderFulfillmentItem } from "../models/provider-fulfillment-item"
import { Modules } from "@medusajs/framework/utils"
import ProviderService from "./provider"

type ProviderFulfillmentServiceProps = {
  manager: EntityManager
}

type CreateProviderFulfillmentInput = {
  order_id: string
  provider_id: string
  items: {
    order_item_id: string
    quantity: number
  }[]
  metadata?: Record<string, unknown>
}

type UpdateProviderFulfillmentInput = {
  status?: ProviderFulfillmentStatus
  tracking_number?: string
  tracking_url?: string
  shipped_at?: Date
  delivered_at?: Date
  metadata?: Record<string, unknown>
}

class ProviderFulfillmentService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
  protected readonly providerService_: ProviderService

  constructor({ manager }: ProviderFulfillmentServiceProps) {
    super(arguments[0])
    this.manager_ = manager
    this.providerService_ = new ProviderService({ manager })
  }

  /**
   * Creates a provider fulfillment with items
   * @param data - the provider fulfillment to create
   * @return created provider fulfillment
   */
  async create(data: CreateProviderFulfillmentInput): Promise<ProviderFulfillment> {
    return await this.atomicPhase_(async (manager) => {
      // Verify provider exists
      await this.providerService_.retrieve(data.provider_id)

      // Create the provider fulfillment
      const fulfillmentRepo = manager.getRepository(ProviderFulfillment)
      const fulfillment = fulfillmentRepo.create({
        order_id: data.order_id,
        provider_id: data.provider_id,
        metadata: data.metadata
      })

      const savedFulfillment = await fulfillmentRepo.save(fulfillment)

      // Create the fulfillment items
      if (data.items && data.items.length > 0) {
        const itemRepo = manager.getRepository(ProviderFulfillmentItem)
        const items = data.items.map(item => {
          return itemRepo.create({
            provider_fulfillment_id: savedFulfillment.id,
            order_item_id: item.order_item_id,
            quantity: item.quantity
          })
        })

        await itemRepo.save(items)
      }

      return await this.retrieve(savedFulfillment.id, {
        relations: ["items"]
      })
    })
  }

  /**
   * Retrieves a provider fulfillment by id
   * @param fulfillmentId - the id of the fulfillment to retrieve
   * @param config - the config to retrieve the fulfillment by
   * @return the provider fulfillment
   */
  async retrieve(
    fulfillmentId: string,
    config: FindConfig<ProviderFulfillment> = {}
  ): Promise<ProviderFulfillment> {
    const fulfillmentRepo = this.manager_.getRepository(ProviderFulfillment)
    const query = buildQuery({ id: fulfillmentId }, config)
    const fulfillment = await fulfillmentRepo.findOne(query)

    if (!fulfillment) {
      throw new Error(`Provider fulfillment with id: ${fulfillmentId} not found`)
    }

    return fulfillment
  }

  /**
   * Lists provider fulfillments based on the provided parameters
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return an array of provider fulfillments
   */
  async list(
    selector: Selector<ProviderFulfillment> = {},
    config: FindConfig<ProviderFulfillment> = { skip: 0, take: 50 }
  ): Promise<ProviderFulfillment[]> {
    const fulfillmentRepo = this.manager_.getRepository(ProviderFulfillment)
    const query = buildQuery(selector, config)
    return await fulfillmentRepo.find(query)
  }

  /**
   * Lists provider fulfillments for a specific order
   * @param orderId - the id of the order
   * @param config - the config to be used for find
   * @return an array of provider fulfillments
   */
  async listByOrder(
    orderId: string,
    config: FindConfig<ProviderFulfillment> = { skip: 0, take: 50 }
  ): Promise<ProviderFulfillment[]> {
    return await this.list({ order_id: orderId }, config)
  }

  /**
   * Updates a provider fulfillment
   * @param fulfillmentId - the id of the fulfillment to update
   * @param update - the update object
   * @return updated provider fulfillment
   */
  async update(
    fulfillmentId: string,
    update: UpdateProviderFulfillmentInput
  ): Promise<ProviderFulfillment> {
    return await this.atomicPhase_(async (manager) => {
      const fulfillmentRepo = manager.getRepository(ProviderFulfillment)
      const fulfillment = await this.retrieve(fulfillmentId)

      for (const [key, value] of Object.entries(update)) {
        if (value !== undefined) {
          fulfillment[key] = value
        }
      }

      return await fulfillmentRepo.save(fulfillment)
    })
  }

  /**
   * Cancels a provider fulfillment
   * @param fulfillmentId - the id of the fulfillment to cancel
   * @return the canceled fulfillment
   */
  async cancel(fulfillmentId: string): Promise<ProviderFulfillment> {
    return await this.atomicPhase_(async (manager) => {
      const fulfillment = await this.retrieve(fulfillmentId)

      if (fulfillment.status === ProviderFulfillmentStatus.SHIPPED ||
          fulfillment.status === ProviderFulfillmentStatus.COMPLETED) {
        throw new Error(`Cannot cancel fulfillment with status ${fulfillment.status}`)
      }

      fulfillment.status = ProviderFulfillmentStatus.CANCELED

      const fulfillmentRepo = manager.getRepository(ProviderFulfillment)
      return await fulfillmentRepo.save(fulfillment)
    })
  }

  /**
   * Marks a fulfillment as shipped
   * @param fulfillmentId - the id of the fulfillment to mark as shipped
   * @param trackingInfo - optional tracking information
   * @return the updated fulfillment
   */
  async markAsShipped(
    fulfillmentId: string,
    trackingInfo?: { tracking_number?: string; tracking_url?: string }
  ): Promise<ProviderFulfillment> {
    return await this.atomicPhase_(async (manager) => {
      const fulfillment = await this.retrieve(fulfillmentId)

      if (fulfillment.status === ProviderFulfillmentStatus.CANCELED) {
        throw new Error("Cannot mark canceled fulfillment as shipped")
      }

      const updateData: UpdateProviderFulfillmentInput = {
        status: ProviderFulfillmentStatus.SHIPPED,
        shipped_at: new Date()
      }

      if (trackingInfo?.tracking_number) {
        updateData.tracking_number = trackingInfo.tracking_number
      }

      if (trackingInfo?.tracking_url) {
        updateData.tracking_url = trackingInfo.tracking_url
      }

      return await this.update(fulfillmentId, updateData)
    })
  }

  /**
   * Marks a fulfillment as completed
   * @param fulfillmentId - the id of the fulfillment to mark as completed
   * @return the updated fulfillment
   */
  async complete(fulfillmentId: string): Promise<ProviderFulfillment> {
    return await this.atomicPhase_(async (manager) => {
      const fulfillment = await this.retrieve(fulfillmentId)

      if (fulfillment.status !== ProviderFulfillmentStatus.SHIPPED) {
        throw new Error("Cannot complete fulfillment that is not shipped")
      }

      return await this.update(fulfillmentId, {
        status: ProviderFulfillmentStatus.COMPLETED,
        delivered_at: new Date()
      })
    })
  }
}

export default ProviderFulfillmentService
