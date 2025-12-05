import express, { Request, Response } from "express";
import Users from "./services/user-svc";
import users from "./routes/users";
import memoryItem from "./routes/memory";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

import { connect } from "./services/mongo";

connect("thegarden");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Serve the main static dir (configured via STATIC env)
app.use(express.static(staticDir));

const protoRoot = path.resolve(__dirname, "..", "..", "proto");
app.use(express.static(protoRoot));

// Keep serving the `proto/public` subfolder for predictable asset paths
const protoPublic = path.resolve(__dirname, "..", "..", "proto", "public");
app.use(express.static(protoPublic));

// Middleware:
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// Mount users API router at /api/users
// /me endpoint is public, others require auth
app.use("/api/users", users);
// Mount memories API router at /api/memory (protected)
app.use("/api/memory", authenticateUser, memoryItem);
// Mount auth routes at /auth
app.use("/auth", auth);

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});