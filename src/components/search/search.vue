<template>
  <div class="u-search">
    <ul class="user">
      <li>
        <img src="../../assets/img/avatar.jpeg" alt="avatar" />
        <div>
          <p>nickname</p>
          <i class="custom-icon custom-icon-man"></i>
        </div>
      </li>
      <li>
        <a-tooltip>
          <template v-slot:title>姓名</template>
          <span>姓名</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>姓名</template>
          <span>年龄</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>姓名</template>
          <span>学院</span>
        </a-tooltip>
        <a-tooltip>
          <template v-slot:title>姓名</template>
          <span>联系方式</span>
        </a-tooltip>
      </li>
    </ul>
    <div class="sendto">
      <a-button type="primary" size="large" shape="round">发送消息</a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Search",
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