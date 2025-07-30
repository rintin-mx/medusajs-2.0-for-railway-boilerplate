import { Logger } from '@medusajs/framework/types'
import { MedusaContainer } from '@medusajs/framework/types'

type InjectedDependencies = {
  logger: Logger
  container: MedusaContainer
}

// Definir interfaz para el productService
interface ProductService {
  retrieve(productId: string): Promise<{
    id: string
    status: string
    metadata?: Record<string, any>
    [key: string]: any
  }>
  update(productId: string, data: any): Promise<any>
  list(query: any): Promise<Array<{
    id: string
    status: string
    metadata?: Record<string, any>
    [key: string]: any
  }>>
}

export class ProductInventoryService {
  protected readonly logger_: Logger
  protected readonly container_: MedusaContainer

  constructor({ logger, container }: InjectedDependencies) {
    this.logger_ = logger
    this.container_ = container
  }

  private getProductService(): ProductService {
    return this.container_.resolve('productService') as ProductService
  }

  async setProductUnavailable(productId: string): Promise<void> {
    try {
      this.logger_.info(`Marcando producto ${productId} como no disponible debido a backorder`)

      // Obtener el servicio de productos de Medusa
      const productService = this.getProductService()

      // Actualizar el producto para marcarlo como no disponible
      await productService.update(productId, {
        status: 'draft', // Cambiar status a draft para hacerlo no disponible
        metadata: {
          ...((await productService.retrieve(productId)).metadata || {}),
          backorder_unavailable: true,
          unavailable_reason: 'backorder',
          unavailable_date: new Date().toISOString()
        }
      })

      this.logger_.info(`Producto ${productId} marcado como no disponible exitosamente`)
    } catch (error) {
      this.logger_.error(`Error al marcar producto ${productId} como no disponible:`, error)
      throw error
    }
  }

  async setProductAvailable(productId: string): Promise<void> {
    try {
      this.logger_.info(`Marcando producto ${productId} como disponible`)

      const productService = this.getProductService()

      // Actualizar el producto para marcarlo como disponible
      await productService.update(productId, {
        status: 'published', // Cambiar status a published para hacerlo disponible
        metadata: {
          ...((await productService.retrieve(productId)).metadata || {}),
          backorder_unavailable: false,
          unavailable_reason: null,
          available_date: new Date().toISOString()
        }
      })

      this.logger_.info(`Producto ${productId} marcado como disponible exitosamente`)
    } catch (error) {
      this.logger_.error(`Error al marcar producto ${productId} como disponible:`, error)
      throw error
    }
  }

  async getProductAvailability(productId: string): Promise<boolean> {
    try {
      this.logger_.info(`Verificando disponibilidad del producto ${productId}`)

      const productService = this.getProductService()
      const product = await productService.retrieve(productId)

      // Un producto está disponible si:
      // 1. Su status es 'published'
      // 2. No está marcado como backorder_unavailable en metadata
      const isAvailable = product.status === 'published' &&
                         !product.metadata?.backorder_unavailable

      this.logger_.info(`Producto ${productId} disponibilidad: ${isAvailable}`)
      return isAvailable
    } catch (error) {
      this.logger_.error(`Error al obtener disponibilidad del producto ${productId}:`, error)
      return false
    }
  }

  async handleBackorderUpdate(productId: string, hasStock: boolean): Promise<void> {
    this.logger_.info(`Actualizando estado de backorder para producto ${productId}, tiene stock: ${hasStock}`)

    if (hasStock) {
      await this.setProductAvailable(productId)
    } else {
      await this.setProductUnavailable(productId)
    }
  }

  /**
   * Obtiene todos los productos que están marcados como no disponibles por backorder
   */
  async getUnavailableProducts(): Promise<string[]> {
    try {
      this.logger_.info('Obteniendo productos no disponibles por backorder')

      const productService = this.getProductService()

      // Buscar productos con metadata que indique backorder_unavailable
      const products = await productService.list({
        status: 'draft'
      })

      const unavailableProducts = products.filter(product =>
        product.metadata?.backorder_unavailable === true
      ).map(product => product.id)

      this.logger_.info(`Encontrados ${unavailableProducts.length} productos no disponibles por backorder`)
      return unavailableProducts
    } catch (error) {
      this.logger_.error('Error al obtener productos no disponibles:', error)
      return []
    }
  }

  /**
   * Restaura la disponibilidad de múltiples productos
   */
  async bulkRestoreAvailability(productIds: string[]): Promise<void> {
    this.logger_.info(`Restaurando disponibilidad para ${productIds.length} productos`)

    const promises = productIds.map(productId =>
      this.setProductAvailable(productId).catch(error => {
        this.logger_.error(`Error restaurando producto ${productId}:`, error)
        return null
      })
    )

    await Promise.all(promises)
    this.logger_.info('Proceso de restauración masiva completado')
  }
}
