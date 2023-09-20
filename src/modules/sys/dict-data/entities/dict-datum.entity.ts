/*
 * @Author: ZhengJie
 * @Date: 2023-09-17 23:34:13
 * @Description: entity.dictData
 */
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

  @Column({ comment: '字典类型' })
  dict_type: string;

  @Column({ comment: '状态（0正常 1停用）' })
  status: string;

  @Column({ comment: '颜色类型' })
  color_type: string;

  @Column({ comment: 'css 样式' })
  css_class: string;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  create_time: string;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  update_time: string;

  @Column({ comment: '是否删除' })
  deleted: string;

  @Column({ comment: '删除时间' })
  deleted_time: string;
}
