"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_svc_1 = __importDefault(require("../services/user-svc"));
dotenv_1.default.config();
const router = express_1.default.Router();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";
// Middleware to protect endpoints (same as in auth.ts)
function protectRoute(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).end();
    }
    else {
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (error, decoded) => {
            if (decoded)
                next();
            else
                res.status(401).end();
        });
    }
}
// GET /me - return the current authenticated user based on JWT token (public)
router.get("/me", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ authenticated: false, username: "anonymous" });
    }
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (error, decoded) => {
        if (error || !decoded || !decoded.username) {
            console.log("Invalid token");
            return res.status(401).json({ authenticated: false, username: "anonymous" });
        }
        // Return authenticated user info
        res.json({
            authenticated: true,
            username: decoded.username,
            token: token
        });
    });
});
// GET collection (protected)
router.get("/", protectRoute, (_, res) => {
    user_svc_1.default.index()
        .then((list) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
// GET resource (protected)
router.get("/:userid", protectRoute, (req, res) => {
    const { userid } = req.params;
    user_svc_1.default.get(userid)
        .then((user) => {
        if (user)
            res.json(user);
        else
            res.status(404).send();
    })
        .catch((err) => res.status(404).send(err));
});
// POST create (protected)
router.post("/", protectRoute, (req, res) => {
    const payload = req.body;
    user_svc_1.default.create(payload)
        .then((created) => res.status(201).json(created))
        .catch((err) => res.status(500).send(err));
});
// PUT update (protected)
router.put("/:userid", protectRoute, (req, res) => {
    const { userid } = req.params;
    const payload = req.body;
    user_svc_1.default.update(userid, payload)
        .then((updated) => {
        if (updated)
            res.json(updated);
        else
            res.status(404).send();
    })
        .catch((err) => res.status(500).send(err));
});
// DELETE remove (protected)
router.delete("/:userid", protectRoute, (req, res) => {
    const { userid } = req.params;
    user_svc_1.default.remove(userid)
        .then((deleted) => {
        if (deleted)
            res.status(204).send();
        else
            res.status(404).send();
    })
        .catch((err) => res.status(500).send(err));
});
exports.default = router;
