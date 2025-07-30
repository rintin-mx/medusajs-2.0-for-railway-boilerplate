import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { useState, useEffect } from "react"

type ProductWithProviders = AdminProduct & {
  providers?: Array<{
    id: string
    provider_id: string
    provider_name: string
    provider_product_id?: string
    cost_price?: number
    is_available: boolean
  }>
}

const ProductProviderWidget = ({ data }: DetailWidgetProps<ProductWithProviders>) => {
  const [providers, setProviders] = useState([])
  const [allProviders, setAllProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductProviders()
    fetchAllProviders()
  }, [data.id])

  const fetchProductProviders = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockProviders = [
        {
          id: "pp_1",
          provider_id: "prov_1",
          provider_name: "Provider 1",
          provider_product_id: "PROV_SKU_001",
          cost_price: 80,
          is_available: true
        },
        {
          id: "pp_2",
          provider_id: "prov_2",
          provider_name: "Provider 2",
          provider_product_id: "PROV_SKU_002",
          cost_price: 75,
          is_available: true
        }
      ]
      setProviders(mockProviders)
    } catch (error) {
      console.error('Error fetching product providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProviders = async () => {
    try {
      // Mock data - Replace with actual API call
      const mockAllProviders = [
        { id: "prov_1", name: "Provider 1", is_active: true },
        { id: "prov_2", name: "Provider 2", is_active: true },
        { id: "prov_3", name: "Provider 3", is_active: true }
      ]
      setAllProviders(mockAllProviders)
    } catch (error) {
      console.error('Error fetching all providers:', error)
    }
  }

  const handleAssignProvider = async (providerId: string) => {
    try {
      // Mock API call - Replace with actual API call
      console.log(`Assigning product ${data.id} to provider ${providerId}`)
      await fetchProductProviders() // Refresh the list
    } catch (error) {
      console.error('Error assigning provider:', error)
    }
  }

  const handleRemoveProvider = async (providerId: string) => {
    try {
      // Mock API call - Replace with actual API call
      console.log(`Removing product ${data.id} from provider ${providerId}`)
      await fetchProductProviders() // Refresh the list
    } catch (error) {
      console.error('Error removing provider:', error)
    }
  }

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Providers</Heading>
        </div>
        <div className="px-6 py-4">
          <Text>Loading providers...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Providers</Heading>
        <Button variant="secondary" size="small">
          Assign Provider
        </Button>
      </div>

      <div className="px-6 py-4">
        {providers.length === 0 ? (
          <Text className="text-ui-fg-muted">
            No providers assigned to this product.
          </Text>
        ) : (
          <div className="space-y-3">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3 border border-ui-border-base rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Text className="font-medium">{provider.provider_name}</Text>
                    <Badge
                      color={provider.is_available ? "green" : "red"}
                      size="small"
                    >
                      {provider.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>

                  <div className="flex gap-4 text-sm text-ui-fg-muted">
                    {provider.provider_product_id && (
                      <span>SKU: {provider.provider_product_id}</span>
                    )}
                    {provider.cost_price && (
                      <span>Cost: ${provider.cost_price}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="transparent" size="small">
                    Edit
                  </Button>
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => handleRemoveProvider(provider.provider_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductProviderWidget
