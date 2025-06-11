import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from "typeorm"
import { BaseEntity } from "@medusajs/framework/entities"
import { generateEntityId } from "@medusajs/framework/utils"
import { Provider } from "./provider"
import { ProviderFulfillmentItem } from "./provider-fulfillment-item"

export enum ProviderFulfillmentStatus {
  PENDING = "pending",
  CREATED = "created",
  SHIPPED = "shipped",
  CANCELED = "canceled",
  COMPLETED = "completed",
  REQUIRES_ACTION = "requires_action"
}

@Entity()
export class ProviderFulfillment extends BaseEntity {
  @Index()
  @Column()
  order_id: string

  @Index()
  @Column()
  provider_id: string

  @ManyToOne(() => Provider, (provider) => provider.fulfillments)
  @JoinColumn({ name: "provider_id" })
  provider: Provider

  @OneToMany(() => ProviderFulfillmentItem, (item) => item.provider_fulfillment)
  @JoinColumn({ name: "id", referencedColumnName: "provider_fulfillment_id" })
  items: ProviderFulfillmentItem[]

  @Column({
    type: "enum",
    enum: ProviderFulfillmentStatus,
    default: ProviderFulfillmentStatus.PENDING
  })
  status: ProviderFulfillmentStatus

  @Column({ nullable: true })
  tracking_number: string

  @Column({ nullable: true })
  tracking_url: string

  @Column({ nullable: true })
  shipped_at: Date

  @Column({ nullable: true })
  delivered_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pf")
  }
}
