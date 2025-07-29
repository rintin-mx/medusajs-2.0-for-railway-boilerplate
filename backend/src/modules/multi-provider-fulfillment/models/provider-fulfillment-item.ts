import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from "typeorm"
import { BaseEntity } from "@medusajs/framework/entities"
import { generateEntityId } from "@medusajs/framework/utils"
import { ProviderFulfillment } from "./provider-fulfillment"

@Entity()
export class ProviderFulfillmentItem extends BaseEntity {
  @Index()
  @Column()
  provider_fulfillment_id: string

  @ManyToOne(() => ProviderFulfillment, (fulfillment) => fulfillment.items)
  @JoinColumn({ name: "provider_fulfillment_id" })
  provider_fulfillment: ProviderFulfillment

  @Index()
  @Column()
  order_item_id: string

  @Column({ type: "int" })
  quantity: number

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pfi")
  }
}
