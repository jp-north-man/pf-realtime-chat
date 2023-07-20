import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import { Box, TextField, Button } from '@mui/material';
import axios from "axios";

let socket: Socket; // ソケットインスタンスを管理するための変数

const RoomPage = () => {
  const router = useRouter();
  const { id: roomId } = router.query; // router.queryからroomIdを取得
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ message: string; data: string; }[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.emit('join room', roomId); // 指定したroomIdの部屋に参加
    
    // "chat message"イベントをリッスンして、メッセージが送られてきたらメッセージリストを更新
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, { message: msg, data: new Date().toISOString() }]);
    });

    // 部屋名をサーバーから取得
    axios.get(`http://localhost:3001/room/${roomId}`).then((response) => {
      setRoomName(response.data.name); // サーバーから取得した部屋名をステートにセット
    });
    
    // 部屋のメッセージ履歴をサーバーから取得
    axios.get(`http://localhost:3001/messages/${roomId}`).then((response) => {
      setMessages(response.data);
    });

    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleSendMessage = () => {
    const socket = io('http://localhost:3001');
    socket.emit('chat message', message, roomId); // "chat message"イベントを発火して、新たにメッセージを送ります。
    setMessage('');
  };

  return (
    <Layout title="ChatRoom | ">
      <Box>
        <h1>Room: {roomName}</h1>
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
        <div>
          {messages.map((message, index) => (
            <p key={index}>{message.message}</p>
          ))}
        </div>
      </Box>
    </Layout>
  )
};

export default RoomPage;
