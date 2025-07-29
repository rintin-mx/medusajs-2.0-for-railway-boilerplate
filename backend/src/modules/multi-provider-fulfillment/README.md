# Multi-Provider Fulfillment Module

This module extends Medusa's order and fulfillment functionality to support multiple providers per order. It allows an e-commerce business to have multiple providers fulfill different parts of a customer's order, while presenting a single unified order to the customer.

## Overview

In a standard Medusa setup, each order is fulfilled by a single provider. This module introduces the concept of "provider fulfillments" where a single customer order can be split into multiple fulfillment orders, each managed by a different provider.

## Features

- Split customer orders into multiple provider fulfillments
- Assign different providers to different parts of an order
- Track the status of each provider fulfillment separately
- Aggregate provider fulfillment statuses into a unified customer-facing order status
- Manage provider-specific information and communication

## Implementation

The module consists of the following components:

1. **Provider Entity**: Represents a fulfillment provider with their details
2. **Provider Fulfillment Entity**: Represents a fulfillment order assigned to a specific provider
3. **Provider Fulfillment Item Entity**: Represents items in a provider fulfillment
4. **Services**: For managing providers and provider fulfillments
5. **APIs**: For interacting with providers and provider fulfillments

## Usage

The module integrates with Medusa's existing order processing flow:

1. When a customer places an order, the order is created as usual
2. The order is then analyzed to determine which providers should fulfill which items
3. Provider fulfillments are created and assigned to the appropriate providers
4. Each provider manages their fulfillment independently
5. The customer sees a single unified order with aggregated status information
