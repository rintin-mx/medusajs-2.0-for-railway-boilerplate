import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useParams } from "react-router-dom"
import { Container, Heading, Button, Badge, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import { ArrowLeft, PencilSquare } from "@medusajs/icons"

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

const ProviderDetailsPage = () => {
  const { id } = useParams()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProvider()
  }, [id])

  const fetchProvider = async () => {
    try {
      setLoading(true)
      // Mock data - En producción, llamar a la API real
      const mockProvider: Provider = {
        id: id!,
        name: 'DHL Express',
        type: 'shipping',
        status: 'active',
        config: {
          api_key: 'dhl_live_key_***',
          endpoint: 'https://api.dhl.com/v1',
          region: 'US',
          timeout: 30000,
          max_retries: 3,
          webhook_url: 'https://mystore.com/webhooks/dhl'
        },
        metadata: {
          priority: 'high',
          cost_per_kg: 15.50,
          estimated_delivery_days: 2,
          supports_tracking: true
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

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Text>Loading provider details...</Text>
        </div>
      </Container>
    )
  }

  if (!provider) {
    return (
      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Text>Provider not found</Text>
        </div>
      </Container>
    )
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

  return (
    <Container className="divide-y p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="small">
            <ArrowLeft className="mr-2" />
            Back to Providers
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon(provider.type)}</span>
            <div>
              <Heading level="h1">{provider.name}</Heading>
              <Text className="text-ui-fg-muted">{provider.id}</Text>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge color={getStatusColor(provider.status)} size="small">
            {provider.status}
          </Badge>
          <Button variant="secondary" size="small">
            <PencilSquare className="mr-2" />
            Edit Provider
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="px-6 py-4">
        <Heading level="h2" className="mb-4">Basic Information</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text className="text-ui-fg-subtle mb-1 font-medium">Provider Name</Text>
            <Text>{provider.name}</Text>
          </div>
          <div>
            <Text className="text-ui-fg-subtle mb-1 font-medium">Type</Text>
            <Badge variant="neutral" size="small">
              {provider.type}
            </Badge>
          </div>
          <div>
            <Text className="text-ui-fg-subtle mb-1 font-medium">Status</Text>
            <Badge color={getStatusColor(provider.status)} size="small">
              {provider.status}
            </Badge>
          </div>
          <div>
            <Text className="text-ui-fg-subtle mb-1 font-medium">Last Updated</Text>
            <Text>{provider.updated_at.toLocaleString()}</Text>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="px-6 py-4">
        <Heading level="h3" className="mb-4">Configuration</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(provider.config).map(([key, value]) => (
            <div key={key} className="p-4 border border-ui-border-base rounded-lg">
              <Text className="text-ui-fg-subtle mb-1 font-medium">
                {key.replace(/_/g, ' ').replace(/\w\S*/g, (txt) =>
                  txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                )}
              </Text>
              <Text>
                {typeof value === 'string' && (key.includes('key') || key.includes('secret'))
                  ? '***' + value.slice(-4)
                  : String(value)
                }
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      {provider.metadata && Object.keys(provider.metadata).length > 0 && (
        <div className="px-6 py-4">
          <Heading level="h3" className="mb-4">Metadata</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(provider.metadata).map(([key, value]) => (
              <div key={key} className="p-4 border border-ui-border-base rounded-lg">
                <Text className="text-ui-fg-subtle mb-1 font-medium">
                  {key.replace(/_/g, ' ').replace(/\w\S*/g, (txt) =>
                    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                  )}
                </Text>
                <Text>{String(value)}</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="px-6 py-4">
        <Heading level="h3" className="mb-4">Recent Activity</Heading>
        <div className="space-y-3">
          {/* Mock activity data */}
          <div className="flex items-center gap-3 p-3 bg-ui-bg-subtle rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <Text size="small" weight="plus">Provider activated</Text>
              <Text size="small" className="text-ui-fg-muted">
                2 hours ago
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-ui-bg-subtle rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <Text size="small" weight="plus">Configuration updated</Text>
              <Text size="small" className="text-ui-fg-muted">
                1 day ago
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-ui-bg-subtle rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div>
              <Text size="small" weight="plus">Provider created</Text>
              <Text size="small" className="text-ui-fg-muted">
                15 days ago
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Provider Details",
})

export default ProviderDetailsPage
