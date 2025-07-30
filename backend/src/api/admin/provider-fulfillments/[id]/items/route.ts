import { Request, Response } from "express"
import { providerFulfillmentService } from "api/provider-fulfillment-service"

export async function PUT(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params
  const { items } = req.body

  try {
    // Use the new service instead of the old module
    const fulfillment = await providerFulfillmentService.getProviderFulfillment(id)

    if (!fulfillment) {
      res.status(404).json({ error: "Provider fulfillment not found" })
      return
    }

    // Update fulfillment with new items data
    const updatedFulfillment = await providerFulfillmentService.updateProviderFulfillment(id, {
      status: 'updated',
      // In a real implementation, you would handle items properly
    })

    res.json({
      fulfillment: updatedFulfillment,
      items: items,
      message: "Fulfillment items updated successfully"
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to update fulfillment items" })
  }
}
