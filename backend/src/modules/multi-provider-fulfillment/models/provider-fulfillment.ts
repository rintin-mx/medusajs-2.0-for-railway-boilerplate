import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, BeforeCreate } from "@mikro-orm/core";
import { generateEntityId } from "@medusajs/framework/utils"

@Entity()
export class ProviderFulfillment {
  @PrimaryKey()
  id!: string;

  @Property()
  order_id!: string;

  @Property()
  provider_id!: string;

  @ManyToOne(() => 'Provider')
  provider!: any;

  @OneToMany(() => 'ProviderFulfillmentItem', 'provider_fulfillment')
  items = new Collection<any>(this);

  @Property({ default: 'pending' })
  status: string = 'pending';

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "pf")
  }
}
