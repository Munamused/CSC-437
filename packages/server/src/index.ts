import express, { Request, Response } from "express";
import { initPool } from "./services/db";
import Users from "./services/user-svc";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.json());

// serve static files (proto build output)
app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const list = await Users.index();
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

app.get('/users/:userid', async (req: Request, res: Response) => {
  const { userid } = req.params;
  try {
    const t = await Users.get(userid);
    if (t) res.json(t);
    else res.status(404).send();
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

async function start() {
  // init DB pool
  initPool();
  // ensure schema exists
  try {
    await Users.initSchema();
  } catch (e) {
    console.warn('Could not initialize schema', e);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();
