import { createStore } from 'vuex';
import axios from '../assets/js/axios.js';

let store = createStore({
  state() {
    return {
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
      }
    }
  },
  getters: {},
  mutations: {
    initUserInfo(state, data) {
      state.user = data;
      console.log(data);
    }
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await axios.get('/user');
      commit('initUserInfo', data)
    }
  },
  modules: []
})

export default store;