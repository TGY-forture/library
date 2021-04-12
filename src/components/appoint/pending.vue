<template>
  <div class="u-pending">
    <ul>
      <li v-for="i in 2" :key="i">
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
        <a-row>
          <a-col :span="24">
            <a-button type="primary" @click="hitCard">签到</a-button>
            <a-button type="dashed">签退</a-button>
            <a-popconfirm title="确定取消吗?" cancelText="No" okText="Ok">
              <template #icon>
                <question-circle-outlined style="color: red" />
              </template>
              <a-button type="danger">取消</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </li>
    </ul>
    <Scan :visible="visible" @hideModal="visible = false" />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import Scan from "../util/qrcode.vue";

export default defineComponent({
  name: "pending",
  components: {
    QuestionCircleOutlined,
    Scan,
  },
  setup() {
    let visible = ref(false);
    const hitCard = () => {
      visible.value = true;
    };
    return {
      visible,
      hitCard,
    };
  },
});
</script>

<style lang="less">
.u-pending {
  ul > li {
    padding: 10px;
    border-left: 4px solid rgba(20, 150, 236, 0.74);
    margin-bottom: 10px;
    .ant-row {
      margin-top: 8px;
      &:nth-child(4) {
        .ant-col {
          text-align: center;
          .ant-btn-dashed {
            margin: 0 20px;
          }
        }
      }
    }
  }
}
</style>