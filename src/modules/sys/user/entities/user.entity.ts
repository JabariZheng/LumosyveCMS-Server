/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: entity.user
 */
import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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
