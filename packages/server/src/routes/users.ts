import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";

import Users from "../services/user-svc";

dotenv.config();

const router = express.Router();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

// Middleware to protect endpoints (same as in auth.ts)
function protectRoute(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && (authHeader as string).split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(401).end();
    });
  }
}

// GET /me - return the current authenticated user based on JWT token (public)
router.get("/me", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && (authHeader as string).split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ authenticated: false, username: "anonymous" });
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded: any) => {
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
router.get("/", protectRoute, (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET resource (protected)
router.get("/:userid", protectRoute, (req: Request, res: Response) => {
  const { userid } = req.params;

  Users.get(userid)
    .then((user: User | null) => {
      if (user) res.json(user);
      else res.status(404).send();
    })
    .catch((err) => res.status(404).send(err));
});

// POST create (protected)
router.post("/", protectRoute, (req: Request, res: Response) => {
  const payload: User = req.body;

  Users.create(payload)
    .then((created: User) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

// PUT update (protected)
router.put("/:userid", protectRoute, (req: Request, res: Response) => {
  const { userid } = req.params;
  const payload: Partial<User> = req.body;

  Users.update(userid, payload)
    .then((updated: User | null) => {
      if (updated) res.json(updated);
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

// DELETE remove (protected)
router.delete("/:userid", protectRoute, (req: Request, res: Response) => {
  const { userid } = req.params;

  Users.remove(userid)
    .then((deleted: User | null) => {
      if (deleted) res.status(204).send();
      else res.status(404).send();
    })
    .catch((err) => res.status(500).send(err));
});

export default router;
