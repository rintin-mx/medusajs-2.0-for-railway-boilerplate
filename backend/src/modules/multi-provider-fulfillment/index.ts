import ProviderService from "./services/provider"
import ProviderFulfillmentService from "./services/provider-fulfillment"
import { ProductInventoryService } from "./services/product-inventory"
import { Provider } from "./models/provider"
import { ProviderFulfillment } from "./models/provider-fulfillment"
import { ProviderFulfillmentItem } from "./models/provider-fulfillment-item"
import { Product } from "./models/product-provider"

export const MULTI_PROVIDER_FULFILLMENT_MODULE_KEY = "multiProviderFulfillmentService"

// Export services and models for easier imports
export { Provider } from "./models/provider"
export { ProviderFulfillment } from "./models/provider-fulfillment"
export { ProviderFulfillmentItem } from "./models/provider-fulfillment-item"
export { Product } from "./models/product-provider"
export { default as ProviderService } from "./services/provider"
export { default as ProviderFulfillmentService } from "./services/provider-fulfillment"
export { ProductInventoryService } from "./services/product-inventory"

export default {
  services: {
    providerService: ProviderService,
    providerFulfillmentService: ProviderFulfillmentService,
    productInventoryService: ProductInventoryService
  },
  models: {
    Provider,
    ProviderFulfillment,
    ProviderFulfillmentItem,
    Product
  }
}
