import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { z } from 'zod'

const SplitOrderSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  splits: z.array(z.object({
    provider_id: z.string().min(1, 'Provider ID is required'),
    items: z.array(z.object({
      line_item_id: z.string().min(1, 'Line item ID is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1')
    })).min(1, 'At least one item is required')
  })).min(1, 'At least one split is required')
})

// POST /admin/orders/split - Split an order between multiple providers
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const validatedData = SplitOrderSchema.parse(req.body)
    const { order_id, splits } = validatedData

    // Mock order data - Replace with actual order service
    const order = {
      id: order_id,
      status: 'pending',
      items: [
        { id: 'item_1', product_id: 'prod_1', quantity: 2, unit_price: 100 },
        { id: 'item_2', product_id: 'prod_2', quantity: 1, unit_price: 200 }
      ]
    }

    // Validate that split quantities don't exceed order quantities
    const itemQuantityMap = new Map()
    order.items.forEach(item => {
      itemQuantityMap.set(item.id, item.quantity)
    })

    const splitQuantityMap = new Map()
    splits.forEach(split => {
      split.items.forEach(item => {
        const currentSplitQuantity = splitQuantityMap.get(item.line_item_id) || 0
        splitQuantityMap.set(item.line_item_id, currentSplitQuantity + item.quantity)
      })
    })

    // Check if split quantities match order quantities
    for (const [itemId, orderQuantity] of itemQuantityMap) {
      const splitQuantity = splitQuantityMap.get(itemId) || 0
      if (splitQuantity !== orderQuantity) {
        return res.status(400).json({
          error: `Split quantity (${splitQuantity}) doesn't match order quantity (${orderQuantity}) for item ${itemId}`
        })
      }
    }

    // Create provider fulfillments
    const providerFulfillments = splits.map(split => ({
      id: `pf_${Date.now()}_${split.provider_id}`,
      order_id,
      provider_id: split.provider_id,
      status: 'pending',
      items: split.items.map(item => ({
        id: `pfi_${Date.now()}_${item.line_item_id}`,
        provider_fulfillment_id: `pf_${Date.now()}_${split.provider_id}`,
        line_item_id: item.line_item_id,
        quantity: item.quantity,
        created_at: new Date(),
        updated_at: new Date()
      })),
      created_at: new Date(),
      updated_at: new Date()
    }))

    res.status(201).json({
      message: 'Order split successfully',
      order_id,
      provider_fulfillments: providerFulfillments
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      })
    }
    console.error('Error splitting order:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /admin/orders/split/:order_id - Get split information for an order
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { order_id } = req.params

    // Mock data - Replace with actual database queries
    const providerFulfillments = [
      {
        id: 'pf_1',
        order_id,
        provider_id: 'prov_1',
        provider_name: 'Provider 1',
        status: 'pending',
        items: [
          {
            id: 'pfi_1',
            line_item_id: 'item_1',
            product_title: 'Product 1',
            quantity: 1,
            unit_price: 100
          }
        ],
        total_amount: 100,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'pf_2',
        order_id,
        provider_id: 'prov_2',
        provider_name: 'Provider 2',
        status: 'pending',
        items: [
          {
            id: 'pfi_2',
            line_item_id: 'item_1',
            product_title: 'Product 1',
            quantity: 1,
            unit_price: 100
          },
          {
            id: 'pfi_3',
            line_item_id: 'item_2',
            product_title: 'Product 2',
            quantity: 1,
            unit_price: 200
          }
        ],
        total_amount: 300,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    res.json({
      order_id,
      provider_fulfillments: providerFulfillments,
      total_splits: providerFulfillments.length
    })
  } catch (error) {
    console.error('Error fetching order splits:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
