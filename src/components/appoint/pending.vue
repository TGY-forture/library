<template>
  <div class="u-pending">
    <ul v-if="orders.pendingorder.length">
      <li v-for="(item, index) in orders.pendingorder" :key="index">
        <a-row>
          <a-col :span="span">状态:</a-col>
          <a-col>{{ item.status === "1" ? "已预约" : "已签到" }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="span">楼层:</a-col>
          <a-col>{{ item.floor }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="span">区域:</a-col>
          <a-col>{{ genArea(item.area) }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="span">座位号:</a-col>
          <a-col>{{ item.seq }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="span">开始时间:</a-col>
          <a-col>
            <a-tag>{{ item.date + " " + genTime(item.start) }}</a-tag>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="span">结束时间:</a-col>
          <a-col>
            <a-tag>{{ item.date + " " + genTime(item.end) }}</a-tag>
          </a-col>
        </a-row>
        <a-row>
          <a-button
            type="primary"
            @click="signIn(item)"
            :disabled="
              item.status === '2' ||
              item.date !== new Date().toISOString().slice(0, 10)
            "
            >签到</a-button
          >
          <a-button
            type="dashed"
            @click="signOut(item)"
            :disabled="item.status === '1'"
            >签退</a-button
          >
          <a-button
            type="danger"
            @click="cancel(item)"
            :disabled="item.status === '2'"
            >取消</a-button
          >
        </a-row>
      </li>
    </ul>
    <template v-else>
      <a-empty>
        <template #description>暂无预约</template>
      </a-empty>
    </template>
    <Scan :visible="visible" @hideModal="visible = false" :info="curorder" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Scan from "../util/qrcode.vue";
import { mapState } from 'vuex';
import moment from 'moment';
import { seatArea } from '@/assets/js/areaname.js';
import { Modal, message } from 'ant-design-vue';

export default defineComponent({
  name: "pending",
  components: {
    Scan,
  },
  data() {
    return {
      visible: false,
      curorder: {},
      span: 10
    }
  },
  computed: {
    ...mapState(['orders'])
  },
  methods: {
    genTime(time) {
      return moment(new Date(+time).toISOString()).format('HH:mm')
    },
    signIn(item) {//开始时间后五分内可以签到
      let now = moment().format('HH:mm').split(':').map(Number);
      let expect = this.genTime(item.start).split(':').map(Number);
      now = now[0] * 60 + now[1];
      expect = expect[0] * 60 + expect[1];
      if (now < expect || now > expect + 5) {
        message.warning('现在不能签到');
        return;
      }
      this.curorder = Object.assign(item, { isin: true }); //isin代表是否签到操作
      this.visible = true;
    },
    signOut(item) {//签到之后可以随时签退,超出使用时间未签退时可以自动签退
      this.curorder = Object.assign(item, { isin: false });
      this.visible = true;
    },
    genArea(area) {
      return seatArea[area];
    },
    cancel(item) {
      Modal.confirm({
        content: '你确定要取消吗?',
        onOk: () => this.ensure(item)
      })
    },
    async ensure(item) {
      const { data } = await this.$axios.post('/cancel', item);
      console.log(data);
    }
  }
});
</script>

<style lang="less">
.u-pending {
  ul > li {
    padding: 10px;
    border-left: 4px solid rgba(20, 150, 236, 0.74);
    margin-bottom: 10px;
    .ant-row {
      margin-top: 12px;
      &:last-child {
        justify-content: center;
        .ant-btn-dashed {
          margin: 0 20px;
        }
      }
    }
  }
}
</style>