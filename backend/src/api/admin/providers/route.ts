import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { MULTI_PROVIDER_FULFILLMENT_MODULE_KEY } from "../../../modules/multi-provider-fulfillment"
import ProviderService from "../../../modules/multi-provider-fulfillment/services/provider"

/**
 * GET /admin/providers
 * List all providers
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerService: ProviderService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.provider`
  )

  const providers = await providerService.list(req.query || {}, {
    relations: req.query.relations?.split(",") || [],
    select: req.query.fields?.split(",") || undefined,
    skip: parseInt(req.query.offset as string) || 0,
    take: parseInt(req.query.limit as string) || 50,
  })

  res.json({ providers })
}

/**
 * POST /admin/providers
 * Create a new provider
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerService: ProviderService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.provider`
  )

  const provider = await providerService.create(req.body)

  res.status(201).json({ provider })
}

/**
 * GET /admin/providers/:id
 * Get a provider by id
 */
export async function getProvider(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerService: ProviderService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.provider`
  )

  const provider = await providerService.retrieve(req.params.id, {
    relations: req.query.relations?.split(",") || [],
    select: req.query.fields?.split(",") || undefined,
  })

  res.json({ provider })
}

/**
 * PUT /admin/providers/:id
 * Update a provider
 */
export async function updateProvider(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerService: ProviderService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.provider`
  )

  const provider = await providerService.update(req.params.id, req.body)

  res.json({ provider })
}

/**
 * DELETE /admin/providers/:id
 * Delete a provider
 */
export async function deleteProvider(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const providerService: ProviderService = req.scope.resolve(
    `${MULTI_PROVIDER_FULFILLMENT_MODULE_KEY}.provider`
  )

  await providerService.delete(req.params.id)

  res.status(204).end()
}
