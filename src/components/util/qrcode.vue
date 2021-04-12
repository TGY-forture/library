<template>
  <div class="u-scancode" ref="scan">
    <a-modal
      v-model:visible="modalShow"
      title="扫码"
      :getContainer="() => $refs.scan"
      :closable="false"
      :footer="null"
      :forceRender="true"
      @cancel="hide"
    >
      <!-- <canvas ref="canvas"></canvas> -->
      <video ref="video"></video>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { scanCode } from "@/assets/js/scan.js";

export default defineComponent({
  name: "Qrcode",
  props: {
    visible: { type: Boolean, require: true },
  },
  emit: ["hideModal"],
  setup(props) {
    let modalShow = ref(props.visible);
    return {
      modalShow,
    };
  },
  data() {
    return {
      tracks: null,
    };
  },
  watch: {
    visible: function (nval) {
      this.modalShow = nval;
      if (nval === true) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            this.tracks = stream.getTracks();
            this.$refs.video.srcObject = stream;
            this.$refs.video.play();
          })
          .catch((e) => alert(e));
      }
    },
  },
  methods: {
    hide() {
      this.$emit("hideModal");
      console.log(this.tracks[0].stop());
    },
  },
});
</script>

<style lang="less">
.u-scancode {
  video {
    width: 100%;
    // height: 200px;
  }
  #output {
    margin-top: 20px;
    background: #eee;
    padding: 10px;
    padding-bottom: 0;
    div {
      padding-bottom: 10px;
      word-wrap: break-word;
    }
  }
}
</style>