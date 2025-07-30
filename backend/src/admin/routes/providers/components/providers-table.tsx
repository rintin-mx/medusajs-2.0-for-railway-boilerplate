import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Badge,
  Text,
  IconButton
} from "@medusajs/ui"
import {
  PencilSquare,
  Trash,
  Plus,
  Eye
} from "@medusajs/icons"

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

export const ProvidersTable = () => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      // En desarrollo, usar datos mock. En producción, llamar a la API real
      const mockProviders: Provider[] = [
        {
          id: 'prov_1',
          name: 'DHL Express',
          type: 'shipping',
          status: 'active',
          config: {
            api_key: '***',
            endpoint: 'https://api.dhl.com',
            region: 'US'
          },
          metadata: { priority: 'high' },
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-20')
        },
        {
          id: 'prov_2',
          name: 'FedEx Ground',
          type: 'shipping',
          status: 'active',
          config: {
            api_key: '***',
            service_type: 'ground'
          },
          metadata: {},
          created_at: new Date('2024-01-10'),
          updated_at: new Date('2024-01-15')
        },
        {
          id: 'prov_3',
          name: 'Local Warehouse',
          type: 'fulfillment',
          status: 'inactive',
          config: {
            address: '123 Warehouse St',
            capacity: 10000
          },
          metadata: {},
          created_at: new Date('2024-01-05'),
          updated_at: new Date('2024-01-10')
        }
      ]

      setProviders(mockProviders)
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (provider: Provider) => {
    window.location.href = `/admin/providers/${provider.id}`
  }

  const handleEdit = (provider: Provider) => {
    console.log('Edit provider:', provider.id)
  }

  const handleDelete = async (provider: Provider) => {
    const confirmed = window.confirm(`¿Estás seguro de que quieres eliminar "${provider.name}"? Esta acción no se puede deshacer.`)

    if (confirmed) {
      try {
        console.log(`Deleting provider ${provider.id}`)
        await fetchProviders() // Refrescar la lista
      } catch (error) {
        console.error('Error deleting provider:', error)
      }
    }
  }

  const handleToggleStatus = async (provider: Provider) => {
    try {
      const newStatus = provider.status === 'active' ? 'inactive' : 'active'
      console.log(`Toggling provider ${provider.id} status to ${newStatus}`)
      await fetchProviders() // Refrescar la lista
    } catch (error) {
      console.error('Error updating provider status:', error)
    }
  }

  const handleCreate = () => {
    console.log('Create new provider')
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
      <div className="flex items-center justify-center h-64">
        <Text>Cargando proveedores...</Text>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      {/* Header con botón de crear */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Text size="large" weight="plus">Gestión de Proveedores</Text>
          <Text className="text-ui-fg-muted">
            Administra proveedores de envío, cumplimiento e inventario
          </Text>
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={handleCreate}
        >
          <Plus className="mr-2" />
          Agregar Proveedor
        </Button>
      </div>

      {/* Tabla de providers */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Proveedor</Table.HeaderCell>
              <Table.HeaderCell>Tipo</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Configuración</Table.HeaderCell>
              <Table.HeaderCell>Última Actualización</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {providers.map((provider) => (
              <Table.Row key={provider.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(provider.type)}</span>
                    <div>
                      <Text weight="plus">{provider.name}</Text>
                      <Text size="small" className="text-ui-fg-muted">
                        {provider.id}
                      </Text>
                    </div>
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <Badge variant="neutral" size="small">
                    {provider.type}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  <Badge
                    color={getStatusColor(provider.status)}
                    size="small"
                  >
                    {provider.status}
                  </Badge>
                </Table.Cell>

                <Table.Cell>
                  <div className="space-y-1">
                    {Object.entries(provider.config).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Text size="small" className="text-ui-fg-muted min-w-16">
                          {key}:
                        </Text>
                        <Text size="small">
                          {typeof value === 'string' && value.includes('***')
                            ? '***'
                            : String(value).substring(0, 20) + (String(value).length > 20 ? '...' : '')
                          }
                        </Text>
                      </div>
                    ))}
                    {Object.keys(provider.config).length > 2 && (
                      <Text size="small" className="text-ui-fg-muted">
                        +{Object.keys(provider.config).length - 2} más...
                      </Text>
                    )}
                  </div>
                </Table.Cell>

                <Table.Cell>
                  <Text size="small" className="text-ui-fg-muted">
                    {provider.updated_at.toLocaleDateString()}
                  </Text>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="transparent"
                      size="small"
                      onClick={() => handleView(provider)}
                      title="Ver Detalles"
                    >
                      <Eye />
                    </IconButton>

                    <IconButton
                      variant="transparent"
                      size="small"
                      onClick={() => handleEdit(provider)}
                      title="Editar Proveedor"
                    >
                      <PencilSquare />
                    </IconButton>

                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleToggleStatus(provider)}
                      title={provider.status === 'active' ? 'Desactivar' : 'Activar'}
                    >
                      {provider.status === 'active' ? 'Desactivar' : 'Activar'}
                    </Button>

                    <IconButton
                      variant="transparent"
                      size="small"
                      onClick={() => handleDelete(provider)}
                      title="Eliminar Proveedor"
                    >
                      <Trash className="text-ui-fg-error" />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {providers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Text size="large" className="mb-2">No se encontraron proveedores</Text>
          <Text className="text-ui-fg-muted mb-4">
            Comienza creando tu primer proveedor
          </Text>
          <Button
            variant="primary"
            onClick={handleCreate}
          >
            <Plus className="mr-2" />
            Agregar Proveedor
          </Button>
        </div>
      )}
    </div>
  )
}
