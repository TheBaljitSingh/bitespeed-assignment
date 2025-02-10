export interface Contact {
  id: number;
  phoneNumber?: string | null; // Allow null values
  email?: string | null; // Allow null values
  linkedId?: number | null; // Allow null values
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null; // Allow null values
}
