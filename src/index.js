const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {generateMessage,generateLocationMessage} = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

io.on("connection",(socket)=>{
    console.log("New webSocket Connection");
    socket.emit("message",generateMessage("welcome!"));
    socket.broadcast.emit("message",generateMessage("A new user has joined!"));
    socket.on("sendMessage",(message,callback)=>{
        io.emit("message",generateMessage(message));
        callback();
    });
    socket.on("sendLocation",(coords,callback)=>{
        io.emit("locationMessage",generateLocationMessage("https://google.com/maps?q="+coords.latitude+","+coords.longitude));
        callback();
    })
    socket.on("disconnect",()=>{
        io.emit("message",generateMessage("A user has left!"));
    });
});



server.listen(port,()=>{
    console.log("Server started on port "+port);
})