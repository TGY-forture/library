import { createStore } from 'vuex';
import axios from '../assets/js/axios.js';

let store = createStore({
  state() {
    return {
      socket: null,//websocket连接
      user: {
        age: 18,
        avatar: '',
        email: '',
        faculty: '',
        nickname: '暂无',
        star: 0,
        gender: 'man',
        student: '',
        github: '0',
        phone: ''
      },
      seat: [],
      record: [],
      orders: { pendingorder: [], completeorder: [] },
      message: {},//{ 1722: { dis: '0', message: [{ send,recv,time,dis,mess }] } }
      otherusers: {},//{ 1822: { 用户信息 }, 1722: { 用户信息 } }
    }
  },
  getters: {
    seatData({ seat }) {//对得到的座位信息处理，方便筛选
      let result = [{}, {}, {}, {}, {}];//五层的信息
      seat.forEach((obj) => {
        let areaitem = result[+obj.floor - 1];
        if (areaitem[obj.area] == undefined) {
          areaitem[obj.area] = [];
        }
        const { seq, id, status, user } = obj;
        areaitem[obj.area].push({ seq, id, status, user });
      });
      return result;
    },
    showMess({ message, otherusers }) {//[{ message: 'xxx', user: { 用户信息 }, dis: '0' }, {}]
      let ret = [];
      for (let k in message) {
        let mes = {};
        mes.message = message[k].message.sort((a, b) => (+b.time) - (+a.time))[0];
        mes.user = otherusers[k] ? otherusers[k] : {};
        mes.dis = message[k].dis;
        ret.push(mes);
      }
      console.log(ret);
      return ret;
    },
    pureMess({ message }) {//形式:{ 1722: [[{ 用户消息}, { 用户消息 }]] }
      let res = {};
      for (let user in message) {
        if (!res[user]) {
          res[user] = message[user].message;
        }
        res[user].sort((a, b) => (+a.time) - (+b.time));
      }
      return res;
    }
  },
  mutations: {
    initUserInfo(state, data) {
      state.user = data;
    },
    initSeatInfo(state, data) {
      state.seat = data;
    },
    initBookRecord(state, data) {
      state.record = data;
    },
    initUserRecord(state, data) {
      state.orders = data;
    },
    initUserMessage(state, data) {
      state.message = data;
    },
    initOthers(state, data) {
      state.otherusers = data;
    },
    addUser(state, { value, data }) {
      if (state.otherusers[value]) return;
      state.otherusers[value] = data;
    },
    updateMess(state, { info, type }) {
      const { recv, send, dis } = info;
      let other = type === 'send' ? recv : send;
      if (!state.message[other]) {
        state.message[other] = {
          message: []
        }
      }
      state.message[other].dis = dis;
      state.message[other].message.push(info);
    },
    setSocket(state, newsocket) {
      state.socket = newsocket;
    }
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await axios.get('/user');
      commit('initUserInfo', data)
    },
    async updateUserInfo({ dispatch }, args) {
      const { data } = await axios.post('/user', args);
      if (data === 1) {
        await dispatch('getUserInfo');
        return 1
      } else {
        return -1;
      }
    },
    async getSeatInfo({ commit }) {
      const { data } = await axios.get('/seatinfo');
      if (data === -1) {
        return -1;
      } else {
        commit('initSeatInfo', data);
        return 1;
      }
    },
    async getBookRecord({ commit }) {
      const { data } = await axios.get('/time');
      commit('initBookRecord', data)
    },
    async getUserRecord({ commit }) {
      let { data } = await axios.get('/userseat');
      commit('initUserRecord', data);
    },
    async getUserMessage({ commit }) {
      const { data } = await axios.get('/chat');
      commit('initUserMessage', data);
      if (Object.keys(data).length > 0) {
        let { data: otheruser } = await axios.post('/others', Object.keys(data));
        commit('initOthers', otheruser)
      }
    }
  },
  modules: []
})

export default store;