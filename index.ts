import express, { Request, Response } from "express";
import routes from "./routes/index.route";

const app = express();
const port = 4000;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
