import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import type {
  Equipment,
  EquipmentInput
} from "../models/equipment.model";

interface EquipmentRow extends RowDataPacket {
  equipment_id: number;
  name: string;
  description: string | null;
  quantity: number;
  is_available: number;
}

function mapEquipment(row: EquipmentRow): Equipment {
  return {
    equipmentId: row.equipment_id,
    name: row.name,
    description: row.description,
    quantity: row.quantity,
    isAvailable: row.is_available === 1
  };
}

export class EquipmentDao {
  async findAll(): Promise<Equipment[]> {
    const [rows] = await pool.execute<EquipmentRow[]>(
      `SELECT equipment_id, name, description, quantity, is_available
       FROM equipment
       ORDER BY equipment_id`
    );

    return rows.map(mapEquipment);
  }

  async findById(id: number): Promise<Equipment | null> {
    const [rows] = await pool.execute<EquipmentRow[]>(
      `SELECT equipment_id, name, description, quantity, is_available
       FROM equipment
       WHERE equipment_id = ?`,
      [id]
    );

    const row = rows[0];
    return row ? mapEquipment(row) : null;
  }

  async create(data: EquipmentInput): Promise<Equipment> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO equipment
         (name, description, quantity, is_available)
       VALUES (?, ?, ?, ?)`,
      [
        data.name,
        data.description,
        data.quantity,
        data.isAvailable ? 1 : 0
      ]
    );

    return {
      equipmentId: result.insertId,
      ...data
    };
  }

  async update(
    id: number,
    data: EquipmentInput
  ): Promise<Equipment | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE equipment
       SET name = ?, description = ?, quantity = ?, is_available = ?
       WHERE equipment_id = ?`,
      [
        data.name,
        data.description,
        data.quantity,
        data.isAvailable ? 1 : 0,
        id
      ]
    );

    // Check existence separately when no rows were affected.
    // An unchanged record must still count as a successful update.
    if (result.affectedRows === 0) {
      return this.findById(id);
    }

    return {
      equipmentId: id,
      ...data
    };
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM equipment WHERE equipment_id = ?",
      [id]
    );

    return result.affectedRows > 0;
  }
}