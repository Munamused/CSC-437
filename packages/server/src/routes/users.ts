import express, { Request, Response } from "express";
import { User } from "../models/user";

import Users from "../services/user-svc";

const router = express.Router();

// GET collection
router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET resource
router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  Users.get(userid)
    .then((user: User | null) => {
      if (user) res.json(user);
      else res.status(404).send();
    })
    .catch((err) => res.status(404).send(err));
});

// POST create
router.post("/", (req: Request, res: Response) => {
  const payload: User = req.body;

  Users.create(payload)
    .then((created: User) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT update
router.put("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  const payload: Partial<User> = req.body;

  Users.update(userid, payload)
    .then((updated: User | null) => {
      if (updated) res.json(updated);
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

// DELETE remove
router.delete("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  Users.remove(userid)
    .then((deleted: User | null) => {
      if (deleted) res.status(204).send();
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

export default router;
