import { Entity, PrimaryKey, Property, ManyToOne } from "@mikro-orm/core";

@Entity()
export class Product {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property({ default: true })
  isAvailable: boolean = true;

  @ManyToOne(() => Provider)
  provider!: Provider;
}

@Entity()
export class Provider {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  contact_email?: string;
}

// Servicio para gestionar fulfillments y backorders
// ...aquí se implementará la lógica en el servicio correspondiente...
