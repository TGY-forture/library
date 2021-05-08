<template>
  <div class="u-history">
    <ul class="history-lists">
      <li
        v-for="(item, index) in showOrder"
        :key="index"
        :style="{ backgroundColor: background(item.status) }"
      >
        <a-row>
          <a-col :span="7">状态：</a-col>
          <a-col>{{ statusText(item.status) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">楼层:</a-col>
          <a-col>{{ item.floor }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">区域:</a-col>
          <a-col>{{ tran(item.area) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">座位号:</a-col>
          <a-col>{{ item.seq }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-tag>{{ item.date + " " + timeTrans(item.start) }}</a-tag>
            <a-tag>{{ item.date + " " + timeTrans(item.end) }}</a-tag>
          </a-col>
        </a-row>
      </li>
    </ul>
    <a-pagination
      v-model:current="page"
      :total="orders.pendingorder.length"
      :pageSize="10"
      size="small"
    ></a-pagination>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from 'vuex';
import moment from 'moment';
import { seatArea } from '@/assets/js/areaname.js';

export default defineComponent({
  name: "history",
  data() {
    return {
      page: 1,
    }
  },
  computed: {
    ...mapState(['orders']),
    showOrder() {
      return this.orders.pendingorder.slice((this.page - 1) * 10, (this.page - 1) * 10 + 10);
    }
  },
  methods: {
    statusText(status) {
      return status;
    },
    timeTrans(start) {
      return moment(new Date(+start)).format('HH:mm');
    },
    tran(area) {
      return seatArea[area];
    },
    background(status) {
      let color;
      switch (status) {
        case '3': color = 'rgb(69, 182, 211)'; break; //已签退
        case '4': color = '#949191'; break;//已取消
        case '5': color = 'f36b6b'; break;//违约
        default: color = 'rgb(69, 182, 211)'; break;
      }
      return color;
    }
  }
});
</script>

<style lang="less">
.u-history {
  .history-lists {
    height: 420px;
    margin: 20px 0;
    padding: 20px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      position: relative;
      margin-bottom: 15px;
      border-radius: 2px;
      padding: 10px 8px;
      color: white;
      .ant-row {
        margin: 8px 0;
      }
    }
  }
  .ant-pagination {
    text-align: center;
  }
}
</style>