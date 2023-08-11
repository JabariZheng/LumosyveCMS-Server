/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: entity.user
 */
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  remark: string;

  @Column()
  dept_id: number;

  @Column()
  post_ids: string;

  @Column()
  email: string;

  @Column()
  mobile: string;

  @Column()
  sex: number;

  @Column()
  avatar: string;

  @Column()
  status: number;

  @Column()
  deleted: number;

  @Column()
  tenant_id: number;

  @Column()
  login_ip: string;

  @Column()
  login_date: string;

  @Column()
  creator: string;

  @Column()
  create_time: string;

  @Column()
  updater: string;

  @Column()
  update_time: string;
}
