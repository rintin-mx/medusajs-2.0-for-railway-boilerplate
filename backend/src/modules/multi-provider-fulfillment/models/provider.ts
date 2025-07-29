import { Entity, PrimaryKey, Property, OneToMany, Collection, BeforeCreate } from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/framework/utils"
import { ProviderFulfillment } from "./provider-fulfillment"

@Entity()
export class Provider {
  @PrimaryKey()
  id!: string

  @Property({ unique: true })
  name!: string

  @Property({ nullable: true })
  description?: string

  @Property({ nullable: true })
  email?: string

  @Property({ nullable: true })
  phone?: string

  @Property({ nullable: true })
  website?: string

  @Property({ nullable: true })
  address?: string

  @Property({ default: true })
  is_active: boolean = true

  @OneToMany(() => ProviderFulfillment, fulfillment => fulfillment.provider)
  fulfillments = new Collection<ProviderFulfillment>(this)

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "prov")
  }
}
