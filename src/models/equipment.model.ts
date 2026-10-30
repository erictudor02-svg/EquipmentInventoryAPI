export interface EquipmentInput {
  name: string;
  description: string | null;
  quantity: number;
  isAvailable: boolean;
}

export interface Equipment extends EquipmentInput {
  equipmentId: number;
}