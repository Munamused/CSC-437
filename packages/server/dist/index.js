"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_svc_1 = __importDefault(require("./services/user-svc"));
const mongo_1 = require("./services/mongo");
(0, mongo_1.connect)("thegarden");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express_1.default.static(staticDir));
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});
app.get("/users/:userid", (req, res) => {
    const { userid } = req.params;
    user_svc_1.default.get(userid).then((data) => {
        if (data)
            res
                .set("Content-Type", "application/json")
                .send(JSON.stringify(data));
        else
            res
                .status(404).send();
    });
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
