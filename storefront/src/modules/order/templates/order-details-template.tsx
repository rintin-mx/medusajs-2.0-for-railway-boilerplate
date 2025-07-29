"use client"

import { XMark } from "@medusajs/icons"
import React, { useState } from "react"

import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const [editing, setEditing] = useState(false)
  const [editedItems, setEditedItems] = useState(order.items)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Simulación de rol de administrador
  const userIsAdmin =
    typeof window !== "undefined" &&
    localStorage.getItem("userRole") === "admin"
  const isBackorder = order.status === "backorder"

  const handleEditClick = () => setEditing(true)
  const handleCancel = () => {
    setEditing(false)
    setEditedItems(order.items)
  }
  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError(null)

    // Llamada real a la API para guardar los cambios en los artículos
    try {
      const res = await fetch(`/api/admin/provider-fulfillments/${order.id}/items`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: editedItems }),
      })
      if (res.ok) {
        setEditing(false)
        setSaveSuccess(true)
        // Opcional: recargar datos o mostrar notificación
      } else {
        // Manejo de error
        setSaveError("Error al guardar los cambios")
      }
    } catch (err) {
      setSaveError("Error de red al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }
  const handleItemChange = (idx: number, value: number) => {
    if (!editedItems) return
    const newItems = [...editedItems]
    newItems[idx].quantity = value
    setEditedItems(newItems)
  }

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="text-small-regular text-ui-fg-base"
        >
          Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-white w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        {userIsAdmin && isBackorder && !editing && (
          <button
            className="btn btn-warning mb-2"
            onClick={handleEditClick}
          >
            Editar artículos (Backorder)
          </button>
        )}
        {editing && editedItems ? (
          <div className="mb-4 p-4 border rounded bg-yellow-50">
            <h3 className="font-bold mb-2">Editar artículos</h3>
            <ul>
              {editedItems.map((item, idx) => (
                <li key={item.id} className="mb-2">
                  {item.title} - Cantidad:
                  <input
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, Number(e.target.value))
                    }
                    className="ml-2 border px-2 py-1 w-16"
                  />
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                Cancelar
              </button>
            </div>
            {saveSuccess && <div className="text-green-600 mt-2">¡Cambios guardados correctamente!</div>}
            {saveError && <div className="text-red-600 mt-2">{saveError}</div>}
          </div>
        ) : (
          <Items items={order.items} />
        )}
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
