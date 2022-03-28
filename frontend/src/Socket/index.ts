import io from "socket.io-client";

let socket = io();
if (process.env.NODE_ENV !== "production") {
  socket = io("http://localhost:8080", { transports: ["websocket"] });
}

export default socket;
