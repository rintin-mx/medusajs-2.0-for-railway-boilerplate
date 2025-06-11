# Multi-Provider Fulfillment Module Usage Guide

This guide explains how to use the Multi-Provider Fulfillment module to manage orders that are fulfilled by multiple providers.

## Overview

The Multi-Provider Fulfillment module extends Medusa's order and fulfillment functionality to support multiple providers per order. It allows an e-commerce business to have multiple providers fulfill different parts of a customer's order, while presenting a single unified order to the customer.

## Setup

The module is already registered in your Medusa configuration. When you start your Medusa server, the module will be loaded and its database migrations will be applied automatically.

## Managing Providers

### Creating a Provider

To create a new provider, make a POST request to the `/admin/providers` endpoint:

```
POST /admin/providers

{
  "name": "Provider Name",
  "description": "Provider Description",
  "email": "provider@example.com",
  "phone": "+1234567890",
  "website": "https://provider.example.com",
  "address": "123 Provider St, Provider City",
  "is_active": true
}
```

### Listing Providers

To list all providers, make a GET request to the `/admin/providers` endpoint:

```
GET /admin/providers
```

You can also filter, paginate, and select specific fields:

```
GET /admin/providers?limit=10&offset=0&fields=id,name,email&relations=fulfillments
```

### Retrieving a Provider

To retrieve a specific provider, make a GET request to the `/admin/providers/:id` endpoint:

```
GET /admin/providers/prov_123456
```

### Updating a Provider

To update a provider, make a PUT request to the `/admin/providers/:id` endpoint:

```
PUT /admin/providers/prov_123456

{
  "name": "Updated Provider Name",
  "email": "updated@example.com"
}
```

### Deleting a Provider

To delete a provider, make a DELETE request to the `/admin/providers/:id` endpoint:

```
DELETE /admin/providers/prov_123456
```

## Managing Provider Fulfillments

### Creating a Provider Fulfillment

When an order is placed, you can create provider fulfillments for different providers by making a POST request to the `/admin/provider-fulfillments` endpoint:

```
POST /admin/provider-fulfillments

{
  "order_id": "order_123456",
  "provider_id": "prov_123456",
  "items": [
    {
      "order_item_id": "item_123456",
      "quantity": 2
    },
    {
      "order_item_id": "item_789012",
      "quantity": 1
    }
  ],
  "metadata": {
    "notes": "Special handling required"
  }
}
```

### Listing Provider Fulfillments

To list all provider fulfillments, make a GET request to the `/admin/provider-fulfillments` endpoint:

```
GET /admin/provider-fulfillments
```

### Listing Provider Fulfillments for an Order

To list all provider fulfillments for a specific order, make a GET request to the `/admin/provider-fulfillments/order/:orderId` endpoint:

```
GET /admin/provider-fulfillments/order/order_123456
```

### Retrieving a Provider Fulfillment

To retrieve a specific provider fulfillment, make a GET request to the `/admin/provider-fulfillments/:id` endpoint:

```
GET /admin/provider-fulfillments/pf_123456
```

### Updating a Provider Fulfillment

To update a provider fulfillment, make a PUT request to the `/admin/provider-fulfillments/:id` endpoint:

```
PUT /admin/provider-fulfillments/pf_123456

{
  "metadata": {
    "notes": "Updated handling instructions"
  }
}
```

## Managing Provider Fulfillment Lifecycle

### Canceling a Provider Fulfillment

To cancel a provider fulfillment, make a POST request to the `/admin/provider-fulfillments/:id/cancel` endpoint:

```
POST /admin/provider-fulfillments/pf_123456/cancel
```

### Marking a Provider Fulfillment as Shipped

To mark a provider fulfillment as shipped, make a POST request to the `/admin/provider-fulfillments/:id/ship` endpoint:

```
POST /admin/provider-fulfillments/pf_123456/ship

{
  "tracking_number": "TRACK123456",
  "tracking_url": "https://tracking.example.com/TRACK123456"
}
```

### Marking a Provider Fulfillment as Completed

To mark a provider fulfillment as completed, make a POST request to the `/admin/provider-fulfillments/:id/complete` endpoint:

```
POST /admin/provider-fulfillments/pf_123456/complete
```

## Integration with Existing Order Flow

The Multi-Provider Fulfillment module integrates with Medusa's existing order flow:

1. When a customer places an order, the order is created as usual
2. The order is then analyzed to determine which providers should fulfill which items
3. Provider fulfillments are created and assigned to the appropriate providers
4. Each provider manages their fulfillment independently
5. The customer sees a single unified order with aggregated status information

## Best Practices

1. **Provider Assignment**: Assign providers based on product type, location, or other business rules
2. **Status Monitoring**: Regularly check the status of all provider fulfillments for an order
3. **Customer Communication**: Update customers with aggregated information about their order
4. **Provider Management**: Maintain accurate provider information and monitor provider performance
