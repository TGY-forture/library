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
          :max="6"
        ></a-input-number>
      </a-form-item>
      <a-form-item label="区域" v-if="!checked">
        <a-select v-bind:value="formfields.area">
          <a-select-option value="g">g</a-select-option>
          <a-select-option value="2">2</a-select-option>
          <a-select-option value="s">s</a-select-option>
          <a-select-option value="a">a</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="日期" v-if="!select">
        <a-date-picker
          :inputReadOnly="true"
          v-model:value="formfields.date"
        ></a-date-picker>
      </a-form-item>
      <a-form-item v-if="!checked" label="座位号" :wrapperCol="{ span: 10 }">
        <a-input
          v-model:value="formfields.seatNum"
          placeholder="可选值1-123"
        ></a-input>
      </a-form-item>
      <a-form-item label="开始时间">
        <a-time-picker
          v-model:value="formfields.startTime"
          :inputReadOnly="true"
        ></a-time-picker>
      </a-form-item>
      <a-form-item label="结束时间">
        <a-time-picker
          v-model:value="formfields.endTime"
          :inputReadOnly="true"
        ></a-time-picker>
      </a-form-item>
    </a-form>
    <div class="card" v-if="checked">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="i in 6" :key="i" :tab="`自然科学区${i}`">
          <div class="seat-item">
            <i
              class="custom-icon custom-icon-Armchair"
              v-for="index in 100"
              :key="index"
              :style="{ color: genColor() }"
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
        <span>座位ID:12345678</span>
        <i class="custom-icon custom-icon-qrcode"></i>
      </div>
      <div class="seat-body">
        <a-row>
          <a-col :span="7">座位状态:</a-col>
          <a-col class="use-status"><span>使用中</span><span></span></a-col>
        </a-row>
        <a-row>
          <a-col :span="7">使用者昵称:</a-col>
          <a-col class="nickname">哭泣De火彩盒</a-col>
        </a-row>
        <a-row>
          <a-col :span="7">已预约时间:</a-col>
          <a-col class="already"
            ><span>点此查看</span
            ><i class="custom-icon custom-icon-Magnifiercontrol"></i
          ></a-col>
        </a-row>
      </div>
      <div class="seat-foot">
        <a-button
          type="dashed"
          size="large"
          :loading="loading"
          @click="appointment"
        >
          预约
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import moment from "moment";
import { notification } from "ant-design-vue";

export default defineComponent({
  name: "Select",
  setup() {
    const activeKey = ref(1);
    const col = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const formfields = reactive({
      floor: 1,
      area: "a",
      date: moment("2022-07-23", "YY-MM-DD"),
      startTime: moment("08:00:00", "HH:mm:ss"),
      endTime: moment("09:00:00", "HH:mm:ss"),
      seatNum: 3,
    });
    return {
      formfields,
      col,
      activeKey,
    };
  },
  data() {
    return {
      select: true,
      checked: false,
      loading: false,
    };
  },
  methods: {
    appointment() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        notification["success"]({
          message: "预约成功!",
          description: "可在预约中心查看详情。",
        });
      }, 1000);
    },
    genColor() {
      return ["rgb(255,0,0)", "rgb(68,170,230)", "rgb(51,224,51)"][
        parseInt(Math.random() * 3)
      ];
    },
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
            background-color: red;
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
        .custom-icon {
          font-size: 16px;
          margin: 5px;
        }
      }
    }
  }
}
</style>