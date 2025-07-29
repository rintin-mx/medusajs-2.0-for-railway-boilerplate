import { Text } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getProductsById, checkProductAvailability } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

  // Verificar disponibilidad del producto
  const isAvailable = await checkProductAvailability(product.id!)

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="relative">
        <div className={`${!isAvailable ? 'opacity-60' : ''}`}>
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              BACKORDER
            </div>
          </div>
        )}

        <div className="flex txt-compact-medium mt-4 justify-between">
          <div className="flex flex-col">
            <Text className={`text-ui-fg-subtle ${!isAvailable ? 'line-through opacity-60' : ''}`} data-testid="product-title">
              {product.title}
            </Text>
            {!isAvailable && (
              <Text className="text-orange-600 text-xs font-medium">
                No disponible temporalmente
              </Text>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
