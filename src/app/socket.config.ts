import io from "socket.io-client";
import { BASE_URL } from "./config";

const socket = io(BASE_URL, {
  autoConnect: false,
});

export { socket };
