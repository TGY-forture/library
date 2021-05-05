<template>
  <div class="u-history">
    <ul class="history-lists">
      <li v-for="i in 10" :key="i">
        <a-row>
          <a-col :span="5">状态：</a-col>
          <a-col>已预约</a-col>
        </a-row>
        <a-row>
          <a-col :span="5">日期：</a-col>
          <a-col>2019-02-13 23:98:01</a-col>
        </a-row>
        <a-row>
          <a-col :span="5">时间段：</a-col>
          <a-col>已预约</a-col>
        </a-row>
      </li>
    </ul>
    <a-pagination
      v-model:current="page"
      :total="200"
      :pageSize="10"
      size="small"
    ></a-pagination>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "history",
  setup() {
    let page = ref(3);
    return {
      page,
    };
  },
});
</script>

<style lang="less">
.u-history {
  .history-lists {
    height: 420px;
    margin: 20px 0;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid rgba(216, 216, 216, 0.623);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      position: relative;
      margin: 10px 0;
      border-radius: 8px;
      padding: 10px 8px 4px;
      color: white;
      &:nth-child(2n + 1) {
        background-color: rgb(69, 182, 211);
      }
      &:nth-child(2n) {
        background-color: rgb(83, 223, 106);
      }
    }
  }
  .ant-pagination {
    text-align: center;
  }
}
</style>