"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MemorySchema = new mongoose_1.Schema({
    memoryid: { type: String, required: true, trim: true, unique: true },
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    photoUrl: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true }
}, { collection: "thegarden_memories" });
const MemoryModel = (0, mongoose_1.model)("Memory", MemorySchema);
function index() {
    return MemoryModel.find();
}
function indexByUser(userid) {
    return MemoryModel.find({ userid });
}
function get(memoryid) {
    return MemoryModel.findOne({ memoryid }).then((doc) => doc);
}
function create(mem) {
    // generate a memoryid if not provided
    if (!mem.memoryid) {
        mem.memoryid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }
    const m = new MemoryModel(mem);
    return m.save();
}
function update(memoryid, mem) {
    return MemoryModel.findOneAndUpdate({ memoryid }, mem, { new: true }).then((doc) => doc);
}
function remove(memoryid) {
    return MemoryModel.findOneAndDelete({ memoryid }).then((doc) => {
        if (!doc)
            return null;
        return doc;
    });
}
exports.default = { index, indexByUser, get, create, update, remove };
