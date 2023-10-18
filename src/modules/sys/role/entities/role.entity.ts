/*
 * @Author: ZhengJie
 * @Date: 2023-10-18 23:12:58
 * @Description: Entity.role
 */
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_role')
export class Role {
  @PrimaryColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Column({ type: 'varchar', comment: '角色名称' })
  name: string;

  @Column({ type: 'varchar', comment: '角色编码' })
  code: string;

  @Column({ type: 'int', comment: '是否为系统角色' })
  is_system_role: number;

  @Column({ type: 'varchar', comment: '备注' })
  remark: string;

  @Column({ type: 'bigint', comment: '排序' })
  sort: number;

  @Column({ type: 'int', comment: '状态（0整体 1停用）' })
  status: number;

  @Column({ type: 'varchar', comment: '创建着' })
  creator: string;

  @Column({ type: 'datetime', comment: '创建时间' })
  create_time: Date;

  @Column({ type: 'varchar', comment: '更新者' })
  updater: string;

  @Column({ type: 'datetime', comment: '更新时间' })
  update_time: Date;

  @Column({ type: 'tinyint', comment: '是否已删除' })
  deleted: number;

  @Column({ type: 'datetime', comment: '删除时间' })
  deleted_time: Date;
}
