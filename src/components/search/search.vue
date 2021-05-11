<template>
  <div class="u-search">
    <ul class="user">
      <li>
        <img :src="showuser.avatar" alt="avatar" />
        <div>
          <p>{{ showuser.nickname }}</p>
          <i
            class="custom-icon"
            :class="
              showuser.gender === 'man'
                ? 'custom-icon-man'
                : 'custom-icon-woman'
            "
          ></i>
        </div>
      </li>
      <li>
        <a-tooltip>
          <template v-slot:title>{{ showuser.faculty }}</template>
          <span>学院</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>{{ showuser.phone }}</template>
          <span>电话</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>{{ showuser.email }}</template>
          <span>邮箱</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>{{
            showuser.gender === "man" ? "男" : "女"
          }}</template>
          <span>性别</span>
        </a-tooltip>
      </li>
    </ul>
    <div class="sendto">
      <a-button
        type="primary"
        size="large"
        shape="round"
        :loading="loading"
        @click="sendPrepare"
        >发送消息</a-button
      >
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState, mapGetters } from 'vuex';
import { message } from 'ant-design-vue';

export default defineComponent({
  name: "Search",
  data() {
    return {
      searchuser: '',
      loading: false
    }
  },
  computed: {
    ...mapState(['otherusers', 'message', 'user']),
    ...mapGetters(['pureMess']),
    showuser() {
      return this.otherusers[this.searchuser];
    }
  },
  watch: {
    '$route.params': function ({ user }) {
      if (!user) return;//当离开此页面时不做任何事
      this.searchuser = user;
    }
  },
  created() {
    this.searchuser = this.$route.params.user;
  },
  methods: {
    async sendPrepare() {
      //通过socket发送消息
      //只要进入聊天页面,就让这个聊天记录显示在消息页,不论是否有信息
      this.loading = true;
      const { data } = await this.$axios.post('/updatenew', { touser: this.searchuser }).finally(() => this.loading = false);
      if (data === -1) {
        message.error('出错了');
        return;
      } else if (data === 0) {
        // this.$store.commit('addEmptyMess', { user: this.searchuser, dis: false });
      } else {//有对话时才在首页消息页显示
        // this.$store.commit('addEmptyMess', { user: this.searchuser, dis: true });
      }
      this.$router.push({ name: 'chat', params: { user: this.searchuser } });
    }
  }
});
</script>

<style lang="less">
.u-search {
  padding: 20px 20px;
  .user {
    margin-bottom: 0;
    border-radius: 5px 2px 5px 5px;
    color: white;
    background-color: rgb(0, 162, 255);
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgb(38, 43, 40);
      right: -10px;
      top: -10px;
    }
    li:first-child {
      display: flex;
      align-items: center;
      padding: 10px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      div {
        margin-left: 10px;
        p {
          margin-bottom: 0;
        }
      }
    }
    li:last-child {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-around;
    }
  }
  .sendto {
    text-align: center;
    margin: 20px 0;
  }
}
</style>