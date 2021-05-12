/**
 * 提供 websocket通信
 * 1.及时更新座位信息
 * 2.提供聊天功能
 */
import { io } from 'socket.io-client';
import store from '@/store/index.js';

const eventListener = () => {
  store.dispatch('getSeatInfo');//获取座位信息
  store.dispatch('getBookRecord');//获取座位预约记录
  store.dispatch('getUserRecord');//获取个人预约记录
}

export const createSocket = () => {
  const socket = io('wss://10.136.21.90:3000', {
    transports: ["websocket"],
    reconnection: false,
    auth: {
      accessToken: localStorage.getItem('accessToken')//携带用户token
    }
  });
  socket.on('update', eventListener);
  /*以下为socket连接相关事件*/
  socket.on('connect', () => {
    console.log(socket.id + ' has connected.',);
  });
  socket.on('disconnect', (reason) => {
    console.log('socket disconnected. reason:' + reason);
  });
  socket.io.on('reconnect', () => {
    console.log('reconnect success!');
  })
  socket.io.on("reconnect_attempt", () => {
    console.log('trying to reconnect.....');
  })
  return socket;
}