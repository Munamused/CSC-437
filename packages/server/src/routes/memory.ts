import express, { Request, Response } from "express";
import { MemoryItem } from "../models/memory";

import Memories from "../services/memory-svc";

const router = express.Router();

// GET collection - filter by authenticated user
router.get("/", (req: Request, res: Response) => {
  const userid = (req as any).userid;
  Memories.indexByUser(userid)
    .then((list: MemoryItem[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET resource by memoryid - verify ownership
router.get("/:memoryid", (req: Request, res: Response) => {
  const userid = (req as any).userid;
  const { memoryid } = req.params;

  Memories.get(memoryid)
    .then((mem: MemoryItem | null) => {
      if (mem && mem.userid === userid) res.json(mem);
      else res.status(404).send();
    })
    .catch((err) => res.status(404).send(err));
});

// POST create - attach to authenticated user
router.post("/", (req: Request, res: Response) => {
  const userid = (req as any).userid;
  const payload: Partial<MemoryItem> = req.body;
  payload.userid = userid;

  Memories.create(payload)
    .then((created: MemoryItem) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT update - verify ownership
router.put("/:memoryid", (req: Request, res: Response) => {
  const userid = (req as any).userid;
  const { memoryid } = req.params;
  const payload: Partial<MemoryItem> = req.body;

  Memories.get(memoryid)
    .then((mem: MemoryItem | null) => {
      if (mem && mem.userid === userid) {
        Memories.update(memoryid, payload)
          .then((updated: MemoryItem | null) => res.json(updated))
          .catch((err) => res.status(500).send(err));
      } else {
        res.status(403).send();
      }
    })
    .catch((err) => res.status(404).send(err));
});

// DELETE remove - verify ownership
router.delete("/:memoryid", (req: Request, res: Response) => {
  const userid = (req as any).userid;
  const { memoryid } = req.params;

  Memories.get(memoryid)
    .then((mem: MemoryItem | null) => {
      if (mem && mem.userid === userid) {
        Memories.remove(memoryid)
          .then((deleted: MemoryItem | null) => {
            if (deleted) res.status(204).send();
            else res.status(404).send();
          })
          .catch((err) => res.status(500).send(err));
      } else {
        res.status(403).send();
      }
    })
    .catch((err) => res.status(404).send(err));
});

export default router;
