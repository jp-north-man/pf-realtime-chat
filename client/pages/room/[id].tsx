import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import React, { useState, useEffect } from 'react';
import { io, Socket } from "socket.io-client";
import { Container, TextField, Button, Box, Card, CardContent, Grid, Typography} from '@mui/material';
import axios from "axios";

let socket: Socket; // ソケットインスタンスを管理するための変数

const RoomPage = () => {
  const router = useRouter();
  const { id: roomId } = router.query; // router.queryからroomIdを取得
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ message: string; data: string; }[]>([]);
  const title = roomName + " | チャットルーム"

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
    <Layout title={title}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>Room: {roomName}</Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          style={{height: "70vh", overflow: "auto", marginBottom: "10px"}}
        >
          {messages.map((message, index) => (
            <Box key={index}>
              <p>{message.message}</p>
            </Box>
          ))}
        </Box>
        <Grid 
          container 
          spacing={1} 
          alignItems="flex-end"
        >
          <Grid item xs={10}>
            <TextField
              label="Message"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              
            />
          </Grid>
          <Grid item xs={2}>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={handleSendMessage}
              style={{height: "56px"}}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
};

export default RoomPage;
