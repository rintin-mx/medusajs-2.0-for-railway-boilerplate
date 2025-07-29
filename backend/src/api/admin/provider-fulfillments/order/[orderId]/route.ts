import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MULTI_PROVIDER_FULFILLMENT_MODULE_KEY } from "../../../../../modules/multi-provider-fulfillment"
import ProviderFulfillmentService from "../../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * GET /admin/provider-fulfillments/order/:orderId
 * List provider fulfillments for a specific order
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillments = await providerFulfillmentService.listByOrder(req.params.orderId, {
    relations: req.query.relations?.split(",") || [],
    select: req.query.fields?.split(",") || undefined,
  })

  res.json({ fulfillments })
}
