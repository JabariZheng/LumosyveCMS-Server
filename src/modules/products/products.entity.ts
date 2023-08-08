import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'; // Column：列/字段
// Entity：实体
// PrimaryGeneratedColumn：创建一个主列，该值将使用自动增量值自动生成。 它将使用auto-increment /serial /sequence创建int列（取决于数据库）。 你不必在保存之前手动分配其值，该值将会自动生成。
// BaseEntity：继承基础实体类@Entity()
// Products需要与数据表同名
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', name: 'name' }) name: string;
  @Column({ type: 'varchar', name: 'type' }) type: string;
}
