#!/usr/bin/env ts-node
import { ProviderService } from './services/provider'
import { CreateProviderData, UpdateProviderData } from './types'

/**
 * Script de pruebas completas para el CRUD de providers
 */
async function runProviderTests() {
  console.log('🧪 Iniciando pruebas completas del CRUD de Providers...')

  // Mock dependencies
  const mockLogger = {
    info: (message: string) => console.log(`ℹ️ ${message}`),
    error: (message: string, error?: any) => console.error(`❌ ${message}`, error),
    warn: (message: string) => console.warn(`⚠️ ${message}`),
    debug: (message: string) => console.debug(`🐛 ${message}`)
  }

  const mockContainer = {
    resolve: (serviceName: string) => {
      throw new Error(`Mock container - servicio ${serviceName} no implementado`)
    }
  }

  try {
    const providerService = new ProviderService({
      logger: mockLogger as any,
      container: mockContainer as any
    })

    console.log('✅ ProviderService creado exitosamente\n')

    // ========== CREATE TESTS ==========
    console.log('🔨 === PRUEBAS DE CREACIÓN ===')

    const dhlData: CreateProviderData = {
      name: 'DHL Express',
      type: 'shipping',
      config: {
        api_key: 'dhl_test_key',
        endpoint: 'https://api.dhl.com',
        region: 'US'
      },
      metadata: { priority: 'high', cost_per_kg: 15.50 }
    }

    const fedexData: CreateProviderData = {
      name: 'FedEx Ground',
      type: 'shipping',
      config: {
        api_key: 'fedex_test_key',
        service_type: 'ground'
      }
    }

    const warehouseData: CreateProviderData = {
      name: 'Local Warehouse',
      type: 'fulfillment',
      config: {
        address: '123 Warehouse St',
        capacity: 10000
      }
    }

    const dhlProvider = await providerService.createProvider(dhlData)
    const fedexProvider = await providerService.createProvider(fedexData)
    const warehouseProvider = await providerService.createProvider(warehouseData)

    console.log(`✅ DHL Provider creado: ${dhlProvider.id}`)
    console.log(`✅ FedEx Provider creado: ${fedexProvider.id}`)
    console.log(`✅ Warehouse Provider creado: ${warehouseProvider.id}\n`)

    // ========== READ TESTS ==========
    console.log('👀 === PRUEBAS DE LECTURA ===')

    const retrievedDHL = await providerService.getProvider(dhlProvider.id)
    console.log(`✅ DHL Provider recuperado: ${retrievedDHL?.name}`)

    const allProviders = await providerService.listProviders()
    console.log(`✅ Total providers: ${allProviders.length}`)

    const shippingProviders = await providerService.getProvidersByType('shipping')
    console.log(`✅ Providers de shipping: ${shippingProviders.length}`)

    const fulfillmentProviders = await providerService.getProvidersByType('fulfillment')
    console.log(`✅ Providers de fulfillment: ${fulfillmentProviders.length}\n`)

    // ========== UPDATE TESTS ==========
    console.log('✏️ === PRUEBAS DE ACTUALIZACIÓN ===')

    const updateData: UpdateProviderData = {
      status: 'active',
      config: {
        api_key: 'dhl_updated_key',
        endpoint: 'https://api.dhl.com',
        region: 'US',
        new_feature: true
      },
      metadata: {
        priority: 'high',
        cost_per_kg: 14.75,
        updated_reason: 'Price adjustment'
      }
    }

    const updatedDHL = await providerService.updateProvider(dhlProvider.id, updateData)
    console.log(`✅ DHL Provider actualizado - Status: ${updatedDHL.status}`)

    // Toggle status test
    const toggledProvider = await providerService.toggleProviderStatus(fedexProvider.id)
    console.log(`✅ FedEx status cambiado a: ${toggledProvider.status}\n`)

    // ========== PROVIDER FULFILLMENT TESTS ==========
    console.log('📦 === PRUEBAS DE FULFILLMENTS ===')

    // Activar provider antes de crear fulfillment
    await providerService.updateProvider(dhlProvider.id, { status: 'active' })

    const fulfillmentData = {
      provider_id: dhlProvider.id,
      order_id: 'order_test_123',
      items: [
        {
          product_id: 'prod_1',
          variant_id: 'var_1',
          quantity: 2
        },
        {
          product_id: 'prod_2',
          variant_id: 'var_2',
          quantity: 1
        }
      ],
      metadata: { priority: 'urgent' }
    }

    const fulfillment = await providerService.createProviderFulfillment(fulfillmentData)
    console.log(`✅ Fulfillment creado: ${fulfillment.id}`)
    console.log(`✅ Items en fulfillment: ${fulfillment.items.length}`)

    // Complete fulfillment
    const completedFulfillment = await providerService.completeProviderFulfillment(
      fulfillment.id,
      'DHL123456789_DELIVERED'
    )
    console.log(`✅ Fulfillment completado: ${completedFulfillment.status}\n`)

    // ========== STATISTICS TESTS ==========
    console.log('📊 === PRUEBAS DE ESTADÍSTICAS ===')

    const stats = await providerService.getProviderStats(dhlProvider.id)
    console.log(`✅ Estadísticas de DHL:`)
    console.log(`   - Total fulfillments: ${stats.total_fulfillments}`)
    console.log(`   - Completados: ${stats.completed}\n`)

    // ========== DELETE TESTS ==========
    console.log('🗑️ === PRUEBAS DE ELIMINACIÓN ===')

    // Eliminar provider sin fulfillments activos
    const deleteResult = await providerService.deleteProvider(warehouseProvider.id)
    console.log(`✅ Warehouse provider eliminado: ${deleteResult}\n`)

    console.log('🎉 ¡TODAS LAS PRUEBAS DE CRUD COMPLETADAS EXITOSAMENTE!')
    console.log('='.repeat(50))
    console.log('✅ Create - Creación de providers')
    console.log('✅ Read - Lectura y consultas')
    console.log('✅ Update - Actualización de datos')
    console.log('✅ Delete - Eliminación con validaciones')
    console.log('✅ Provider Fulfillments - Gestión completa')
    console.log('✅ Statistics - Métricas y reportes')

  } catch (error) {
    console.error('💥 Error durante las pruebas:', error)
    throw error
  }
}

// Ejecutar las pruebas
runProviderTests().then(() => {
  console.log('✨ Script de pruebas completado exitosamente')
}).catch(error => {
  console.error('Error en el script:', error)
  process.exit(1)
})
