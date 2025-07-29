import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany
} from "typeorm"
import { BaseEntity } from "@medusajs/framework/entities"
import { generateEntityId } from "@medusajs/framework/utils"
import { ProviderFulfillment } from "./provider-fulfillment"

@Entity()
export class Provider extends BaseEntity {
  @Index({ unique: true })
  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ nullable: true })
  website: string

  @Column({ nullable: true })
  address: string

  @Column({ default: true })
  is_active: boolean

  @OneToMany(() => ProviderFulfillment, (fulfillment) => fulfillment.provider)
  @JoinColumn({ name: "id", referencedColumnName: "provider_id" })
  fulfillments: ProviderFulfillment[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "prov")
  }
}
