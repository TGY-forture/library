<template>
  <div class="u-chat">
    <nav class="chat-nav">
      <i class="custom-icon custom-icon-Larrow" @click="$router.back()"></i>
      <div>
        <p>
          {{ !otherusers[touser] ? "loading" : otherusers[touser].nickname }}
        </p>
        <span class="dot"></span>
        <span>在线</span>
      </div>
    </nav>
    <ul class="mess-lists">
      <li
        v-for="(mes, index) of chatHistory"
        :key="index"
        class="common"
        :class="mes.send === user.student ? 'mess-send' : 'mess-recv'"
      >
        <img
          :src="
            mes.send === user.student ? user.avatar : otherusers[touser].avatar
          "
          alt="head"
        />
        <div class="content">{{ mes.mess }}</div>
      </li>
    </ul>
    <footer class="send">
      <a-textarea
        placeholder="输入内容 最多两百字"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        :maxLength="200"
        v-model:value="mess"
      />
      <a-button type="primary" shape="round" @click="send">发送</a-button>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapState } from 'vuex';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: "Chat",
  data() {
    return {
      touser: null,
      mess: ''
    }
  },
  computed: {
    ...mapState(['otherusers', 'user', 'socket']),
    ...mapGetters(['pureMess']),
    chatHistory() {
      if (!this.touser || !this.otherusers[this.touser] || !this.pureMess[this.touser]) return [];
      return this.pureMess[this.touser]; //可能是空数组
    }
  },
  created() {
    this.touser = this.$route.params.user;
  },
  mounted() {
    this.scroll();
    this.socket.on('recvmessage', (newmess) => {
      message.info('客户端收到了消息');
      this.$store.commit('updateMess', { info: newmess, type: 'receive' });
      this.scroll();
    })
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params.user) {
      next('/seat');
      return;
    }
    next();
  },
  methods: {
    send() {
      if (this.mess === '') return;
      let trans = {
        send: this.user.student,
        recv: this.touser,
        time: Date.now(),
        dis: '1',
        mess: this.mess
      }
      this.mess = '';
      this.socket.emit('sendmessage', this.touser, trans)
      this.$store.commit('updateMess', { info: trans, type: 'send' });
      this.scroll();
    },
    scroll() {
      this.$nextTick(() => {
        let lists = document.getElementsByClassName('common');
        if (lists.length > 0) {
          let last = lists[lists.length - 1];
          last.scrollIntoView();
        }
      })
    }
  }
});
</script>
 
<style lang="less">
.u-chat {
  position: relative;
  .chat-nav {
    display: flex;
    background: linear-gradient(to right, #00d9ff, #00a8ff);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .custom-icon {
      font-size: 28px;
      margin-right: calc((100% - 28px) / 2 - 50px);
    }
    div {
      text-align: center;
      span {
        font-size: 10px;
        vertical-align: middle;
      }
      .dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: rgb(10, 224, 81);
        margin-right: 2px;
      }
      p {
        margin-bottom: 0;
        font-size: 12px;
        width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .mess-lists {
    height: 400px;
    border: 1px solid rgb(173, 171, 171);
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }

    li.common {
      margin: 10px 0;
      padding: 4px 8px;
      display: flex;
      align-items: flex-start;
      img {
        width: 30px;
        height: 30px;
        border-radius: 15px;
      }
      .content {
        max-width: calc(100% - 60px); //30
        line-height: 1.4em;
        word-break: break-all;
        padding: 8px;
        background-color: #12b7f5;
        position: relative;
        color: white;
        border-radius: 5px;
        &::before {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: inherit;
          transform: rotateZ(45deg);
        }
      }
    }
    .mess-recv {
      justify-content: flex-start;
      .content {
        margin-left: 10px;
        &::before {
          border-bottom-left-radius: 3px;
          left: -4px;
        }
      }
    }
    .mess-send {
      justify-content: flex-end;
      .content {
        order: 0;
        margin-right: 10px;
        &::before {
          border-top-right-radius: 3px;
          right: -4px;
        }
      }
      img {
        order: 1;
      }
    }
  }
  .send {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .ant-input {
      margin-right: 20px;
      border-radius: 16px;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>