export interface Tasks {
  id: number;
  description: string;
  stauts: "to-do" | "in-progress " | "done";
  createdAt: Date;
  updatedAt: Date;
}
