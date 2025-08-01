"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"

import MobileActions from "./mobile-actions"
import ProductPrice from "../product-price"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { checkProductAvailability } from "@lib/data/products"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string | undefined>, varopt: any) => {
    if (varopt.option && varopt.value !== null && varopt.value !== undefined) {
      acc[varopt.option.title] = varopt.value
    }
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const countryCode = useParams().countryCode as string

  // Verificar disponibilidad del producto
  useEffect(() => {
    const checkAvailability = async () => {
      setCheckingAvailability(true)
      try {
        const available = await checkProductAvailability(product.id)
        setIsAvailable(available)
      } catch (error) {
        console.error('Error verificando disponibilidad:', error)
        setIsAvailable(false)
      } finally {
        setCheckingAvailability(false)
      }
    }

    checkAvailability()
  }, [product.id])

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !isAvailable) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })

    setIsAdding(false)
  }

  // Determinar si el producto puede agregarse al carrito
  const canAddToCart = useMemo(() => {
    return inStock && selectedVariant && isAvailable && !disabled && !isAdding
  }, [inStock, selectedVariant, isAvailable, disabled, isAdding])

  // Determinar el texto del botón
  const getButtonText = () => {
    if (checkingAvailability) return "Verificando disponibilidad..."
    if (!selectedVariant) return "Seleccionar variante"
    if (!isAvailable) return "Producto en backorder - No disponible"
    if (!inStock) return "Sin stock"
    return "Agregar al carrito"
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.title ?? ""]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding || !isAvailable}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        {!isAvailable && !checkingAvailability && (
          <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-orange-700">
                  <strong>Producto en backorder:</strong> Este producto no está disponible temporalmente debido a falta de stock.
                  No puede agregarse al carrito hasta que se repongan las existencias.
                </p>
              </div>
            </div>
          </div>
        )}

        <ProductPrice product={product} variant={selectedVariant} />

        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart || checkingAvailability}
          variant={!isAvailable ? "secondary" : "primary"}
          className="w-full h-10"
          isLoading={isAdding || checkingAvailability}
          data-testid="add-product-button"
        >
          {getButtonText()}
        </Button>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock && isAvailable}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding || !isAvailable}
        />
      </div>
    </>
  )
}
