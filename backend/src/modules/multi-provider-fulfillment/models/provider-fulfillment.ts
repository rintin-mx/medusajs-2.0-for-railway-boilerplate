import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class ProviderFulfillment {
  @PrimaryKey()
  id!: string;

  @Property()
  order_id!: string;

  @Property()
  provider_id!: string;

  @Property({ type: "json" })
  items!: any[];

  @Property({ default: "pending" })
  status: string = "pending"; // pending, confirmed, backorder

  @Property({ nullable: true })
  backorder_reason?: string;
}
