"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const memories_1 = __importDefault(require("./routes/memories"));
const auth_1 = __importStar(require("./routes/auth"));
const promises_1 = __importDefault(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const mongo_1 = require("./services/mongo");
(0, mongo_1.connect)("thegarden");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
// Serve the main static dir (configured via STATIC env)
app.use(express_1.default.static(staticDir));
const protoRoot = path_1.default.resolve(__dirname, "..", "..", "proto");
app.use(express_1.default.static(protoRoot));
// Keep serving the `proto/public` subfolder for predictable asset paths
const protoPublic = path_1.default.resolve(__dirname, "..", "..", "proto", "public");
app.use(express_1.default.static(protoPublic));
// Middleware:
app.use(express_1.default.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
// Mount users API router at /api/users
// /me endpoint is public, others require auth
app.use("/api/users", users_1.default);
// Mount memories API router at /api/memories (protected)
app.use("/api/memories", auth_1.authenticateUser, memories_1.default);
// Mount auth routes at /auth
app.use("/auth", auth_1.default);
app.use("/app", (req, res) => {
    const indexHtml = path_1.default.resolve(staticDir, "index.html");
    promises_1.default.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
