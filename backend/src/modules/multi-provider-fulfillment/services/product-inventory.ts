import { EntityManager } from "@mikro-orm/core"
import { Product } from "../models/product-provider"

export class ProductInventoryService {
  private manager: EntityManager

  constructor(container: any) {
    this.manager = container.manager
  }

  async setProductUnavailable(productId: string): Promise<void> {
    try {
      await this.manager.nativeUpdate(Product, { id: productId }, { isAvailable: false })
      console.log(`Producto ${productId} marcado como no disponible debido a backorder`)
    } catch (error) {
      console.error(`Error al marcar producto ${productId} como no disponible:`, error)
      throw error
    }
  }

  async setProductAvailable(productId: string): Promise<void> {
    try {
      await this.manager.nativeUpdate(Product, { id: productId }, { isAvailable: true })
      console.log(`Producto ${productId} marcado como disponible`)
    } catch (error) {
      console.error(`Error al marcar producto ${productId} como disponible:`, error)
      throw error
    }
  }

  async getProductAvailability(productId: string): Promise<boolean> {
    try {
      const product = await this.manager.findOne(Product, { id: productId })
      return product?.isAvailable ?? false
    } catch (error) {
      console.error(`Error al obtener disponibilidad del producto ${productId}:`, error)
      return false
    }
  }

  async handleBackorderUpdate(productId: string, hasStock: boolean): Promise<void> {
    if (hasStock) {
      await this.setProductAvailable(productId)
    } else {
      await this.setProductUnavailable(productId)
    }
  }
}
