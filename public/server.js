// server.js
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const ESP32_HOST = "172.20.10.3";
const ESP32_PORT = 80;

// JS(폰)에서 보내는 angleDeg (-30 ~ +30 정도)를
// 그대로 '오차각(errorDeg)'로 ESP32에 전달
function sendServoToESP32(angleDeg) {
  const errorDeg = Math.round(angleDeg);  // 소수점 정리

  const options = {
    host: ESP32_HOST,
    port: ESP32_PORT,
    path: `/angle?value=${errorDeg}`,
    method: "GET",
  };

  const req = http.request(options, (res) => {
    // 응답 바디는 굳이 안 써도 됨
    res.on("data", () => {});
  });

  req.on("error", (err) => {
    console.log("ESP32 요청 오류:", err.message);
  });

  req.end();

  console.log(`ESP32로 전송: errorDeg=${errorDeg}°`);
}


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

// HTTP 서버
const server = http.createServer((req, res) => {
  console.log("HTTP", req.method, req.url);

  //    http://노트북IP:3000/test-servo?angle=20
  if (req.url.startsWith("/test-servo")) {
    const urlObj = new URL(req.url, "http://localhost");
    const angleParam = urlObj.searchParams.get("angle") || "0";
    const angleDeg = Number(angleParam) || 0;

    console.log(`테스트 요청: angleDeg=${angleDeg}`);
    sendServoToESP32(angleDeg);  // ESP32에 바로 전송

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`ESP32로 테스트 각도 전송: ${angleDeg}°`);
    return;
  }

  let filePath = req.url;

  // 기본 페이지 (아이폰에서 그냥 http://노트북IP:3000/ 들어오면)
  if (filePath === "/" || filePath === "") {
    filePath = "/phone_faceapi.html";
    // 만약 파일 이름이 다르면 여기만 바꾸면 됨
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


const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket 연결됨");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "angle") {
        const angle = Number(data.angle);
        console.log(
          `폰에서 받은 얼굴 각도: ${angle.toFixed(1)}° (person=${data.person})`
        );

        //여기서 ESP32로 서보 각도(=오차각) 전송
        sendServoToESP32(angle);
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
  console.log(
    `HTTP+WS 서버가 포트 ${PORT}에서 실행 중 (http://localhost:${PORT})`
  );
});