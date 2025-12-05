import { Date } from "mongoose";

export interface MemoryItem {
  memoryid: string;
  userid: string;
  name: string;
  date: Date;
  photoUrl?: string;
  location: string;
  description?: string;
}