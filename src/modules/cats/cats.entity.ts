/*
 * @Author: ZhengJie
 * @Date: 2023-08-06 23:13:12
 * @Description: entity.cats
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CatsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nickname: string;
}
