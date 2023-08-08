/*
 * @Author: ZhengJie
 * @Date: 2023-07-27 22:52:18
 * @Description: cats.service
 */
import { Injectable } from '@nestjs/common';
import { Cat } from './interface/cat.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CatsEntity } from './cats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  constructor(
    @InjectRepository(CatsEntity)
    private catsRepository: Repository<CatsEntity>,
  ) {}

  create(cat: Cat) {
    // const createCat = new this.catsRepository({

    // })
    console.log('catsRepository', this.catsRepository);
    this.cats.push(cat);
    return this.cats;
  }

  findAll(): Cat[] {
    return this.cats;
  }
}