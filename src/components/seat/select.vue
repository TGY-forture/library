<template>
  <div class="u-seat">
    <header>
      <a-radio-group v-model:value="select">
        <a-radio-button :value="true">今日选择</a-radio-button>
        <a-radio-button :value="false">明日预约</a-radio-button>
      </a-radio-group>
      <span v-if="checked" class="span">卡片模式</span>
      <span v-else class="span">普通模式</span>
      <a-switch v-model:checked="checked" />
    </header>
    <a-form :model="formfields" v-bind="col">
      <a-form-item label="楼层">
        <a-input-number
          v-model:value="formfields.floor"
          :min="1"
          :max="5"
          @change="changeArea"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="区域" v-if="!checked">
        <a-select v-model:value="formfields.area">
          <a-select-option v-for="area in areas" :key="area" :value="area">
            {{ seatArea[area] }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日期" v-if="!select">
        <a-date-picker
          :inputReadOnly="true"
          :disabledDate="disabledDate"
          v-model:value="formfields.date"
        ></a-date-picker>
      </a-form-item>
      <a-form-item v-if="!checked" label="座位号" :wrapperCol="{ span: 10 }">
        <a-input
          v-model:value="formfields.seq"
          type="number"
          :placeholder="'可选值1-' + seqOptions"
        ></a-input>
      </a-form-item>
      <a-form-item label="开始时间">
        <a-time-picker
          v-model:value="formfields.startTime"
          format="HH:mm"
          :inputReadOnly="true"
          :disabledHours="disabledHours"
          :disabledMinutes="disabledMinutes"
        ></a-time-picker>
      </a-form-item>
      <a-form-item label="结束时间">
        <a-time-picker
          v-model:value="formfields.endTime"
          format="HH:mm"
          :inputReadOnly="true"
          :disabledHours="disabledHours"
          :disabledMinutes="disabledMinutes"
        ></a-time-picker>
      </a-form-item>
    </a-form>
    <div class="card" v-if="checked">
      <a-tabs v-model:activeKey="formfields.activeArea">
        <a-tab-pane
          v-for="(items, key) in seatData[formfields.floor - 1]"
          :key="key"
          :tab="seatArea[key]"
        >
          <div class="seat-item" @click="changeSeq">
            <i
              class="custom-icon custom-icon-Armchair"
              v-for="seat in items"
              :data-index="seat.seq"
              :key="seat.seq"
              :style="{ color: genColor(seat.status) }"
            ></i>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="seat-infor">
      <div class="seat-top">
        <a-tooltip trigger="click">
          <template #title>使用中</template>
          <p class="dot"></p>
        </a-tooltip>
        <a-tooltip trigger="click">
          <template #title>已预约</template>
          <p class="dot"></p>
        </a-tooltip>
        <a-tooltip trigger="click">
          <template #title>空闲</template>
          <p class="dot"></p>
        </a-tooltip>
        <span>座位ID:{{ selectedSeat.id }}</span>
        <i class="custom-icon custom-icon-qrcode"></i>
      </div>
      <div class="seat-body">
        <a-row>
          <a-col :span="7">座位状态:</a-col>
          <a-col class="use-status">
            <span>{{ selectedSeat.status }}</span>
            <span
              :style="{ backgroundColor: genColor(selectedSeat.rawstatus) }"
            ></span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">使用者昵称:</a-col>
          <a-col class="nickname">{{ selectedSeat.user }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">已预约时间:</a-col>
          <a-col class="already">
            <span>点此查看</span>
            <i class="custom-icon custom-icon-Magnifiercontrol"></i>
          </a-col>
        </a-row>
      </div>
      <div class="seat-foot">
        <a-button
          type="dashed"
          size="large"
          :loading="loading"
          @touchstart.passive="appointment"
        >
          预约
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from "vue";
import moment from "moment";
import { notification } from "ant-design-vue";
import { mapGetters } from 'vuex';
import { seatArea } from '@/assets/js/areaname.js';
import { createSocket } from '@/assets/js/websocket.js'
createSocket();

export default defineComponent({
  name: "Select",
  setup() {
    const col = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    let formfields = reactive({
      floor: 1,
      area: "",
      activeArea: "",
      date: moment(moment().add(1, 'days'), "YYYY-MM-DD"),
      startTime: moment(moment(), "HH:mm"),
      endTime: moment(moment(), "HH:mm"),
      seq: '1',
    });
    let select = ref(false);
    watch(select, () => {
      formfields.startTime = moment(moment(), "HH:mm");
      formfields.endTime = moment(moment(), "HH:mm");
    });
    const disabledDate = (current) => {
      return !!current && (current < moment().endOf('day') || current > moment().add(2, 'days'));
    }
    //选择小时的时候区分今日与明日之后
    const disabledHours = () => {
      let hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      let nowhour = moment().hour();
      if (select.value) {//若是今日预约
        return nowhour < 7 ? [0, 1, 2, 3, 4, 5, 23] : hour.slice(0, nowhour).concat(23);
      } else {//否则就是明日及以后
        return [0, 1, 2, 3, 4, 5, 23];
      }
    }
    //选择分钟的时候区分今日与明日之后
    const disabledMinutes = (selecthour) => {
      let minute = [];
      for (let i = 0; i < 60; i++) {
        minute[i] = i;
      }
      let nowhour = moment().hour(); //当前小时
      let nowmin = moment().minute(); //当前分钟
      if (select.value) {//今日预约
        if (selecthour === nowhour) {//如果选择的小时等于当前小时,则需要禁用部分分钟
          if (nowhour === 6) {//只能选择6:30后的
            return nowmin < 30 ? minute.slice(0, 30) : minute.slice(0, nowmin + 1);
          }
          if (nowhour === 22) {//只能选择22:30前的
            return nowmin < 30 ? minute.slice(0, nowmin + 1).concat(minute.slice(31)) : minute;
          }
          return minute.slice(0, nowmin + 1);//其他情况
        } else { //当选择的时间大于当前小时
          if (selecthour === 22) {//只能选择22:30前的
            return minute.slice(31);
          }
          return [];//其他情况可以全选
        }
      } else { //明日...
        if (selecthour === 6) {//只能选择6:30后的
          return minute.slice(0, 30);
        }
        if (selecthour === 22) {//只能选择22:30前的
          return minute.slice(31);
        }
        return [];//其他情况都可以选
      }
    }
    return {
      select,
      formfields,
      col,
      disabledDate,
      disabledHours,
      disabledMinutes
    };
  },
  data() {
    return {
      seatArea,
      checked: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['seatData']),
    areas() {
      let area = Object.keys(this.seatData[this.formfields.floor - 1]);
      if (area.length > 0) {
        this.formfields.activeArea = area[0];
      }
      return area;
    },
    seqOptions() {
      let end = this.seatData[this.formfields.floor - 1];
      let names = Object.keys(end);
      //开发下热更新问题,记得打包时删除
      if (names.length > 0) {
        let s = this.checked ? 'activeArea' : 'area';
        if (!end[this.formfields[s]]) {
          this.formfields[s] = names[0];
          end = end[names[0]].length;
        } else {
          end = end[this.formfields[s]].length;
        }
        return end;
      }
      //
      return '';
    },
    selectedSeat() {
      let floor = this.seatData[this.formfields.floor - 1];
      let pos = this.checked ? floor[this.formfields.activeArea] : floor[this.formfields.area];
      if (!pos) {
        return {
          id: 'loading...',
          status: 'loading...',
          user: 'loading...',
          rawstatus: 0
        }
      }
      let seq = this.formfields.seq;
      //座位号不合法时重置
      if (seq === '0' || seq === '' || !/\d+/g.test(seq)) {
        seq = 1;
      } else if (+seq > this.seqOptions) {
        seq = this.seqOptions;
      }
      const item = pos[seq - 1];
      return {
        id: item.id,
        user: item.user == null ? '无' : item.user,
        status: item.status === 0 ? '空闲中' : (item.status === 1 ? '有预约' : '使用中'),
        rawstatus: item.status
      };
    }
  },
  watch: {
    'areas': function (nval) {
      this.formfields.area = nval[0];
    }
  },
  methods: {
    async appointment() {
      let handledata = {};
      handledata.date = this.select ? moment().format('YYYY-MM-DD') : this.formfields.date.format('YYYY-MM-DD');
      handledata.area = this.checked ? this.formfields.activeArea : this.formfields.area;
      let { startTime, endTime, seq, floor } = this.formfields;
      if (endTime.valueOf() - startTime.valueOf() < 18e+5) { //间隔小于30min,返回
        return;
      }
      if (+seq > this.seqOptions) { //座位号越界调整
        this.formfields.seq = this.seqOptions + '';
        seq = this.seqOptions;
      } else if (seq === '') {
        this.formfields.seq = '1';
        seq = 1;
      } else {
        seq = +seq;
      }
      let id = this.seatData[floor - 1][handledata.area][seq - 1].id;
      Object.assign(handledata, {
        startTime: startTime.valueOf(),
        endTime: endTime.valueOf(),
        id, seq, floor
      });
      this.loading = true;
      const { data } = await this.$axios.post('/bookseat', handledata).finally(() => {
        this.loading = false;
      });
      console.log(data);
    },
    genColor(status) {
      return status === 0 ? "rgb(51,224,51)" : (status === 1 ? "rgb(68,170,230)" : "rgb(255,0,0)");
    },
    changeArea(floor) {
      this.formfields.area = Object.keys(this.seatData[floor - 1])[0];
    },
    changeSeq(e) {
      let name = e.target.nodeName.toLowerCase();
      if (name === 'i') {
        let seq = e.target.dataset.index;
        this.formfields.seq = +seq;
      }
    }
  },
});
</script>

<style lang="less">
.u-seat {
  header {
    display: flex;
    align-items: center;
    .ant-radio-group {
      font-size: 12px;
    }
    .span {
      margin-left: auto;
      margin-right: 10px;
    }
  }
  .ant-form {
    margin-top: 15px;
    .ant-form-item {
      align-items: center;
      .ant-form-item-label {
        padding: 0;
      }
    }
  }
  .seat-infor {
    border-radius: 10px;
    border: 1px solid rgb(204, 204, 204);
    // height: 200px;
    .seat-top {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        margin-right: 20px;
      }
      i {
        font-size: 20px;
        margin-right: 10px;
      }
      .dot {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        margin: 0 10px 0 8px;
        &:first-child {
          background-color: rgb(255, 0, 0);
          margin-left: 15px;
        }
        &:nth-child(2) {
          background-color: rgb(68, 170, 230);
        }
        &:nth-child(3) {
          margin-right: auto;
          background-color: rgb(51, 224, 51);
        }
      }
    }
    .seat-body {
      padding: 15px 10px;
      font-size: 12px;
      .ant-row {
        margin-top: 5px;
        align-items: center;
        .use-status {
          display: flex;
          align-items: center;
          span:nth-child(2) {
            width: 14px;
            height: 14px;
            margin-left: 5px;
            border-radius: 7px;
          }
        }
        .nickname {
          color: rgb(50, 135, 233);
        }
        .already {
          display: flex;
          align-items: center;
          color: rgb(77, 74, 70);
        }
      }
    }
    .seat-foot {
      margin: 10px 0 20px;
      text-align: center;
    }
  }
  .card {
    margin-bottom: 30px;
    .ant-tabs-top-content {
      .seat-item {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        height: 200px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        .custom-icon {
          font-size: 16px;
          margin: 5px;
        }
      }
    }
  }
}
</style>