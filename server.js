import { createRequestHandler } from "@remix-run/express";
import express from "express";
 
// `remix vite:build` の結果は「単なるモジュール」であることに注意してください
import * as build from "./build/server/index.js";
 
const app = express();
app.use(express.static("build/client"));
 
// そして、アプリは「単なるリクエストハンドラー」です
app.all("*", createRequestHandler({ build }));
 
app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
