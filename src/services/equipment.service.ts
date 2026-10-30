import { EquipmentDao } from "../dao/equipment.dao";
import { ApiError } from "../errors/api-error";
import type {
  Equipment,
  EquipmentInput
} from "../models/equipment.model";

export class EquipmentService {
  private readonly dao = new EquipmentDao();

  private validateId(value: unknown): number {
    if (
      typeof value !== "string" ||
      !/^[1-9]\d*$/.test(value)
    ) {
      throw new ApiError(
        400,
        "INVALID_ID",
        "Equipment ID must be a positive integer."
      );
    }

    const id = Number(value);

    if (!Number.isSafeInteger(id) || id > 2147483647) {
      throw new ApiError(
        400,
        "INVALID_ID",
        "Equipment ID must be between 1 and 2147483647."
      );
    }

    return id;
  }

  private validateInput(value: unknown): EquipmentInput {
    if (
      typeof value !== "object" ||
      value === null ||
      Array.isArray(value)
    ) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Provide an equipment object."
      );
    }

    const data = value as Record<string, unknown>;
    const allowedFields = [
      "name",
      "description",
      "quantity",
      "isAvailable"
    ];

    const fields: Record<string, string> = {};

    if (
      Object.keys(data).some(key => !allowedFields.includes(key))
    ) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Only name, description, quantity, and isAvailable are allowed."
      );
    }

    if (
      typeof data.name !== "string" ||
      data.name.trim().length < 1 ||
      data.name.trim().length > 100
    ) {
      fields.name = "Enter a name containing 1–100 characters.";
    }

    if (
      data.description !== null &&
      (
        typeof data.description !== "string" ||
        data.description.length > 2000
      )
    ) {
      fields.description =
        "Provide null or a description of up to 2000 characters.";
    }

    if (
      typeof data.quantity !== "number" ||
      !Number.isInteger(data.quantity) ||
      data.quantity < 0 ||
      data.quantity > 2147483647
    ) {
      fields.quantity =
        "Enter a whole number between 0 and 2147483647.";
    }

    if (typeof data.isAvailable !== "boolean") {
      fields.isAvailable = "Provide true or false.";
    }

    if (Object.keys(fields).length > 0) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Correct the invalid equipment fields.",
        fields
      );
    }

    const description = data.description as string | null;

    return {
      name: (data.name as string).trim(),
      description:
        description === null || description.trim() === ""
          ? null
          : description,
      quantity: data.quantity as number,
      isAvailable: data.isAvailable as boolean
    };
  }

  async findAll(): Promise<Equipment[]> {
    return this.dao.findAll();
  }

  async findById(value: unknown): Promise<Equipment> {
    const id = this.validateId(value);
    const equipment = await this.dao.findById(id);

    if (!equipment) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Equipment not found."
      );
    }

    return equipment;
  }

  async create(value: unknown): Promise<Equipment> {
    const data = this.validateInput(value);
    return this.dao.create(data);
  }

  async update(
    idValue: unknown,
    value: unknown
  ): Promise<Equipment> {
    const id = this.validateId(idValue);
    const data = this.validateInput(value);
    const equipment = await this.dao.update(id, data);

    if (!equipment) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Equipment not found."
      );
    }

    return equipment;
  }

  async delete(value: unknown): Promise<void> {
    const id = this.validateId(value);
    const deleted = await this.dao.delete(id);

    if (!deleted) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Equipment not found."
      );
    }
  }
}