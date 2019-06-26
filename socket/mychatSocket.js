const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = require("socket.io").listen(server);

// const hostname = "172.17.39.255"; //线上
// const hostname = "localhost"; //本地


// app.use("/", express.static(__dirname + "/"))


let onlineUser = {};
let i = 0;
let onlineUserCount = 0;
let username = [];

// 服务端 监听用户链接上线
io.on("connection", (socket) => {
    // console.log(`${querystring.stringify(socket)}   上线了...`);

    // socket.on("login",(value) => {
    //     onlineUserCount++;    
    //     console.log(value);
    //     username.push(value);
    //     socket.name = value;
    //     socket.emit("loginSuccess");//只能发送对应的用户
    //     io.sockets.emit("setUserCount",onlineUserCount);
    //     io.sockets.emit("system",value);

    // })


    //群聊消息更新
    socket.on("chatUpdate", object => {
        io.sockets.emit("sendSuccess", object);
    })

    //设置用户信息
    socket.on("setUserInfo", str => {
        io.sockets.emit("setUserInfo", str);
    })

    socket.on("makeFriend", _ => {
        io.sockets.emit("makeFriend");
    })

    //私聊消息发送成功，则去调用私聊接口查询聊天记录
    socket.on("Send_Private_Chat_Success", object => {
        io.sockets.emit("Update_Private_Chat", object);
    })

    //私聊消息发送成功，则去调用消息列表
    socket.on("Send_Private_Chat_Get_Message_List", object => {
        io.sockets.emit("Get_Message_List", object);
    })





    // socket.on("disconnect",()=>{
    //     onlineUserCount--;
    //     io.sockets.emit("setUserCount",onlineUserCount);
    //     socket.broadcast.emit("sendMsg",socket.name,"886,我走了");  
    // })

})




server.listen("4000", {
    origins: '*'
}, _ => console.log('监听开始'))