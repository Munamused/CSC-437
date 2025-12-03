"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_svc_1 = __importDefault(require("../services/user-svc"));
const router = express_1.default.Router();
// GET collection
router.get("/", (_, res) => {
    user_svc_1.default.index()
        .then((list) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
// GET resource
router.get("/:userid", (req, res) => {
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
// POST create
router.post("/", (req, res) => {
    const payload = req.body;
    user_svc_1.default.create(payload)
        .then((created) => res.status(201).json(created))
        .catch((err) => res.status(500).send(err));
});
// PUT update
router.put("/:userid", (req, res) => {
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
// DELETE remove
router.delete("/:userid", (req, res) => {
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
