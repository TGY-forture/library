<template>
  <div class="u-message">
    <a-empty v-if="empty">
      <template #description>
        <span @click="show">暂无消息</span>
      </template>
    </a-empty>
    <ul class="mess" v-else>
      <li v-for="i in 2" :key="i">
        <img src="../../assets/img/begin.png" alt="logo" @click="show" />
        <div @click="toChat">
          <p>爱吃蘑菇的小男孩127胡风很大把v8哈哈</p>
          <p>今天你拉屎了吗?</p>
        </div>
        <i class="custom-icon custom-icon-garbage"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Message",
  setup() {
    let empty = ref(false);
    const show = () => {
      empty.value = !empty.value;
    };
    let router = useRouter();
    const toChat = () => {
      router.push("/chat");
    };
    return {
      empty,
      show,
      toChat,
    };
  },
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