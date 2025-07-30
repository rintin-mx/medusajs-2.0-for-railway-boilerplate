import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { z } from 'zod'

const UpdateProviderSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  is_active: z.boolean().optional()
})

// GET /admin/providers/:id - Get specific provider
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params

    // Mock data - Replace with actual database query
    const provider = {
      id,
      name: 'Provider 1',
      description: 'Main supplier',
      email: 'provider1@example.com',
      phone: '+1234567890',
      website: 'https://provider1.com',
      address: '123 Main St, City, Country',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }

    res.json({ provider })
  } catch (error) {
    console.error('Error fetching provider:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// PUT /admin/providers/:id - Update provider
export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params
    const validatedData = UpdateProviderSchema.parse(req.body)

    // Mock update - Replace with actual database update
    const updatedProvider = {
      id,
      name: 'Provider 1',
      description: 'Main supplier',
      email: 'provider1@example.com',
      phone: '+1234567890',
      website: 'https://provider1.com',
      address: '123 Main St, City, Country',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      ...validatedData
    }

    res.json({ provider: updatedProvider })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    console.error('Error updating provider:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// DELETE /admin/providers/:id - Delete provider
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.params

    // Mock deletion - Replace with actual database deletion
    // Note: Consider soft delete by setting is_active to false instead

    res.json({
      message: 'Provider deleted successfully',
      id
    })
  } catch (error) {
    console.error('Error deleting provider:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
