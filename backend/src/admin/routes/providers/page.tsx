import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Heading, Container } from "@medusajs/ui"
import { ProvidersTable } from "./components/providers-table"

const ProvidersPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">Proveedores</Heading>
      </div>
      <ProvidersTable />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Providers",
})

export default ProvidersPage
