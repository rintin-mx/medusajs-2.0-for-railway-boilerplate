import { Request, Response } from "express"
import ProviderFulfillmentService from "../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * GET /admin/provider-fulfillments
 * List all provider fulfillments
 */
export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillments = await providerFulfillmentService.list(req.query || {}, {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
    })

    res.json({ fulfillments })
  } catch (error) {
    console.error("Error listing provider fulfillments:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * POST /admin/provider-fulfillments
 * Create a new provider fulfillment
 */
export async function POST(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillment = await providerFulfillmentService.create(req.body)

    res.status(201).json({ fulfillment })
  } catch (error) {
    console.error("Error creating provider fulfillment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * GET /admin/provider-fulfillments/order/:orderId
 * List provider fulfillments for a specific order
 */
export async function getOrderFulfillments(
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
