import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { z } from 'zod'

const AssignProductSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  provider_id: z.string().min(1, 'Provider ID is required'),
  provider_product_id: z.string().optional(),
  cost_price: z.number().min(0).optional(),
  is_available: z.boolean().default(true)
})

// GET /admin/providers/:id/products - Get products assigned to a provider
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id: provider_id } = req.params
    const { page = 1, limit = 20, search = '' } = req.query

    // Mock data - Replace with actual database queries
    const products = [
      {
        id: 'pp_1',
        product_id: 'prod_1',
        provider_id,
        product_title: 'Product 1',
        product_handle: 'product-1',
        provider_product_id: 'PROV_SKU_001',
        cost_price: 80,
        retail_price: 100,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'pp_2',
        product_id: 'prod_2',
        provider_id,
        product_title: 'Product 2',
        product_handle: 'product-2',
        provider_product_id: 'PROV_SKU_002',
        cost_price: 150,
        retail_price: 200,
        is_available: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    // Filter logic
    let filteredProducts = products
    if (search) {
      filteredProducts = products.filter(p =>
        p.product_title.toLowerCase().includes(search.toLowerCase()) ||
        p.provider_product_id?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Pagination
    const total = filteredProducts.length
    const startIndex = (Number(page) - 1) * Number(limit)
    const endIndex = startIndex + Number(limit)
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    res.json({
      products: paginatedProducts,
      count: paginatedProducts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    })
  } catch (error) {
    console.error('Error fetching provider products:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// POST /admin/providers/:id/products - Assign a product to a provider
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id: provider_id } = req.params
    const validatedData = AssignProductSchema.parse({
      ...req.body,
      provider_id
    })

    // Check if product is already assigned to this provider
    // Mock check - Replace with actual database query
    const existingAssignment = false // await checkProductProviderAssignment(validatedData.product_id, provider_id)

    if (existingAssignment) {
      return res.status(409).json({
        error: 'Product is already assigned to this provider'
      })
    }

    // Create the assignment
    const productProvider = {
      id: `pp_${Date.now()}`,
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date()
    }

    res.status(201).json({
      message: 'Product assigned successfully',
      product_provider: productProvider
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    console.error('Error assigning product to provider:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
