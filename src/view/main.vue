<template>
  <div class="top">
    <i class="custom-icon custom-icon-Library"></i>
    <span>图书馆选座系统</span>
  </div>
  <transition name="myscale" mode="out-in">
    <Log v-if="showlog" @showComponent="showlog = false" />
    <Sign v-else @showComponent="showlog = true" />
  </transition>
  <div class="github-link">
    <i class="custom-icon custom-icon-github"></i>
    <p>
      <i class="custom-icon custom-icon-copyright"></i>
      <span>CopyRight TGY 2021</span>
    </p>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Log from "../components/log/log.vue";
import Sign from "../components/log/sign.vue";

export default defineComponent({
  name: "home",
  setup() {
    const cmp = ref("Log");
    let showlog = ref(true);
    return {
      cmp,
      showlog,
    };
  },
  components: {
    Sign,
    Log,
  },
});
</script>

<style lang="less">
/* 可以设置不同的进入和离开动画   */
/* 设置持续时间和动画函数        */
.myscale-enter-active {
  transition: all 0.3s ease-out;
}
.myscale-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.myscale-enter-from,
.myscale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
.top {
  text-align: center;
  padding-top: 10px;
  .custom-icon {
    font-size: 40px;
    vertical-align: middle;
  }
  span {
    font-size: 20px;
    vertical-align: middle;
    margin: 10px;
  }
}
.github-link {
  text-align: center;
  .custom-icon-github {
    font-size: 40px;
  }
  p {
    margin-top: 40px;
    i {
      vertical-align: middle;
      margin-right: 5px;
    }
    span {
      vertical-align: middle;
      color: grey;
      font-size: 12px;
    }
  }
}
</style>