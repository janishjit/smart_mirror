import io, { Socket } from "socket.io-client";

const USE_LOCALHOST = false;
let socket: Socket;
if (USE_LOCALHOST) {
  socket = io("http://localhost:8080", { transports: ["websocket"] });
} else {
  socket = io("http://107.22.249.15:8080", { transports: ["websocket"] });
}

export default socket;
