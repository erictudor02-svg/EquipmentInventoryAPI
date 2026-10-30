import type {
  Request,
  Response,
  NextFunction
} from "express";
import { EquipmentService } from "../services/equipment.service";

export class EquipmentController {
  private readonly service = new EquipmentService();

  findAll = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipment = await this.service.findAll();
      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  };

  findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipment = await this.service.findById(req.params.id);
      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipment = await this.service.create(req.body);

      res
        .location(`/api/equipment-items/${equipment.equipmentId}`)
        .status(201)
        .json(equipment);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const equipment = await this.service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(equipment);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  };
}