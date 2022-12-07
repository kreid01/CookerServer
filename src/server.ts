import { recipeController } from "./controllers/recipes";
import express from "express";
import "dotenv/config";
import { usersController } from "./controllers/users";
import { authController } from "./controllers/auth";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const fs = require("fs");

const app = express();
const https = require("https");

app.use(cookieParser());
app.use(
  cors({
    origin: "exp://192.168.0.73:19000",
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersController);
app.use("/auth", authController);
app.use("/recipes", recipeController);

https.createServer(
  {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  },
  app
);

app.listen("80", () => {
  console.log(
    "server started",
    process.env.REFRESH_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_SECRET
  );
});
