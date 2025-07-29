import { Request, Response } from "express"
import { ProductInventoryService } from "modules/multi-provider-fulfillment"

export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params

  try {
    const productInventoryService = new ProductInventoryService({ manager: (req as any).manager })
    const isAvailable = await productInventoryService.getProductAvailability(id)

    res.json({
      isAvailable,
      productId: id
    })
  } catch (error) {
    console.error("Error obteniendo disponibilidad del producto:", error)
    res.status(500).json({
      isAvailable: false,
      error: "Error interno del servidor"
    })
  }
}
