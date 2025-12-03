import express, { Request, Response } from "express";
import Users from "./services/user-svc";
import users from "./routes/users";
import memories from "./routes/memories";

import { connect } from "./services/mongo";

connect("thegarden");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

// Middleware:
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

// Mount users API router at /api/users
app.use("/api/users", users);
// Mount memories API router at /api/memories
app.use("/api/memories", memories);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});