import { Request, Response } from "express"
import ProviderFulfillmentService from "../../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * GET /admin/provider-fulfillments/order/:orderId
 * List provider fulfillments for a specific order
 */
export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillments = await providerFulfillmentService.listByOrder(req.params.orderId, {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
    })

    res.json({ fulfillments })
  } catch (error) {
    console.error("Error listing order fulfillments:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
