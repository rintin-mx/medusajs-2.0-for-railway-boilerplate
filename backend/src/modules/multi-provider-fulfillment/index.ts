export const MULTI_PROVIDER_FULFILLMENT_MODULE_KEY = "multiProviderFulfillmentService"

// Export models first to avoid circular dependencies
export { Provider } from "./models/provider"
export { ProviderFulfillment } from "./models/provider-fulfillment"
export { ProviderFulfillmentItem } from "./models/provider-fulfillment-item"
export { Product } from "./models/product-provider"

// Export services after models
export { default as ProviderService } from "./services/provider"
export { default as ProviderFulfillmentService } from "./services/provider-fulfillment"
export { ProductInventoryService } from "./services/product-inventory"

// Module definition for Medusa
const module = {
  services: {
    providerService: "providerService",
    providerFulfillmentService: "providerFulfillmentService",
    productInventoryService: "productInventoryService"
  }
}

export default module
