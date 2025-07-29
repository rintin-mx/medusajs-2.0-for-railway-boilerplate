import { Entity, PrimaryKey, Property, ManyToOne, BeforeCreate } from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/framework/utils"

@Entity()
export class ProviderFulfillmentItem {
  @PrimaryKey()
  id!: string

  @Property({ index: true })
  provider_fulfillment_id!: string

  @ManyToOne(() => 'ProviderFulfillment')
  provider_fulfillment!: any

  @Property({ index: true })
  order_item_id!: string

  @Property()
  quantity!: number

  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "pfi")
  }
}
