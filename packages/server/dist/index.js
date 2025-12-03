"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const mongo_1 = require("./services/mongo");
(0, mongo_1.connect)("thegarden");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express_1.default.static(staticDir));
// Middleware:
app.use(express_1.default.json());
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
// Mount users API router at /api/users
app.use("/api/users", users_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
