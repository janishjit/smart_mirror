import io from "socket.io-client";

let socket = io("http://107.22.249.15:8080", { transports: ["websocket"] });
console.log(socket.connected);

// if (process.env.NODE_ENV !== "production") {
//   socket = io("http://localhost:8080", { transports: ["websocket"] });
// }

export default socket;
