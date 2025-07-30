import { ProductInventoryService } from './product-inventory'

/**
 * Archivo de prueba para verificar que ProductInventoryService funciona correctamente
 */
export async function testProductInventoryService() {
  console.log('🧪 Iniciando pruebas del ProductInventoryService...')

  // Mock de dependencias para la prueba
  const mockLogger = {
    info: (message: string) => console.log(`ℹ️ ${message}`),
    error: (message: string, error?: any) => console.error(`❌ ${message}`, error),
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
      console.log(`📝 Actualizando producto ${productId}:`, data)
      return {
        id: productId,
        ...data,
        updated_at: new Date()
      }
    },
    list: async (query: any) => {
      console.log('📋 Listando productos con query:', query)
      return [
        {
          id: 'prod_test_1',
          status: 'draft',
          metadata: { backorder_unavailable: true },
          title: 'Test Product 1'
        },
        {
          id: 'prod_test_2',
          status: 'published',
          metadata: {},
          title: 'Test Product 2'
        }
      ]
    }
  }

  const mockContainer = {
    resolve: (serviceName: string) => {
      if (serviceName === 'productService') {
        return mockProductService
      }
      throw new Error(`Servicio ${serviceName} no encontrado`)
    }
  }

  try {
    // Crear instancia del servicio
    const inventoryService = new ProductInventoryService({
      logger: mockLogger as any,
      container: mockContainer as any
    })

    console.log('✅ Servicio creado exitosamente')

    // Prueba 1: Verificar disponibilidad de producto
    console.log('\n🔍 Prueba 1: Verificar disponibilidad')
    const isAvailable = await inventoryService.getProductAvailability('prod_test_123')
    console.log(`Disponibilidad: ${isAvailable}`)

    // Prueba 2: Marcar producto como no disponible
    console.log('\n❌ Prueba 2: Marcar como no disponible')
    await inventoryService.setProductUnavailable('prod_test_123')

    // Prueba 3: Marcar producto como disponible
    console.log('\n✅ Prueba 3: Marcar como disponible')
    await inventoryService.setProductAvailable('prod_test_123')

    // Prueba 4: Manejar actualización de backorder
    console.log('\n🔄 Prueba 4: Manejar backorder')
    await inventoryService.handleBackorderUpdate('prod_test_123', false)
    await inventoryService.handleBackorderUpdate('prod_test_123', true)

    // Prueba 5: Obtener productos no disponibles
    console.log('\n📋 Prueba 5: Obtener productos no disponibles')
    const unavailableProducts = await inventoryService.getUnavailableProducts()
    console.log(`Productos no disponibles: ${unavailableProducts.length}`)

    // Prueba 6: Restauración masiva
    console.log('\n🔧 Prueba 6: Restauración masiva')
    await inventoryService.bulkRestoreAvailability(['prod_test_1', 'prod_test_2'])

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!')

  } catch (error) {
    console.error('💥 Error durante las pruebas:', error)
    throw error
  }
}

// Exportar para uso en otros archivos
export { ProductInventoryService }
