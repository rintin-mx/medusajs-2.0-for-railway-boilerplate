import { Module } from "@medusajs/utils"
import ProviderFulfillmentService from "./services/provider-fulfillment"
import { ProductInventoryService } from "./services/product-inventory"

export const MULTI_PROVIDER_FULFILLMENT_MODULE_KEY = "multiProviderFulfillmentService"

// Export models for external use
export { Provider } from "./models/provider"
export { ProviderFulfillment } from "./models/provider-fulfillment"
export { ProviderFulfillmentItem } from "./models/provider-fulfillment-item"
export { Product } from "./models/product-provider"

// Export services for external use
export { default as ProviderService } from "./services/provider"
export { default as ProviderFulfillmentService } from "./services/provider-fulfillment"
export { ProductInventoryService } from "./services/product-inventory"

// Module definition compatible with Medusa 2.0
export default Module(MULTI_PROVIDER_FULFILLMENT_MODULE_KEY, {
  service: ProviderFulfillmentService,
})
