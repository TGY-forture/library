<template>
  <div class="home">
    <header class="nav">
      <a-input-search placeholder="搜索座位或用户"></a-input-search>
      <i class="custom-icon custom-icon-plus"></i>
      <img src="@/assets/img/1232381748.jpeg" alt="avatar" />
    </header>
    <div class="menu">
      <nav class="func-select" @click="to">
        <span data-index="0">座位选择</span>
        <span data-index="1">预约中心</span>
        <span data-index="2">留言消息</span>
        <span data-index="3">个人信息</span>
      </nav>
      <div class="block">
        <span ref="slider"></span>
      </div>
    </div>
    <Select />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Select from "@/components/seat/select.vue";
export default defineComponent({
  name: "Index",
  components: {
    Select,
  },
  methods: {
    to(e) {
      let num = e.target.dataset.index;
      if (num == undefined) return;
      this.$refs.slider.style.setProperty("--offset", num);
    },
  },
});
</script>

<style lang="less">
.home {
  .nav {
    display: flex;
    align-items: center;
    // position: sticky;
    // top: 10px;
    .custom-icon-plus {
      font-size: 24px;
      margin-right: 10px;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 15px;
      object-fit: cover;
      border: 2px solid #40a9ff;
    }
    .ant-input-search {
      width: 200px;
      border-radius: 16px;
      margin-right: auto;
    }
  }
  .menu {
    margin: 20px 0;
    .func-select {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }
    .block {
      position: relative;
      span {
        --offset: 0;
        display: block;
        position: absolute;
        width: 48px;
        height: 4px;
        transition: left 0.3s;
        background-color: black;
        border-radius: 2px;
        left: calc(((100% - 48 * 4px) / 3 + 48px) * var(--offset));
      }
    }
  }
}
</style>