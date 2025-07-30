import { defineWidgetConfig } from "@medusajs/admin-sdk"

// Tipos básicos para el producto (sin importar desde framework/types)
interface Product {
  id: string
  title: string
  status: string
}

// Widget para mostrar provider en la tabla de productos
const ProductProviderColumn = ({ data }: { data: Product }) => {
  // En un caso real, obtendrías esta información del producto
  // Por ahora simulo que algunos productos tienen provider
  const hasProvider = Math.random() > 0.5
  const providerName = hasProvider ? `Provider ${Math.floor(Math.random() * 3) + 1}` : null

  if (!hasProvider) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        No Provider
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {providerName}
    </span>
  )
}

export const config = defineWidgetConfig({
  zone: "product.list.before", // Se mostrará en la lista de productos
})

export default ProductProviderColumn
