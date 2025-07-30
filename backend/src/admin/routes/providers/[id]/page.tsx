import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Heading, Container, Button, Badge, Text } from "@medusajs/ui"
import { ArrowLeft, PencilSquare } from "@medusajs/icons"
import { useState, useEffect } from "react"

interface Provider {
  id: string
  name: string
  type: 'shipping' | 'fulfillment' | 'inventory'
  status: 'active' | 'inactive' | 'pending'
  config: Record<string, any>
  metadata?: Record<string, any>
  created_at: Date
  updated_at: Date
}

const ProviderDetailPage = ({ params }: { params: { id: string } }) => {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProvider()
  }, [params.id])

  const fetchProvider = async () => {
    try {
      setLoading(true)
      // Mock data - reemplazar con llamada real a la API
      const mockProvider: Provider = {
        id: params.id,
        name: params.id === 'prov_1' ? 'DHL Express' : params.id === 'prov_2' ? 'FedEx Ground' : 'Local Warehouse',
        type: params.id === 'prov_3' ? 'fulfillment' : 'shipping',
        status: params.id === 'prov_3' ? 'inactive' : 'active',
        config: {
          api_key: '***masked***',
          endpoint: 'https://api.example.com',
          region: 'US',
          timeout: 30000,
          retries: 3
        },
        metadata: {
          priority: 'high',
          created_by: 'admin@example.com'
        },
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-20')
      }

      setProvider(mockProvider)
    } catch (error) {
      console.error('Error fetching provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    console.log('Edit provider:', provider?.id)
  }

  const handleToggleStatus = () => {
    if (!provider) return
    const newStatus = provider.status === 'active' ? 'inactive' : 'active'
    console.log(`Toggle status to: ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'inactive': return 'red'
      case 'pending': return 'orange'
      default: return 'grey'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shipping': return '🚚'
      case 'fulfillment': return '📦'
      case 'inventory': return '📋'
      default: return '⚙️'
    }
  }

  if (loading) {
    return (
      <Container className="p-6">
        <Text>Cargando proveedor...</Text>
      </Container>
    )
  }

  if (!provider) {
    return (
      <Container className="p-6">
        <Text>Proveedor no encontrado</Text>
      </Container>
    )
  }

  return (
    <Container className="divide-y p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="small" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(provider.type)}</span>
            <div>
              <Heading level="h1">{provider.name}</Heading>
              <Text className="text-ui-fg-muted">{provider.id}</Text>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={getStatusColor(provider.status)} size="small">
            {provider.status}
          </Badge>
          <Button variant="secondary" size="small" onClick={handleEdit}>
            <PencilSquare className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant={provider.status === 'active' ? 'danger' : 'primary'}
            size="small"
            onClick={handleToggleStatus}
          >
            {provider.status === 'active' ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-6">
        {/* Información General */}
        <div>
          <Heading level="h2">Información General</Heading>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text weight="plus" className="text-ui-fg-muted">Tipo</Text>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="neutral" size="small">{provider.type}</Badge>
              </div>
            </div>
            <div>
              <Text weight="plus" className="text-ui-fg-muted">Estado</Text>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={getStatusColor(provider.status)} size="small">
                  {provider.status}
                </Badge>
              </div>
            </div>
            <div>
              <Text weight="plus" className="text-ui-fg-muted">Creado</Text>
              <Text className="mt-1">{provider.created_at.toLocaleDateString()}</Text>
            </div>
            <div>
              <Text weight="plus" className="text-ui-fg-muted">Última actualización</Text>
              <Text className="mt-1">{provider.updated_at.toLocaleDateString()}</Text>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div>
          <Heading level="h2">Configuración</Heading>
          <div className="mt-4 bg-ui-bg-subtle rounded-md p-4">
            <div className="space-y-3">
              {Object.entries(provider.config).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Text weight="plus" className="text-ui-fg-muted capitalize">
                    {key.replace(/_/g, ' ')}
                  </Text>
                  <Text className="font-mono text-sm">
                    {typeof value === 'string' && value.includes('***')
                      ? '***masked***'
                      : String(value)
                    }
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata */}
        {provider.metadata && Object.keys(provider.metadata).length > 0 && (
          <div>
            <Heading level="h2">Metadatos</Heading>
            <div className="mt-4 bg-ui-bg-subtle rounded-md p-4">
              <div className="space-y-3">
                {Object.entries(provider.metadata).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Text weight="plus" className="text-ui-fg-muted capitalize">
                      {key.replace(/_/g, ' ')}
                    </Text>
                    <Text className="font-mono text-sm">{String(value)}</Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Detalles del Proveedor",
})

export default ProviderDetailPage
