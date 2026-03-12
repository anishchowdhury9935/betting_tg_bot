import { io } from "socket.io-client";
import config from '../../../../config.js';
export default function connectToSocketServer() {
    const host = config.socket.hostUrl;
    const socket = io(host);
    return socket;
}