<template>
  <div class="u-appoint">
    <div style="text-align: center; margin-bottom: 20px">
      <a-radio-group v-model:value="mode">
        <a-radio-button :value="true">已预约</a-radio-button>
        <a-radio-button :value="false">历史记录</a-radio-button>
      </a-radio-group>
    </div>
    <Pending v-if="mode" />
    <History v-else />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Pending from "./pending.vue";
import History from "./history.vue";

export default defineComponent({
  name: "Appoint",
  components: {
    Pending,
    History,
  },
  setup() {
    let mode = ref(true);
    return {
      mode,
    };
  },
});
</script>

<style lang="less">
</style>