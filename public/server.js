// server.js
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 간단한 MIME 타입 매핑
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

// HTTP 서버: 현재 폴더의 정적 파일을 서빙
const server = http.createServer((req, res) => {
  console.log("HTTP", req.method, req.url);

  let filePath = req.url;

  // 기본 페이지
  if (filePath === "/" || filePath === "") {
    filePath = "/phone_mediapipe.html"; // 기본으로 이 파일을 열게 할지 선택
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || "text/plain; charset=utf-8";
  const fullPath = path.join(__dirname, filePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

// WebSocket 서버를 같은 포트에 붙이기
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket 연결됨");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === "angle") {
        const angle = Number(data.angle);
        console.log(`얼굴 각도: ${angle.toFixed(1)}°`);
      }
    } catch (e) {
      console.error("WS 메시지 파싱 오류:", e);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket 연결 종료");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP+WS 서버가 포트 ${PORT}에서 실행 중 (http://localhost:${PORT})`);
});
