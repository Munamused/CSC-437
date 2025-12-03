"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
exports.initDb = initDb;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/testdb';
let connected = false;
async function initDb() {
    if (connected)
        return mongoose_1.default.connection;
    // If mongoose already has an active/connecting connection (e.g. connect() was called elsewhere), reuse it
    if (mongoose_1.default.connection && mongoose_1.default.connection.readyState && mongoose_1.default.connection.readyState !== 0) {
        connected = true;
        return mongoose_1.default.connection;
    }
    try {
        await mongoose_1.default.connect(MONGO_URI, { dbName: process.env.MONGO_DB || undefined });
        connected = true;
        mongoose_1.default.connection.on('error', (err) => console.error('MongoDB connection error', err));
        mongoose_1.default.connection.on('disconnected', () => { connected = false; });
        console.log('Connected to MongoDB');
        return mongoose_1.default.connection;
    }
    catch (e) {
        console.error('Could not connect to MongoDB', e);
        throw e;
    }
}
exports.default = { initDb, mongoose: mongoose_1.default };
