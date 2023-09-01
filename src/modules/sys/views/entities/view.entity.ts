/*
 * @Author: ZhengJie
 * @Date: 2023-08-29 00:00:54
 * @Description: entity.view
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_page')
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '页面名称' })
  name: string;

  @Column({ comment: '页面路径' })
  path: string;

  @Column({ comment: '请求地址' })
  api: string;

  @Column({ comment: '过滤条件' })
  filter: string;

  @Column({ comment: '表格列' })
  table_column: string;

  @Column({ comment: '是否分页' })
  pagination: number;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  create_time: string;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  update_time: string;
}
