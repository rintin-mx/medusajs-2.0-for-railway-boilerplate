import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

// Widget para mostrar información del provider en la página de producto
const ProductProviderWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [providerInfo, setProviderInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviderInfo = async () => {
      try {
        const response = await fetch(`/admin/products/${data.id}/availability`)
        if (response.ok) {
          const info = await response.json()
          setProviderInfo(info)
        }
      } catch (error) {
        console.error("Error fetching provider info:", error)
      } finally {
        setLoading(false)
      }
    }

    if (data.id) {
      fetchProviderInfo()
    }
  }, [data.id])

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Provider Information</Heading>
        </div>
        <div className="px-6 py-4">
          <Text>Loading provider information...</Text>
        </div>
      </Container>
    )
  }

  if (!providerInfo) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">Provider Information</Heading>
        </div>
        <div className="px-6 py-4">
          <Text>No provider assigned to this product</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Provider Information</Heading>
      </div>
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text className="text-ui-fg-subtle mb-1">Provider ID</Text>
            <Text>{providerInfo.provider_id}</Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle mb-1">Availability Status</Text>
            <Badge
              color={providerInfo.is_available ? "green" : "red"}
              size="small"
            >
              {providerInfo.availability_status}
            </Badge>
          </div>
        </div>
      </div>
    </Container>
  )
}

// Configuración del widget
export const config = defineWidgetConfig({
  zone: "product.details.after", // Se mostrará después de los detalles del producto
})

export default ProductProviderWidget
