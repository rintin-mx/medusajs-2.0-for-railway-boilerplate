import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MULTI_PROVIDER_FULFILLMENT_MODULE_KEY } from "../../../../modules/multi-provider-fulfillment"
import ProviderFulfillmentService from "../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * GET /admin/provider-fulfillments/:id
 * Get a provider fulfillment by id
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.retrieve(req.params.id, {
    relations: req.query.relations?.split(",") || [],
    select: req.query.fields?.split(",") || undefined,
  })

  res.json({ fulfillment })
}

/**
 * PUT /admin/provider-fulfillments/:id
 * Update a provider fulfillment
 */
export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.update(req.params.id, req.body)

  res.json({ fulfillment })
}

/**
 * POST /admin/provider-fulfillments/:id/cancel
 * Cancel a provider fulfillment
 */
export async function cancelFulfillment(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.cancel(req.params.id)

  res.json({ fulfillment })
}

/**
 * POST /admin/provider-fulfillments/:id/ship
 * Mark a provider fulfillment as shipped
 */
export async function shipFulfillment(
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

/**
 * POST /admin/provider-fulfillments/:id/complete
 * Mark a provider fulfillment as completed
 */
export async function completeFulfillment(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerFulfillmentService: ProviderFulfillmentService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.providerFulfillment`
  )

  const fulfillment = await providerFulfillmentService.complete(req.params.id)

  res.json({ fulfillment })
}
