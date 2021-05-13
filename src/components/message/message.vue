<template>
  <div class="u-message">
    <a-empty v-if="!seenMess.length">
      <template #description>
        <span
          @click="
            $router.push({ name: 'chat', params: { user: '172210303316' } })
          "
          >暂无消息</span
        >
      </template>
    </a-empty>
    <ul class="mess" v-else>
      <li v-for="(item, index) of seenMess" :key="index">
        <img :src="item.user.avatar" alt="logo" />
        <div @click="toChat(item.user.student)">
          <p>{{ item.user.nickname }}</p>
          <p>{{ item.message.mess }}</p>
        </div>
        <i class="custom-icon custom-icon-garbage" @click="hideMess"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { mapGetters } from 'vuex';

export default defineComponent({
  name: "Message",
  setup() {
    let router = useRouter();
    const toChat = (user) => {
      router.push({ name: 'chat', params: { user } });
    };
    return {
      toChat,
    };
  },
  computed: {
    ...mapGetters(['showMess']),
    seenMess() {
      return this.showMess.filter(v => v.dis === '1');
    }
  },
  methods: {
    hideMess() {
      console.log('-------------');
    },
  }
});
</script>

<style lang="less">
.u-message {
  .ant-empty {
    margin: 30px 0;
  }
  .mess {
    margin-top: 30px;
    li {
      display: flex;
      align-items: center;
      padding: 20px 10px;
      background-color: #ebebeb75;
      margin-bottom: 1px;
      border-radius: 4px;
      position: relative;
      .custom-icon {
        position: absolute;
        font-size: 20px;
        color: #1296db;
        right: 10px;
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        border: 2px solid rgb(37, 199, 211);
      }
      div {
        width: 200px;
        margin-left: 10px;
        p {
          margin-bottom: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:last-child {
            font-size: 12px;
            color: rgb(90, 88, 88);
          }
        }
      }
    }
  }
}
</style>