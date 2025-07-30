import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { z } from 'zod'

// Validation schemas
const CreateProviderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true)
})

const UpdateProviderSchema = CreateProviderSchema.partial()

// GET /admin/providers - List all providers
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { page = 1, limit = 20, search = '', is_active } = req.query

    // Mock data - Replace with actual database queries
    const providers = [
      {
        id: 'prov_1',
        name: 'Provider 1',
        description: 'Main supplier',
        email: 'provider1@example.com',
        phone: '+1234567890',
        website: 'https://provider1.com',
        address: '123 Main St, City, Country',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'prov_2',
        name: 'Provider 2',
        description: 'Secondary supplier',
        email: 'provider2@example.com',
        phone: '+0987654321',
        website: 'https://provider2.com',
        address: '456 Oak Ave, City, Country',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    // Filter logic
    let filteredProviders = providers
    if (search && typeof search === 'string') {
      filteredProviders = providers.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (is_active !== undefined) {
      filteredProviders = filteredProviders.filter(p => p.is_active === (is_active === 'true'))
    }

    // Pagination
    const total = filteredProviders.length
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedProviders = filteredProviders.slice(startIndex, endIndex)

    res.json({
      providers: paginatedProviders,
      count: paginatedProviders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /admin/providers - Create a new provider
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const validatedData = CreateProviderSchema.parse(req.body)

    // Mock creation - Replace with actual database insertion
    const newProvider = {
      id: `prov_${Date.now()}`,
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date()
    }

    res.status(201).json({ provider: newProvider })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    console.error('Error creating provider:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
