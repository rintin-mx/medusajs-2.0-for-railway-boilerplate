import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MULTI_PROVIDER_FULFILLMENT_MODULE_KEY } from "../../../../../modules/multi-provider-fulfillment"
import ProviderFulfillmentService from "../../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * POST /admin/provider-fulfillments/:id/cancel
 * Cancel a provider fulfillment
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.cancel(req.params.id)

  res.json({ fulfillment })
}
