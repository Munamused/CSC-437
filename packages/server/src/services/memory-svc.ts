import { Schema, model } from "mongoose";
import { MemoryItem } from "../models/memory";

const MemorySchema = new Schema<MemoryItem>(
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

const MemoryModel = model<MemoryItem>("Memory", MemorySchema);

function index(): Promise<MemoryItem[]> {
  return MemoryModel.find();
}

function indexByUser(userid: string): Promise<MemoryItem[]> {
  return MemoryModel.find({ userid });
}

function get(memoryid: string): Promise<MemoryItem | null> {
  return MemoryModel.findOne({ memoryid }).then((doc) => doc);
}

function create(mem: Partial<MemoryItem>): Promise<MemoryItem> {
  // generate a memoryid if not provided
  if (!mem.memoryid) {
    mem.memoryid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  }

  const m = new MemoryModel(mem as MemoryItem);
  return m.save();
}

function update(memoryid: string, mem: Partial<MemoryItem>): Promise<MemoryItem | null> {
  return MemoryModel.findOneAndUpdate({ memoryid }, mem, { new: true }).then(
    (doc) => doc
  );
}

function remove(memoryid: string): Promise<MemoryItem | null> {
return MemoryModel.findOneAndDelete({ memoryid }).then((doc) => {
    if (!doc) return null;
    return (doc as unknown) as MemoryItem;
});
}

export default { index, indexByUser, get, create, update, remove };
