const { tryCatch, removeElementArr } = require("../../helper/helperMain")

const connectedUsers = {

}
const connectedUsersWithUserId = {

}
const socketEvents = (io) => {
    tryCatch(() => {
        io.on('connection', (socket) => {
            socket.on('joinRoom', ({ bettingId, userIdOwn }) => {
                if (connectedUsersWithUserId[bettingId]?.includes(userIdOwn)) {
                    return;
                }
                socket.join(bettingId);
                if (!connectedUsers[bettingId]) {
                    connectedUsers[bettingId] = [socket.id];
                    connectedUsersWithUserId[bettingId] = [userIdOwn];
                } else {
                    connectedUsers[bettingId] = [...connectedUsers[bettingId], socket.id];
                }
                socket.on('sendChoice', (data) => {
                    const { bettingId } = data;
                    socket.to(bettingId).volatile.emit('receiveChoice', data)
                })
                socket.on('isConnected', (data) => {
                    const { bettingId } = data;
                    console.log(data)
                    socket.to(bettingId).volatile.emit('isConnected', { ...data, isConnected: true })
                    if (connectedUsers[bettingId] !== undefined && connectedUsers[bettingId].length > 1) {
                        socket.emit('isConnected', { ...data, isConnected: true })
                    }
                })

                // socket.on('winnerFound', (data) => {
                //     socket.to(bettingId).volatile.emit('winnerFound', data);
                // })








                socket.on('disconnect', () => {
                    socket.to(bettingId).volatile.emit('isConnected', { bettingId, isConnected: false, userIdOwn })
                    const newArr = removeElementArr(socket.id, connectedUsers[bettingId])
                    connectedUsers[bettingId] = [...newArr];
                    connectedUsersWithUserId[bettingId] = [...removeElementArr(userIdOwn, connectedUsersWithUserId[bettingId])]
                    if (!connectedUsers[bettingId].length) {
                        delete connectedUsers[bettingId]
                        delete connectedUsersWithUserId[bettingId]
                    }
                })
            })
        })
    })
}



module.exports = socketEvents;
