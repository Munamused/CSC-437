"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./services/db");
const user_svc_1 = __importDefault(require("./services/user-svc"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express_1.default.json());
// serve static files (proto build output)
app.use(express_1.default.static(staticDir));
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get('/users', async (req, res) => {
    try {
        const list = await user_svc_1.default.index();
        res.json(list);
    }
    catch (e) {
        console.error(e);
        res.status(500).send();
    }
});
app.get('/users/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
        const t = await user_svc_1.default.get(userid);
        if (t)
            res.json(t);
        else
            res.status(404).send();
    }
    catch (e) {
        console.error(e);
        res.status(500).send();
    }
});
async function start() {
    // init DB pool
    (0, db_1.initPool)();
    // ensure schema exists
    try {
        await user_svc_1.default.initSchema();
    }
    catch (e) {
        console.warn('Could not initialize schema', e);
    }
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
start();
