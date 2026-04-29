import express, { Request, Response } from "express";
import routes from "./routes/index.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
