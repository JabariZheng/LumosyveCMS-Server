/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: entity.dict
 */
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_dict_type')
export class Dict {
  @PrimaryColumn()
  id: number;

  @Column({ comment: '字典名称' })
  name: string;

  @Column({ comment: '字典类型' })
  type: string;

  @Column({ comment: '状态（0正常 1停用）' })
  status: string;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  create_time: Date;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  update_time: Date;

  @Column({ comment: '是否删除' })
  deleted: string;

  @Column({ comment: '删除时间' })
  deleted_time: Date;
}
