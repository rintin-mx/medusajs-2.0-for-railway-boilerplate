import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Badge,
  Text,
  IconButton
} from "@medusajs/ui"
import { PencilSquare, Trash, Plus, Eye } from "@medusajs/icons"

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
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

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

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider)
    setShowEditModal(true)
  }

  const handleDelete = async (provider: Provider) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${provider.name}"? This action cannot be undone.`)

    if (confirmed) {
      try {
        // En producción, llamar a la API real para eliminar
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
      // En producción, llamar a la API real
      await fetchProviders() // Refrescar la lista
    } catch (error) {
      console.error('Error updating provider status:', error)
    }
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
        <Text>Loading providers...</Text>
      </div>
    )
  }

  return (
    <div className="px-6 py-4">
      {/* Header con botón de crear */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Text size="large" weight="plus">Provider Management</Text>
          <Text className="text-ui-fg-muted">
            Manage shipping, fulfillment, and inventory providers
          </Text>
        </div>
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Tabla de providers */}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Provider</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Configuration</Table.HeaderCell>
            <Table.HeaderCell>Last Updated</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
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
                      +{Object.keys(provider.config).length - 2} more...
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
                    title="View Details"
                  >
                    <Eye />
                  </IconButton>

                  <IconButton
                    variant="transparent"
                    size="small"
                    onClick={() => handleEdit(provider)}
                    title="Edit Provider"
                  >
                    <PencilSquare />
                  </IconButton>

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleToggleStatus(provider)}
                    title={provider.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {provider.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>

                  <IconButton
                    variant="transparent"
                    size="small"
                    onClick={() => handleDelete(provider)}
                    title="Delete Provider"
                  >
                    <Trash className="text-ui-fg-error" />
                  </IconButton>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {providers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Text size="large" className="mb-2">No providers found</Text>
          <Text className="text-ui-fg-muted mb-4">
            Get started by creating your first provider
          </Text>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="mr-2" />
            Add Provider
          </Button>
        </div>
      )}

      {/* TODO: Implementar modales de crear y editar */}
      {showCreateModal && (
        <div>
          {/* Modal de crear provider - implementar después */}
        </div>
      )}

      {showEditModal && selectedProvider && (
        <div>
          {/* Modal de editar provider - implementar después */}
        </div>
      )}
    </div>
  )
}
