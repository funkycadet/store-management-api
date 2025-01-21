import { Prisma } from "@prisma/client";
import { IProduct, Pageable } from "../interfaces";
import { BadRequestError, NotFoundError } from "../exceptions";
import { db } from "../database";
import { pageableHandler } from "../utils";

export default class ProductService {

  constructor() {}

  public async getAllProducts(filter: Pageable<IProduct>): Promise<IProduct[]> {
    const query = pageableHandler.process<IProduct>(filter);
    const where = query.filter;

    const [products, count] = await Promise.all([
      db.product.findMany({
        skip: query.skip,
        take: query.limit,
        where,
        orderBy: query.orderBy,
      }),
      db.product.count({
        where
      }),
    ]);

    return pageableHandler.responseToPageable(query, count, products);
  }

  public async getProductById(id: string): Promise<IProduct> {
    try {
      const product = await db.product.findUnique({
        where: {id},
      });

      if (!product) {
        throw new NotFoundError(`Product not found!`);
      }
      return product;
    } catch (error) {
      throw new BadRequestError(`Error fetching product: ${error.message}`);
    }
  }

  public async getProduct(filter: Partial<Prisma.ProductWhereUniqueInput>): Promise<IProduct> {
    return await db.product.findFirst({
      where: filter,
    });
  }

  public async createProduct(data: IProduct): Promise<IProduct> {
    return await db.product.create({
      data,
    });
  }

  public async updateProduct(id: string, data: object): Promise<IProduct> {
    return await db.product.update({
      where: {
        id,
      },
      data,
    });
  }

  public async deleteProduct(id: string): Promise<IProduct> {
    try {
      const product = await db.product.findUnique({
        where: {id},
      });

      if (!product) {
        throw new NotFoundError(`Product not found!`);
      }
      return await db.product.delete({
        where: {
          id,
        },
      });
  } catch(error) {
      throw new BadRequestError(`Error deleting product: ${error.message}`);
    }
  }
}

