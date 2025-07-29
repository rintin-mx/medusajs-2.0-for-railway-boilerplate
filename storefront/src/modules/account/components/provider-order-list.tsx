import React, { useEffect, useState } from "react";
// Aquí deberías importar tu cliente API y tipos
// import { getProviderOrders, confirmProviderOrder } from "@lib/api/provider-orders";

const ProviderOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getProviderOrders().then(data => {
    //   setOrders(data);
    //   setLoading(false);
    // });
  }, []);

  const handleConfirm = async (orderId: string) => {
    // await confirmProviderOrder(orderId);
    // Actualiza la lista de órdenes
  };

  if (loading) return <div>Cargando órdenes...</div>;

  return (
    <div>
      <h2>Órdenes del proveedor</h2>
      {orders.length === 0 ? (
        <div>No hay órdenes pendientes.</div>
      ) : (
        <ul>
          {orders.map((order: any) => (
            <li key={order.id} className="mb-4 p-4 border rounded">
              <div>Orden: {order.id}</div>
              <div>Estado: {order.status}</div>
              <div>Artículos: {order.items.map((item: any) => item.name).join(", ")}</div>
              {order.status === "pending" && (
                <button onClick={() => handleConfirm(order.id)} className="btn btn-primary mt-2">
                  Confirmar orden
                </button>
              )}
              {order.status === "backorder" && (
                <div className="text-red-500">Backorder: {order.backorder_reason}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProviderOrderList;

