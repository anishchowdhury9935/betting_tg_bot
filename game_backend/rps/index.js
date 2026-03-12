const express = require('express');
const app = express();
const config = require('./config.js');
const port = config.server.port || 5000;
const { createServer } = require('node:http');
const server = createServer(app);
const connectSocketServer = require('./utils/socketFiles/connectSocketServer');
const connectToMongo = require('./utils/db/connectToMongo.js');
const cors = require('cors');
app.use(cors({ origin: config.server.corsOrigin }));
connectToMongo(); // connect to MongoDB
connectSocketServer(server); // socket server

app.use('/api',require('./utils/routes/choice.js'));




app.get('*', (req, res) => {
    res.status(403).send('🚫This is forbidden!🚫');
})


server.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`)
}) 
