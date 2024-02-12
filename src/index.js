const express = require('express');
const http = require('http');
const cors = require('cors');
const api = require('./App');
require('dotenv').config();

//  <-------------------------------Variables - Start---------------------------------------------->
const { PORT = 8080 } = process.env;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors('*'));

// <-----------------------------------PORT------------------------------------->
server.listen(PORT, () => {
  api(app);
  console.info(`The server is Running on port ${PORT}`);
});

module.exports = app;
