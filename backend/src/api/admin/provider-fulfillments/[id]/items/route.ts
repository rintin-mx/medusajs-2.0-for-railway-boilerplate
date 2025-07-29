import { Request, Response } from "express"
import { ProductInventoryService } from "../../../../modules/multi-provider-fulfillment/services/product-inventory"

export async function PUT(
  req: Request,
  res: Response
): Promise<void> {
  const { items } = req.body

  try {
    const productInventoryService = new ProductInventoryService({ manager: (req as any).manager })

    // Actualizar items y verificar stock
    for (const item of items) {
      if (item.quantity === 0) {
        // Si la cantidad es 0, marcar producto como no disponible (backorder)
        await productInventoryService.setProductUnavailable(item.product_id)
      } else if (item.quantity > 0 && item.hasStock) {
        // Si hay stock disponible, marcar como disponible
        await productInventoryService.setProductAvailable(item.product_id)
      }
    }

    res.json({
      success: true,
      message: "Items actualizados correctamente"
    })
  } catch (error) {
    console.error("Error actualizando items:", error)
    res.status(500).json({
      success: false,
      error: "Error interno del servidor"
    })
  }
}
