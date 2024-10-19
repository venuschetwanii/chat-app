const path = require('path')
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const Filter = require('bad-words')
const { generatemessage, generatelocation } = require('./utils/messages')
const { adduser, removeuser, getuser, getuserInroom } = require('./utils/users')


const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname, '../public')
const { Server } = require("socket.io");

const io = new Server(server);

app.use(express.static(publicDirectory))
//let count = 0
io.on('connection', (socket) => {
    console.log('New Websocket connected');


    socket.on('join', (options,callback) => {
        const user = adduser({ id: socket.id, ...options })
        
       
        if(user.error)
        {
            return callback(user.error)
        }
        


        socket.join(user.room)

        socket.emit('message', generatemessage('Admin','welcome!'))
       
        socket.broadcast.to(user.room).emit('message', generatemessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getuserInroom(user.room)
        })

        callback()

    })

    socket.on('sendmessage', (message, callback) => {
        const filter = new Filter()
        const user=getuser(socket.id)

        if (filter.isProfane(message)) {
            return callback('profanity is not allowed')
        }


        io.to(user.room).emit('message', generatemessage(user.username,message))
        callback()
    })

    socket.on('disconnect', () => {

        const user = removeuser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generatemessage('Admin',`${user.username} has left!!`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getuserInroom(user.room)
            })
    
        }
       
    })

    socket.on('sendlocation', (coords, callback) => {
        const user=getuser(socket.id)

        io.to(user.room).emit('locationmessage', generatelocation(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
});


server.listen(port, () => {
    console.log(`server is up on the port ${port}`);
})



