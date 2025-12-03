import { Date } from "mongoose";

export interface Memory {
  memoryid: string;
  userid: string;
  name: string;
  date: Date;
  photoUrl?: string | null;
  location: string;
  description?: string | null;
}