import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MULTI_PROVIDER_FULFILLMENT_MODULE_KEY } from "../../../../../modules/multi-provider-fulfillment"
import ProviderFulfillmentService from "../../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * POST /admin/provider-fulfillments/:id/ship
 * Mark a provider fulfillment as shipped
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.markAsShipped(
    req.params.id,
    req.body
  )

  res.json({ fulfillment })
}
