import { Request, Response } from "express"
import ProviderFulfillmentService from "../../../../modules/multi-provider-fulfillment/services/provider-fulfillment"

/**
 * GET /admin/provider-fulfillments/:id
 * Get a provider fulfillment by id
 */
export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillment = await providerFulfillmentService.retrieve(req.params.id)

    res.json({ fulfillment })
  } catch (error) {
    console.error("Error retrieving provider fulfillment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * PUT /admin/provider-fulfillments/:id
 * Update a provider fulfillment
 */
export async function PUT(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    const fulfillment = await providerFulfillmentService.update(req.params.id, req.body)

    res.json({ fulfillment })
  } catch (error) {
    console.error("Error updating provider fulfillment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * DELETE /admin/provider-fulfillments/:id
 * Delete a provider fulfillment
 */
export async function DELETE(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerFulfillmentService = new ProviderFulfillmentService({ manager: (req as any).manager })
    await providerFulfillmentService.delete(req.params.id)

    res.status(204).end()
  } catch (error) {
    console.error("Error deleting provider fulfillment:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
