/*
 * @Author: ZhengJie
 * @Date: 2023-09-02 18:19:30
 * @Description: entity.dict
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
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
  status: number;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ name: 'create_time', comment: '创建时间' })
  @Transform(({ value }) => value && formatDate(value))
  createTime: Date;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ name: 'update_time', comment: '更新时间' })
  @Transform(({ value }) => value && formatDate(value))
  updateTime: Date;

  @Column({ comment: '是否删除' })
  deleted: number;

  @Column({ name: 'deleted_time', comment: '删除时间' })
  @Transform(({ value }) => value && formatDate(value))
  deletedTime: Date;
}
