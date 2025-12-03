"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memory_svc_1 = __importDefault(require("../services/memory-svc"));
const router = express_1.default.Router();
// GET collection
router.get("/", (_, res) => {
    memory_svc_1.default.index()
        .then((list) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
// GET resource by memoryid
router.get("/:memoryid", (req, res) => {
    const { memoryid } = req.params;
    memory_svc_1.default.get(memoryid)
        .then((mem) => {
        if (mem)
            res.json(mem);
        else
            res.status(404).send();
    })
        .catch((err) => res.status(404).send(err));
});
// POST create
router.post("/", (req, res) => {
    const payload = req.body;
    memory_svc_1.default.create(payload)
        .then((created) => res.status(201).json(created))
        .catch((err) => res.status(500).send(err));
});
// PUT update
router.put("/:memoryid", (req, res) => {
    const { memoryid } = req.params;
    const payload = req.body;
    memory_svc_1.default.update(memoryid, payload)
        .then((updated) => {
        if (updated)
            res.json(updated);
        else
            res.status(404).send();
    })
        .catch((err) => res.status(500).send(err));
});
// DELETE remove
router.delete("/:memoryid", (req, res) => {
    const { memoryid } = req.params;
    memory_svc_1.default.remove(memoryid)
        .then((deleted) => {
        if (deleted)
            res.status(204).send();
        else
            res.status(404).send();
    })
        .catch((err) => res.status(500).send(err));
});
exports.default = router;
