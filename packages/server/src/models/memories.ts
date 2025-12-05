import { Date } from "mongoose";
import { MemoryItem } from "./memory";

export interface Memories {
  memoryid: string;
  userid: string;
  memories: MemoryItem[];
}