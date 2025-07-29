import { Module } from "@medusajs/framework/types"
import ProviderService from "./services/provider"
import ProviderFulfillmentService from "./services/provider-fulfillment"
import { Provider } from "./models/provider"
import { ProviderFulfillment } from "./models/provider-fulfillment"
import { ProviderFulfillmentItem } from "./models/provider-fulfillment-item"

export const MULTI_PROVIDER_FULFILLMENT_MODULE_KEY = "multiProviderFulfillmentService"

export default Module({
  id: MULTI_PROVIDER_FULFILLMENT_MODULE_KEY,
  service: ProviderFulfillmentService,
  resources: {
    services: {
      provider: ProviderService,
      providerFulfillment: ProviderFulfillmentService
    },
    models: {
      Provider,
      ProviderFulfillment,
      ProviderFulfillmentItem
    }
  },
  imports: []
})

// Export services and models for easier imports
export * from "./models/provider"
export * from "./models/provider-fulfillment"
export * from "./models/provider-fulfillment-item"
export { default as ProviderService } from "./services/provider"
export { default as ProviderFulfillmentService } from "./services/provider-fulfillment"
