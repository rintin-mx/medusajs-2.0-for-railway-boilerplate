import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ProviderOrderList from "../components/provider-order-list";

const ProviderOrdersPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Simulación de autenticación/rol de proveedor
    const userIsProvider = typeof window !== "undefined" && localStorage.getItem("userRole") === "provider";
    if (!userIsProvider) router.replace("/account");
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Órdenes del proveedor</h1>
      <ProviderOrderList />
    </div>
  );
};

export default ProviderOrdersPage;
