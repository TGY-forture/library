<template>
  <div class="u-chat">
    <nav class="chat-nav">
      <i class="custom-icon custom-icon-Larrow"></i>
      <div>
        <p>昵称黄寺大街空心菜菜时间节点</p>
        <span class="dot"></span>
        <span>在线</span>
      </div>
    </nav>
    <ul class="mess-lists">
      <li
        v-for="i in 8"
        :key="i"
        class="common"
        :class="i % 2 === 0 ? 'mess-to' : 'mess-from'"
      >
        <img src="../../assets/img/1232381748.jpeg" alt="head" />
        <div class="content">wo就抗衰老的</div>
      </li>
    </ul>
    <footer class="send">
      <a-textarea
        placeholder="输入内容 最多两百字"
        :auto-size="{ minRows: 1, maxRows: 4 }"
        :maxLength="200"
      />
      <a-button type="primary" shape="round">发送</a-button>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Chat",
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
    .mess-from {
      justify-content: flex-start;
      .content {
        margin-left: 10px;
        &::before {
          border-bottom-left-radius: 3px;
          left: -4px;
        }
      }
    }
    .mess-to {
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