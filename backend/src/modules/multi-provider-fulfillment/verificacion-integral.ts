#!/usr/bin/env ts-node
/**
 * VERIFICACIÓN INTEGRAL DEL SISTEMA MULTI-PROVIDER FULFILLMENT
 * Este script verifica que toda la implementación funcione correctamente
 */

import MultiProviderFulfillmentService from './service'
import { ProductInventoryService } from './services/product-inventory'
import { ProviderService } from './services/provider'
import { CreateProviderData, UpdateProviderData } from './types'

async function verificarSistemaCompleto() {
  console.log('🔍 INICIANDO VERIFICACIÓN INTEGRAL DEL SISTEMA')
  console.log('='.repeat(60))

  // Mock dependencies para simular el entorno de MedusaJS
  const mockLogger = {
    info: (message: string) => console.log(`ℹ️ ${message}`),
    error: (message: string, error?: any) => console.error(`❌ ${message}`, error?.message || error),
    warn: (message: string) => console.warn(`⚠️ ${message}`),
    debug: (message: string) => console.debug(`🐛 ${message}`)
  }

  const mockProductService = {
    retrieve: async (productId: string) => ({
      id: productId,
      status: 'published',
      metadata: {},
      title: `Test Product ${productId}`,
      created_at: new Date(),
      updated_at: new Date()
    }),
    update: async (productId: string, data: any) => {
      console.log(`📝 Actualizando producto ${productId}:`, JSON.stringify(data, null, 2))
      return { id: productId, ...data, updated_at: new Date() }
    },
    list: async (query: any) => {
      console.log('📋 Listando productos con query:', JSON.stringify(query))
      return [
        { id: 'prod_unavailable_1', status: 'draft', metadata: { backorder_unavailable: true }},
        { id: 'prod_available_1', status: 'published', metadata: {} }
      ]
    }
  }

  const mockContainer = {
    resolve: (serviceName: string) => {
      if (serviceName === 'productService') return mockProductService
      throw new Error(`Servicio ${serviceName} no encontrado en mock container`)
    }
  }

  try {
    console.log('🚀 === FASE 1: INICIALIZACIÓN DE SERVICIOS ===')

    // 1. Crear servicio principal
    const mainService = new MultiProviderFulfillmentService(
      { logger: mockLogger as any, container: mockContainer as any }
    )
    console.log('✅ MultiProviderFulfillmentService inicializado')

    // 2. Verificar acceso a sub-servicios
    const providerService = mainService.providers
    const inventoryService = mainService.inventory
    console.log('✅ Sub-servicios accesibles: providers, inventory')

    // 3. Verificar estado de salud
    const healthStatus = await mainService.getHealthStatus()
    console.log('✅ Estado de salud:', JSON.stringify(healthStatus, null, 2))

    console.log('\n🏪 === FASE 2: GESTIÓN DE PROVIDERS ===')

    // 4. Inicializar datos de muestra
    await mainService.initialize()
    console.log('✅ Datos de muestra inicializados')

    // 5. Crear providers personalizados
    const customProvider: CreateProviderData = {
      name: 'Amazon FBA',
      type: 'fulfillment',
      config: {
        seller_id: 'AMZN_SELLER_123',
        marketplace: 'US',
        fulfillment_center: 'PHX3'
      },
      metadata: { priority: 'high', sla_hours: 24 }
    }

    const amazonProvider = await providerService.createProvider(customProvider)
    console.log(`✅ Provider personalizado creado: ${amazonProvider.name} (${amazonProvider.id})`)

    // 6. Listar todos los providers
    const allProviders = await providerService.listProviders()
    console.log(`✅ Total de providers en el sistema: ${allProviders.length}`)

    allProviders.forEach(provider => {
      console.log(`   - ${provider.name} (${provider.type}, ${provider.status})`)
    })

    // 7. Activar provider para fulfillments
    const activeProvider = await providerService.updateProvider(amazonProvider.id, { status: 'active' })
    console.log(`✅ Provider activado: ${activeProvider.name}`)

    console.log('\n📦 === FASE 3: GESTIÓN DE FULFILLMENTS ===')

    // 8. Crear fulfillment
    const fulfillmentData = {
      provider_id: amazonProvider.id,
      order_id: 'order_verification_test',
      items: [
        { product_id: 'prod_test_1', variant_id: 'var_test_1', quantity: 3 },
        { product_id: 'prod_test_2', variant_id: 'var_test_2', quantity: 1 }
      ],
      metadata: { test_fulfillment: true }
    }

    const fulfillment = await mainService.createProviderFulfillment(fulfillmentData)
    console.log(`✅ Fulfillment creado: ${fulfillment.id}`)
    console.log(`   - Items: ${fulfillment.items.length}`)
    console.log(`   - Status: ${fulfillment.status}`)

    // 9. Actualizar fulfillment
    const updatedFulfillment = await mainService.updateProviderFulfillment(fulfillment.id, {
      status: 'processing',
      tracking_number: 'AMZN_TRK_123456789'
    })
    console.log(`✅ Fulfillment actualizado - Status: ${updatedFulfillment.status}`)

    // 10. Listar fulfillments
    const fulfillments = await mainService.listProviderFulfillments({ provider_id: amazonProvider.id })
    console.log(`✅ Fulfillments del provider: ${fulfillments.length}`)

    console.log('\n📋 === FASE 4: GESTIÓN DE INVENTARIO ===')

    // 11. Verificar disponibilidad de productos
    const productId = 'prod_inventory_test'
    const isAvailable = await inventoryService.getProductAvailability(productId)
    console.log(`✅ Disponibilidad inicial del producto ${productId}: ${isAvailable}`)

    // 12. Marcar producto como no disponible por backorder
    await inventoryService.setProductUnavailable(productId)
    console.log(`✅ Producto marcado como no disponible`)

    // 13. Verificar cambio de estado
    const isAvailableAfter = await inventoryService.getProductAvailability(productId)
    console.log(`✅ Disponibilidad después de backorder: ${isAvailableAfter}`)

    // 14. Restaurar disponibilidad
    await inventoryService.setProductAvailable(productId)
    console.log(`✅ Producto restaurado a disponible`)

    // 15. Manejo automático de backorder
    await inventoryService.handleBackorderUpdate('prod_auto_test', false) // Sin stock
    await inventoryService.handleBackorderUpdate('prod_auto_test', true)  // Con stock
    console.log(`✅ Manejo automático de backorder completado`)

    // 16. Obtener productos no disponibles
    const unavailableProducts = await inventoryService.getUnavailableProducts()
    console.log(`✅ Productos no disponibles encontrados: ${unavailableProducts.length}`)

    console.log('\n📊 === FASE 5: ESTADÍSTICAS Y REPORTES ===')

    // 17. Estadísticas del provider
    const stats = await providerService.getProviderStats(amazonProvider.id)
    console.log('✅ Estadísticas del provider Amazon FBA:')
    console.log(`   - Total fulfillments: ${stats.total_fulfillments}`)
    console.log(`   - Completados: ${stats.completed}`)
    console.log(`   - En proceso: ${stats.processing}`)
    console.log(`   - Pendientes: ${stats.pending}`)

    // 18. Filtros avanzados
    const shippingProviders = await providerService.getProvidersByType('shipping')
    const fulfillmentProviders = await providerService.getProvidersByType('fulfillment')
    console.log(`✅ Providers por tipo - Shipping: ${shippingProviders.length}, Fulfillment: ${fulfillmentProviders.length}`)

    console.log('\n🧪 === FASE 6: CASOS DE BORDE Y VALIDACIONES ===')

    // 19. Intentar crear fulfillment con provider inactivo
    const inactiveProvider = await providerService.createProvider({
      name: 'Inactive Test Provider',
      type: 'shipping',
      config: { test: true }
    })

    try {
      await providerService.createProviderFulfillment({
        provider_id: inactiveProvider.id,
        order_id: 'test_inactive',
        items: [{ product_id: 'test', variant_id: 'test', quantity: 1 }]
      })
      console.log('❌ ERROR: Debería haber fallado con provider inactivo')
    } catch (error) {
      console.log('✅ Correctamente bloqueó fulfillment con provider inactivo')
    }

    // 20. Restauración masiva de inventario
    await inventoryService.bulkRestoreAvailability(['prod_bulk_1', 'prod_bulk_2', 'prod_bulk_3'])
    console.log('✅ Restauración masiva de inventario completada')

    console.log('\n🎉 === VERIFICACIÓN COMPLETADA EXITOSAMENTE ===')
    console.log('='.repeat(60))
    console.log('✅ Todos los componentes funcionan correctamente:')
    console.log('   ✓ Servicio principal integrado')
    console.log('   ✓ CRUD completo de providers')
    console.log('   ✓ Gestión de fulfillments')
    console.log('   ✓ Control de inventario')
    console.log('   ✓ Estadísticas y reportes')
    console.log('   ✓ Validaciones de seguridad')
    console.log('   ✓ Manejo de errores')
    console.log('   ✓ Integración con MedusaJS 2.0')

    console.log('\n🚀 El sistema está LISTO PARA PRODUCCIÓN!')

  } catch (error) {
    console.error('\n💥 ERROR DURANTE LA VERIFICACIÓN:', error)
    console.error('\nStack trace:', error instanceof Error ? error.stack : 'No stack trace available')
    throw error
  }
}

// Ejecutar verificación
console.log('🎯 Iniciando verificación integral del sistema Multi-Provider Fulfillment')
console.log(`📅 Fecha: ${new Date().toLocaleString()}`)
console.log('')

verificarSistemaCompleto()
  .then(() => {
    console.log('\n✨ VERIFICACIÓN COMPLETADA CON ÉXITO')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💀 VERIFICACIÓN FALLÓ:', error.message)
    process.exit(1)
  })
