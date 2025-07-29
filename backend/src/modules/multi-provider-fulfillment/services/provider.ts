import { EntityManager } from "@mikro-orm/core"
import { Provider } from "../models/provider"

type ProviderServiceProps = {
  manager: EntityManager
}

class ProviderService {
  protected manager_: EntityManager

  constructor({ manager }: ProviderServiceProps) {
    this.manager_ = manager
  }

  /**
   * Creates a provider
   * @param data - the provider to create
   * @return created provider
   */
  async create(data: Partial<Provider>): Promise<Provider> {
    const provider = this.manager_.create(Provider, data)
    await this.manager_.persistAndFlush(provider)
    return provider
  }

  /**
   * Retrieves a provider by id
   * @param providerId - the id of the provider to retrieve
   * @return the provider
   */
  async retrieve(providerId: string): Promise<Provider> {
    const provider = await this.manager_.findOne(Provider, providerId)

    if (!provider) {
      throw new Error(`Provider with id: ${providerId} not found`)
    }

    return provider
  }

  /**
   * Lists providers based on the provided parameters
   */
  async list(selector: any = {}, config: any = { skip: 0, take: 50 }): Promise<Provider[]> {
    return await this.manager_.find(Provider, selector, {
      limit: config.take,
      offset: config.skip
    })
  }

  /**
   * Updates a provider
   * @param providerId - the id of the provider to update
   * @param update - the update object
   * @return updated provider
   */
  async update(providerId: string, update: Partial<Provider>): Promise<Provider> {
    const provider = await this.retrieve(providerId)

    for (const [key, value] of Object.entries(update)) {
      if (value !== undefined) {
        (provider as any)[key] = value
      }
    }

    await this.manager_.persistAndFlush(provider)
    return provider
  }

  /**
   * Deletes a provider
   * @param providerId - the id of the provider to delete
   */
  async delete(providerId: string): Promise<void> {
    const provider = await this.retrieve(providerId)
    await this.manager_.removeAndFlush(provider)
  }
}

export default ProviderService
