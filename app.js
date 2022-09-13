import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import DingRoute from "./router/ding.js";
import config from "./config.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

// 路由配置
app.use("/ding", DingRoute);

// 捕获404
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// 捕获异常
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.inner || err.stack);
});

app.listen(config.port || 8080, () => {
  console.log(`listen to http://localhost:${config.port || 8080}`);
});
