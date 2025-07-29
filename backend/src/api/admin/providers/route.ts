import { Request, Response } from "express"
import ProviderService from "../../../modules/multi-provider-fulfillment/services/provider"

/**
 * GET /admin/providers
 * List all providers
 */
export async function GET(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerService = new ProviderService({ manager: (req as any).manager })
    const providers = await providerService.list(req.query || {}, {
      skip: parseInt(req.query.offset as string) || 0,
      take: parseInt(req.query.limit as string) || 50,
    })

    res.json({ providers })
  } catch (error) {
    console.error("Error listing providers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * POST /admin/providers
 * Create a new provider
 */
export async function POST(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerService = new ProviderService({ manager: (req as any).manager })
    const provider = await providerService.create(req.body)

    res.status(201).json({ provider })
  } catch (error) {
    console.error("Error creating provider:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * GET /admin/providers/:id
 * Get a provider by id
 */
export async function getProvider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerService = new ProviderService({ manager: (req as any).manager })
    const provider = await providerService.retrieve(req.params.id)

    res.json({ provider })
  } catch (error) {
    console.error("Error retrieving provider:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * PUT /admin/providers/:id
 * Update a provider
 */
export async function updateProvider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerService = new ProviderService({ manager: (req as any).manager })
    const provider = await providerService.update(req.params.id, req.body)

    res.json({ provider })
  } catch (error) {
    console.error("Error updating provider:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

/**
 * DELETE /admin/providers/:id
 * Delete a provider
 */
export async function deleteProvider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const providerService = new ProviderService({ manager: (req as any).manager })
    await providerService.delete(req.params.id)

    res.status(204).end()
  } catch (error) {
    console.error("Error deleting provider:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
