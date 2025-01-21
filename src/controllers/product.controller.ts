import { NextFunction, Response } from "express";
import { ProtectedRequest } from "../types";
import { STATUS_CODES } from "../exceptions";
import { ProductService } from "../services";
import { IProduct, Pageable } from "../interfaces";

export default class ProductController {
  service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  getAll = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const queryParams = {
        ...req.query,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        orderBy: req.query.orderBy as string[] | "desc",
      };

      const filter = queryParams as unknown as Pageable<IProduct>;

      const products = await this.service.getAllProducts(filter);
      return res
        .status(STATUS_CODES.OK)
        .json({ status: "success", data: products });
    } catch (error) {
      next(error);
    }
  }

  getProductById = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const product = await this.service.getProductById(req.params.id);
      return res
        .status(STATUS_CODES.OK)
        .json({ status: "success", data: product });
    } catch (error) {
      next(error);
    }
  }

  createProduct = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const product = await this.service.createProduct(req.body);
      return res
        .status(STATUS_CODES.CREATED)
        .json({ status: "success", data: product });
    } catch (error) {
      next(error);
    }
  }

  updateProduct = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const product = await this.service.updateProduct(req.params.id, req.body);
      return res
        .status(STATUS_CODES.OK)
        .json({ status: "success", data: product });
    } catch (error) {
      next(error);
    }
  }

  deleteProduct = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const product = await this.service.deleteProduct(req.params.id);
      return res
        .status(STATUS_CODES.NO_CONTENT)
        .json({ status: "success", data: product });
    } catch (error) {
      next(error);
    }
  }
}

