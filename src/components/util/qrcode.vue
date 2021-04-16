<template>
  <div class="u-scancode" ref="scan">
    <a-modal
      v-model:visible="modalShow"
      title="扫码"
      :centered="true"
      :getContainer="() => $refs.scan"
      :closable="false"
      :footer="null"
      :forceRender="true"
      @cancel="hide"
    >
      <p>{{ code }}</p>
      <canvas ref="canvas"></canvas>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import jsQR from "jsqr";

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
      tracks: undefined,
      video: null,
      frame: undefined,
      code: "",
    };
  },
  watch: {
    visible: function (nval) {
      this.modalShow = nval;
      if (nval === true) {
        this.gerCamera();
      }
    },
  },
  methods: {
    hide() {
      this.$emit("hideModal");
      this.tracks[0].stop();
      cancelAnimationFrame(this.frame);
    },
    gerCamera() {
      this.video = this.video ? this.video : document.createElement("video");
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          this.tracks = stream.getTracks();
          this.video.srcObject = stream;
          this.video.play();
          this.drawPicture();
        })
        .catch((e) => alert(e));
    },
    drawPicture() {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        let height = this.video.videoHeight;
        let width = this.video.videoWidth;
        let render = this.$refs.canvas.getContext("2d");
        this.$refs.canvas.height = height;
        this.$refs.canvas.width = width;
        render.drawImage(this.video, 0, 0, width, height);
        let imageData = render.getImageData(0, 0, width, height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          this.code = code.data;
          setTimeout(() => {
            this.hide();
          }, 2000);
        } else {
          this.code = "no data";
        }
      }
      this.frame = requestAnimationFrame(this.drawPicture);
    },
  },
});
</script>

<style lang="less">
.u-scancode {
  canvas {
    width: 100%;
  }
}
</style>