import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { z } from 'zod'

const UpdateProductProviderSchema = z.object({
  provider_product_id: z.string().optional(),
  cost_price: z.number().min(0).optional(),
  is_available: z.boolean().optional()
})

// PUT /admin/providers/:provider_id/products/:product_id - Update product assignment
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { provider_id, product_id } = req.params
    const validatedData = UpdateProductProviderSchema.parse(req.body)

    // Mock update - Replace with actual database update
    const updatedProductProvider = {
      id: `pp_${product_id}_${provider_id}`,
      product_id,
      provider_id,
      provider_product_id: 'PROV_SKU_001',
      cost_price: 80,
      is_available: true,
      created_at: new Date(),
      updated_at: new Date(),
      ...validatedData
    }

    res.json({
      message: 'Product assignment updated successfully',
      product_provider: updatedProductProvider
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    console.error('Error updating product assignment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /admin/providers/:provider_id/products/:product_id - Remove product assignment
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { provider_id, product_id } = req.params

    // Mock deletion - Replace with actual database deletion

    res.json({
      message: 'Product assignment removed successfully',
      provider_id,
      product_id
    })
  } catch (error) {
    console.error('Error removing product assignment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
