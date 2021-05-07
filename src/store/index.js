import { createStore } from 'vuex';
import axios from '../assets/js/axios.js';

let store = createStore({
  state() {
    return {
      user: {
        age: 18,
        avatar: 'https://10.136.21.90:8080/img/1232381748.jpeg',
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
      orders: []
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
      // console.log(result);
      return result;
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
    }
  },
  modules: []
})

export default store;