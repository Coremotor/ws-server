import express from 'express'
import { createServer } from "http";
import cors from 'cors'
import morgan from 'morgan'
import { Server } from "socket.io"
import { genQueue, Queue } from "./queue.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        allowedHeaders: ["*"],
        credentials: true
    }
})

const queue = new Queue(genQueue(10))

app.use(morgan("dev"))
app.use(cors({credentials: true}))
app.use(express.json())

app.get('/', function(req, res) {
    res.send('Start')
});

app.post('/change-queue', function(req, res) {
    console.log(req.body)
    const {sourceIndex, destinationIndex} = req.body
    queue.reorder(sourceIndex, destinationIndex)
    io.sockets.emit('GET_QUEUE', queue.getQueue())
    res.send('change')
});

app.post('/remove-song', function(req, res) {
    console.log(req.body)
    const {id} = req.body
    queue.remove(id)
    io.sockets.emit('GET_QUEUE', queue.getQueue())
    res.send(`remove song ${id}`)
});


io.on('connection', (socket) => {
    console.log('User connected', socket.id)

    // отдаем очередь по принудительному запросу с клиента
    // в дате может прийти id плеера например
    socket.on("GET_QUEUE", (data) => {
        console.log('data in get_queue', data)
        socket.emit('GET_QUEUE', queue.getQueue())
    })

    // слушаем ивент с клиента при окончании перетаскивания песни
    // с клиента приходит:
    // {
    //     sourceIndex: number,
    //     destinationIndex: number,
    // }
    // обрабатываем очередь
    // эмитим новую очередь

    socket.on("CHANGE_QUEUE", (result) => {
        const {sourceIndex, destinationIndex} = result
        queue.reorder(sourceIndex, destinationIndex)
        socket.emit('GET_QUEUE', queue.getQueue())
    })

    socket.on("REMOVE_SONG", (id) => {
        queue.remove(id)
        socket.emit('GET_QUEUE', queue.getQueue())
    })

    socket.on('disconnect',  () => {
        console.log('User disconnected')
    });
});

httpServer.listen(3333, function() {
    console.log('listening on http://localhost:3333')
});
