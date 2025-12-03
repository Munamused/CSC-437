import express, { Request, Response } from "express";
import { Memory } from "../models/memory";

import Memories from "../services/memory-svc";

const router = express.Router();

// GET collection
router.get("/", (_, res: Response) => {
  Memories.index()
    .then((list: Memory[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET resource by memoryid
router.get("/:memoryid", (req: Request, res: Response) => {
  const { memoryid } = req.params;

  Memories.get(memoryid)
    .then((mem: Memory | null) => {
      if (mem) res.json(mem);
      else res.status(404).send();
    })
    .catch((err) => res.status(404).send(err));
});

// POST create
router.post("/", (req: Request, res: Response) => {
  const payload: Partial<Memory> = req.body;

  Memories.create(payload)
    .then((created: Memory) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT update
router.put("/:memoryid", (req: Request, res: Response) => {
  const { memoryid } = req.params;
  const payload: Partial<Memory> = req.body;

  Memories.update(memoryid, payload)
    .then((updated: Memory | null) => {
      if (updated) res.json(updated);
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

// DELETE remove
router.delete("/:memoryid", (req: Request, res: Response) => {
  const { memoryid } = req.params;

  Memories.remove(memoryid)
    .then((deleted: Memory | null) => {
      if (deleted) res.status(204).send();
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

export default router;
