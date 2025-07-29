import { Request, Response } from "express"
import ProviderFulfillmentService from "../../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * POST /admin/provider-fulfillments/:id/ship
 * Mark a provider fulfillment as shipped
 */
export async function POST(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillment = await providerFulfillmentService.update(req.params.id, {
      status: 'shipped',
      ...req.body
    })

    res.json({ fulfillment })
  } catch (error) {
    console.error("Error shipping provider fulfillment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
