import { createRequestHandler } from "@remix-run/express";
import express from "express";

// 環境変数から実行モード(develop/production)を取得し、
// 開発モードの場合はViteの開発サーバーを起動
const viteDevServer =
  process.env.NODE_ENV === "production"
    ? null
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();

// 開発モードの場合はViteの開発サーバーをミドルウェアとして登録
// 本番モードの場合はビルド済みのクライアントアプリを提供
app.use(
	viteDevServer
		? viteDevServer.middlewares
		: express.static("build/client")
);

// サーバーサイドのビルドを行う関数を取得
const build = viteDevServer
  ? () =>
      viteDevServer.ssrLoadModule(
        "virtual:remix/server-build"
      )
  : await import("./build/server/index.js");

// そして、アプリは「単なるリクエストハンドラー」です
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
