import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed(user: User) {
    await this.insertNewProducts(user);
    return 'Seed executed';
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();
    const { products } = initialData;

    const insertPromise = [];
    products.forEach((product) => {
      insertPromise.push(this.productsService.create(product, user));
    });

    await Promise.all(products);
    return true;
  }
}
