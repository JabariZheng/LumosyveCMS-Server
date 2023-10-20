/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:49:40
 * @Description: entity.user
 */
import { Exclude, Transform } from 'class-transformer';
import { formatDate } from 'src/utils';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_user')
export class User {
  @PrimaryColumn()
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
  dept_id: string;

  @Column({ comment: '岗位编号数组' })
  post_ids: string;

  @Column({ comment: '用户邮箱' })
  email: string;

  @Column({ comment: '手机号码' })
  mobile: string;

  @Column({ comment: '用户性别' })
  sex: string;

  @Column({ comment: '头像地址' })
  avatar: string;

  @Column({ comment: '默认首页' })
  home_url: string;

  @Column({ comment: '帐号状态（0正常 1停用）' })
  status: string;

  @Column({ comment: '租户编号' })
  tenant_id: string;

  @Column({ comment: '最后登录IP' })
  login_ip: string | undefined;

  @Column({ comment: '最后登录时间' })
  login_date: string | undefined;

  @Column({ comment: '创建者' })
  creator: string;

  @Column({ comment: '创建时间' })
  @Transform(({ value }) => formatDate(value))
  create_time: Date;

  @Column({ comment: '更新者' })
  updater: string;

  @Column({ comment: '更新时间' })
  update_time: Date;

  @Column({ comment: '是否删除' })
  deleted: string;

  @Column({ comment: '删除时间' })
  @Transform(({ value }) => formatDate(value))
  deleted_time: Date;
}
