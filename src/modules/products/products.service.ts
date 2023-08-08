import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './products.entity';
@Injectable()
export class ProductsService {
  // 使用InjectRepository装饰器并引入Repository即可使用typeorm的操作
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}
  // 查询数据库产品数据
  // 获取所有用户数据列表(productsRepository.query()方法属于typeoram)
  async getList(): Promise<Products[]> {
    return await this.productsRepository.query('select * from products');
  }
  // 通过id查询产品
  async getProductById(id): Promise<Products> {
    return await this.productsRepository.findOne({ where: { id: id } });
  }
  // 新增产品
  async addProduct(product): Promise<any> {
    return await this.productsRepository.insert(product);
  }
  // 更新产品
  async updateProduct(product): Promise<string> {
    let res = await this.productsRepository.update({ id: product.id }, product);
    if (res) {
      return '更新成功';
    } else {
      return '更新失败';
    }
  }
  // 删除产品
  async delProduct(params): Promise<object> {
    let res = await this.productsRepository.delete({ id: params.id });
    if (res) {
      return { code: 0, data: '', msg: '删除成功' };
    } else {
      return { code: 0, data: '', msg: '删除失败' };
    }
  }
}
