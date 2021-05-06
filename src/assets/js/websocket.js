/**
 * 提供 websocket通信
 * 1.及时更新座位信息
 * 2.提供聊天功能
 */

import { io } from 'socket.io-client';

export const createSocket = () => {
  io('https://10.136.21.90:3000')
}