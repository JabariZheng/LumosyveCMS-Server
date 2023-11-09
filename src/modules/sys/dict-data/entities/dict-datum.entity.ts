/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: entity.dictData
 */
import { Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_dict_data')
export class DictDatum {
  @PrimaryColumn()
  id: number;

  @Column({ comment: '字典排序' })
  sort: number;

  @Column({ comment: '字典标签' })
  label: string;

  @Column({ comment: '字典键值' })
  value: string;

  @Column({ name: 'dict_type', comment: '字典类型' })
  dictType: string;

  @Column({ comment: '状态（0正常 1停用）' })
  status: number;

  @Column({ name: 'css_class', comment: 'css 类名' })
  cssClass: string;

  @Column({ name: 'css_style', comment: 'css 样式' })
  cssStyle: string;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ name: 'is_sys', comment: '默认内置' })
  isSys: number;

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
  deletedTime: Date | undefined;
}
