import express, { Request, Response } from "express";
import Users from "./services/user-svc";

import { connect } from "./services/mongo";

connect("thegarden");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/users/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  Users.get(userid).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});