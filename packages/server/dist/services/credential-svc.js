"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const credentialSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    }
}, { collection: "user_credentials" });
const credentialModel = (0, mongoose_1.model)("Credential", credentialSchema);
function create(username, password) {
    return credentialModel
        .find({ username })
        .then((found) => {
        if (found.length)
            throw `Username exists: ${username}`;
    })
        .then(() => bcryptjs_1.default
        .genSalt(10)
        .then((salt) => bcryptjs_1.default.hash(password, salt))
        .then((hashedPassword) => {
        const creds = new credentialModel({
            username,
            hashedPassword
        });
        return creds.save();
    }));
}
function verify(username, password) {
    return credentialModel
        .find({ username })
        .then((found) => {
        if (!found || found.length !== 1)
            throw "Invalid username or password";
        return found[0];
    })
        .then((credsOnFile) => bcryptjs_1.default
        .compare(password, credsOnFile.hashedPassword)
        .then((result) => {
        if (!result)
            throw "Invalid username or password";
        return credsOnFile.username;
    }));
}
exports.default = { create, verify };
