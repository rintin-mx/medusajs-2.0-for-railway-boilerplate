import {
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery
} from "@medusajs/framework/utils"
import { Provider } from "../models/provider"
import { EntityManager } from "typeorm"

type ProviderServiceProps = {
  manager: EntityManager
}

class ProviderService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({ manager }: ProviderServiceProps) {
    super(arguments[0])
    this.manager_ = manager
  }

  /**
   * Creates a provider
   * @param data - the provider to create
   * @return created provider
   */
  async create(data: Partial<Provider>): Promise<Provider> {
    return await this.atomicPhase_(async (manager) => {
      const providerRepository = manager.getRepository(Provider)
      const provider = providerRepository.create(data)
      return await providerRepository.save(provider)
    })
  }

  /**
   * Retrieves a provider by id
   * @param providerId - the id of the provider to retrieve
   * @param config - the config to retrieve the provider by
   * @return the provider
   */
  async retrieve(
    providerId: string,
    config: FindConfig<Provider> = {}
  ): Promise<Provider> {
    const providerRepo = this.manager_.getRepository(Provider)
    const query = buildQuery({ id: providerId }, config)
    const provider = await providerRepo.findOne(query)

    if (!provider) {
      throw new Error(`Provider with id: ${providerId} not found`)
    }

    return provider
  }

  /**
   * Lists providers based on the provided parameters
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return an array of providers
   */
  async list(
    selector: Selector<Provider> = {},
    config: FindConfig<Provider> = { skip: 0, take: 50 }
  ): Promise<Provider[]> {
    const providerRepo = this.manager_.getRepository(Provider)
    const query = buildQuery(selector, config)
    return await providerRepo.find(query)
  }

  /**
   * Updates a provider
   * @param providerId - the id of the provider to update
   * @param update - the update object
   * @return updated provider
   */
  async update(
    providerId: string,
    update: Partial<Provider>
  ): Promise<Provider> {
    return await this.atomicPhase_(async (manager) => {
      const providerRepo = manager.getRepository(Provider)
      const provider = await this.retrieve(providerId)

      for (const [key, value] of Object.entries(update)) {
        if (value !== undefined) {
          provider[key] = value
        }
      }

      return await providerRepo.save(provider)
    })
  }

  /**
   * Deletes a provider
   * @param providerId - the id of the provider to delete
   * @return the result of the delete operation
   */
  async delete(providerId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const providerRepo = manager.getRepository(Provider)
      const provider = await this.retrieve(providerId)

      await providerRepo.remove(provider)
    })
  }
}

export default ProviderService
