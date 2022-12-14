

const express = require("express");
const path = require("path");

const app = require("express")();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname + "/public")));

// new data
app.get('/sender',(req,res)=> res.sendFile(__dirname+'/public/sender.html'))

app.get('/receiver',(req,res)=> res.sendFile(__dirname+'/public/receiver.html'))

app.get('/team',(req,res)=> res.sendFile(__dirname+'/public/team/team.html'))

app.get('/about',(req,res)=> res.sendFile(__dirname+'/public/about.html'))



io.on("connection", function (socket) {
    socket.on("sender-join", function (data) {
        socket.join(data.uid);
    });
    socket.on("receiver-join", function (data) {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });
    socket.on("file-meta", function (data) {
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });
    socket.on("fs-start", function (data) {
        socket.in(data.uid).emit("fs-share", {});
    });
    socket.on("file-raw", function (data) {
        socket.in(data.uid).emit("fs-share", data.buffer);
    })
});

server.listen(5000);

