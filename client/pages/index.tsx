import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography } from '@mui/material';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import axios from 'axios';


const Top = () => {
  const router = useRouter();
  const [roomName, setRoomName] = useState(''); // 新たに作成する部屋の名前を保持
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]); // すでに作成された部屋名のリストを保持

  useEffect(() => {
    const socket = io('http://localhost:3001'); // Socket.IOクライアントを作成し、サーバーに接続
    // "room created"イベントをリッスンして、部屋が作成されたら部屋リストを更新
    socket.on('room created', (room) => {
      setRooms((prevRooms) => [...prevRooms, room]);
    });
    // 部屋リストをサーバーから取得
    axios.get('http://localhost:3001/rooms').then((response) => {
      setRooms(response.data);
    });
    // コンポーネントがアンマウントされたときにイベントリスナーを削除
    return () => {
      socket.off('room created');
    };
  }, []);

  const handleCreateRoom = () => {
    const socket = io('http://localhost:3001');
    socket.emit('create room', roomName) // "create room"イベントを発火して、新たに部屋を作成
    setRoomName(''); // 部屋を作成した後は、入力フィールドをクリア
  };

  // 部屋をクリックしたときにその部屋のチャットページに遷移します。
  const navigateToRoom = (roomId: string) => {
    router.push(`/room/${encodeURIComponent(roomId)}`);
  };
  

  return (
    <Layout title="ホーム | チャット部屋作成">
      <Box>
        <TextField label="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleCreateRoom}>
          Create Room
        </Button>
        <Typography variant="h6">Rooms:</Typography>
        {rooms.map((room) => (
          <Button onClick={() => navigateToRoom(room.id)} key={room.id}>
            {room.name}
          </Button>
        ))}
      </Box>
    </Layout>
  );
};

export default Top;
