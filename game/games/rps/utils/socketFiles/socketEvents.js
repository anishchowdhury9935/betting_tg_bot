import connectToSocketServer from './connectToSocketServer.js'
const socket = connectToSocketServer()
const index = {
    joinRoom: (data = {}) => {
        socket.emit("joinRoom", { ...data });
        return;
    },
    sendChoice: (data) => {
        socket.emit("sendChoice", { ...data });
    },
    isConnected: (data) => {
        socket.emit("isConnected", { ...data });
    }
}
export default {
    socket,
    ...index
}