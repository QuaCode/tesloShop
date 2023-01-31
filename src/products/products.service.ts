import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((url) =>
          this.productImageRepository.create({ url }),
        ),
      });

      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const allProducts = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return allProducts.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
      return { ...product, images: product.images.map((image) => image.url) };
    }
    product = await this.productRepository.findOneBy({ slug: term });

    if (!product)
      throw new NotFoundException(`Product with term ${term} not found`);

    return { ...product, images: product.images.map((image) => image.url) };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect(); // Conectar a la base de datos.
    await queryRunner.startTransaction(); // A partir de aquí todo lo que hagamos lo guardara en estas transacciones.

    try {
      if (images) {
        // Primer proceso: ELiminar las imágenes antiguas
        await queryRunner.manager.delete(
          ProductImage /* Tabla a la que queremos afectar */,
          { product: { id } }, // Criterios de eliminación
        );

        // Segundo proceso: Guardar las nuevas imágenes
        product.images = images.map((url) =>
          this.productImageRepository.create({ url }),
        );
      }

      // Grabar cambios
      await queryRunner.manager.save(product);

      // Hacer commit de la transacción
      await queryRunner.commitTransaction();

      // Finalizar conexión del queryRunner
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      // Deshacer todos los cambios
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      this.productRepository.delete({ id });
      return { message: `Product with id ${id} was deleted` };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs.',
    );
  }
}
