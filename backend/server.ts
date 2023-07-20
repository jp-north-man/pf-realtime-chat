import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Expressのインスタンスを作成
const app = express(); 

// Expressアプリケーションを基に、HTTPサーバーを作成
const server = createServer(app); 

// HTTPサーバーを基に、Socket.IOサーバーを作成
// CORS設定を通じて、任意のオリジンからの接続を許可する
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// ExpressアプリケーションにCORSミドルウェアを追加
app.use(cors()); 

let rooms: { id: string; name: string }[] = [];
let messages: { [key: string ]:{ message: string; data: string;}[] } = {};

// GETリクエストに対して、全ての部屋情報を返すエンドポイントを設定
app.get('/rooms', (req, res) => {
    res.json(rooms);
});

// 特定の部屋のメッセージ履歴を返すエンドポイントを設定
app.get('/messages/:roomId', (req, res) => {
    const { roomId } = req.params;
    res.json(messages[roomId] || []);
});

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.find(room => room.id === roomId);
  if(room) {
      res.json(room);
  } else {
      res.status(404).json({ error: 'ルームが見つかりません。' });
  }
});

// クライアントが接続したときのイベントリスナーを設定
io.on('connection', (socket: Socket) => {
  console.log('ユーザーが接続しました:', socket.id);

  // "create room" イベントを受け取ったときに新たな部屋を作成し、
  // その情報を全クライアントにブロードキャストする
  socket.on('create room', (roomName) => {
    const room = { id: uuidv4(), name: roomName };
    rooms.push(room);
    socket.join(room.id);
    io.emit('room created', room);
  });

  // "join room" イベントを受け取ったときにクライアントを指定した部屋に追加
  socket.on('join room', (room) => {
    socket.join(room);
  });

  // "chat message"イベントを受け取ったときにそのメッセージを同じ部屋の他のクライアントにブロードキャストします。
  socket.on('chat message', (msg, room) => {
    console.log('message:', msg);
    if (!messages[room]) {
      messages[room] = [];
    }
    messages[room].push({ message: msg, data: new Date().toISOString() });
    socket.to(room).emit('chat message', msg);
  });

  // クライアントが切断したときのイベントリスナー
  socket.on('disconnect', () => {
    console.log('ユーザーが切断しました:', socket.id);
  });
});

// サーバーを3001ポートで起動する
server.listen(3001, () => {
  console.log('サーバーが3001portで実行されました。');
});
