import { Request, Response } from "express"
import { providerFulfillmentService } from "api/provider-fulfillment-service"

export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params

  try {
    // Use the new service instead of the old module
    const provider = await providerFulfillmentService.getProvider(id)

    if (!provider) {
      res.status(404).json({ error: "Provider not found" })
      return
    }

    res.json({
      provider_id: provider.id,
      is_available: provider.is_active,
      availability_status: provider.is_active ? 'available' : 'unavailable'
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to get provider availability" })
  }
}
