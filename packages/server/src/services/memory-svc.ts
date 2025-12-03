import { Schema, model } from "mongoose";
import { Memory } from "../models/memory";

const MemorySchema = new Schema<Memory>(
  {
    memoryid: { type: String, required: true, trim: true, unique: true },
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    photoUrl: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
  },
  { collection: "thegarden_memories" }
);

const MemoryModel = model<Memory>("Memory", MemorySchema);

function index(): Promise<Memory[]> {
  return MemoryModel.find();
}

function get(memoryid: string): Promise<Memory | null> {
  return MemoryModel.findOne({ memoryid }).then((doc) => doc);
}

function create(mem: Partial<Memory>): Promise<Memory> {
  // generate a memoryid if not provided
  if (!mem.memoryid) {
    mem.memoryid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  }

  const m = new MemoryModel(mem as Memory);
  return m.save();
}

function update(memoryid: string, mem: Partial<Memory>): Promise<Memory | null> {
  return MemoryModel.findOneAndUpdate({ memoryid }, mem, { new: true }).then(
    (doc) => doc
  );
}

function remove(memoryid: string): Promise<Memory | null> {
return MemoryModel.findOneAndDelete({ memoryid }).then((doc) => {
    if (!doc) return null;
    return (doc as unknown) as Memory;
});
}

export default { index, get, create, update, remove };
