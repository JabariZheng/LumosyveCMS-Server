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

  @Column({ comment: '用户账号' })
  username: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '用户昵称' })
  nickname: string;

  @Column({ comment: '备注' })
  remark: string;

  @Column({ comment: '角色' })
  role_ids: string;

  @Column({ comment: '部门ID' })
  dept_id: number;

  @Column({ comment: '岗位编号数组' })
  post_ids: string;

  @Column({ comment: '用户邮箱' })
  email: string;

  @Column({ comment: '手机号码' })
  mobile: string;

  @Column({ comment: '用户性别' })
  sex: number;

  @Column({ comment: '头像地址' })
  avatar: string;

  @Column({ comment: '默认首页' })
  home_url: string;

  @Column({ comment: '帐号状态（0正常 1停用）' })
  status: number;

  @Column({ comment: '是否删除' })
  deleted: number;

  @Column({ comment: '租户编号' })
  tenant_id: number;

  @Column({ comment: '最后登录IP' })
  login_ip: string;

  @Column({ comment: '最后登录时间' })
  login_date: string;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  create_time: string;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  update_time: string;
}
