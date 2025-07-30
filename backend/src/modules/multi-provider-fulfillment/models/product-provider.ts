import { Entity, PrimaryKey, Property, ManyToOne, BeforeCreate } from "@mikro-orm/core";
import { generateEntityId } from "@medusajs/framework/utils";

@Entity()
export class Product {
  @PrimaryKey()
  id!: string;

  @Property()
  product_id!: string;

  @Property()
  provider_id!: string;

  @ManyToOne(() => 'Provider')
  provider!: any;

  @Property({ nullable: true })
  provider_product_id?: string;

  @Property({ nullable: true })
  cost_price?: number;

  @Property({ default: true })
  is_available: boolean = true;

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updated_at: Date = new Date();

  @BeforeCreate()
  private beforeCreate(): void {
    this.id = generateEntityId(this.id, "prod_prov");
  }
}
