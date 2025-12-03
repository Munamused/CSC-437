"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/traveler-svc.ts
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    color: String
}, { collection: "thegarden_users" });
const UserModel = (0, mongoose_1.model)("Profile", UserSchema);
function index() {
    return UserModel.find();
}
function get(userid) {
    return UserModel.find({ userid })
        .then((list) => list[0])
        .catch((err) => {
        throw `${userid} Not Found`;
    });
}
exports.default = { index, get };
