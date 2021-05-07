/**
 * 提供 websocket通信
 * 1.及时更新座位信息
 * 2.提供聊天功能
 */

import { io } from 'socket.io-client';

export const createSocket = () => {
  const socket = io('wss://10.136.21.90:3000', {
    transports: ["websocket"],
    // reconnection: false,
    auth: {
      accessToken: localStorage.getItem('accessToken')//携带用户token
    }
  });
  socket.on('connect', () => {
    console.log(socket.id + '已连接',);
  });
  socket.on('disconnect', () => {
    console.log('出现重复连接,已拒绝');
  });
  socket.io.on('reconnect', () => {
    console.log('重新连接成功');
  })
  socket.io.on("reconnect_attempt", () => {
    console.log('尝试重新连接');
  })
}