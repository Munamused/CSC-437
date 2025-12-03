// src/services/traveler-svc.ts
import { Schema, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    color: String
  },
  { collection: "thegarden_users" }
);

const UserModel = model<User>(
  "Profile",
  UserSchema
);

function index(): Promise<User[]> {
  return UserModel.find();
}

function get(userid: String): Promise<User | null> {
  return UserModel.find({ userid })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userid} Not Found`;
    });
}

export default { index, get };