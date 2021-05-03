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
      }
    }
  },
  getters: {},
  mutations: {
    initUserInfo(state, data) {
      state.user = data;
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
        return Promise.resolve(1)
      } else {
        return Promise.reject(-1);
      }
    }
  },
  modules: []
})

export default store;