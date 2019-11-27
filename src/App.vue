<template>
  <section class="ad-img-mg">
    <div class="ad-img-main">
      <p class="ad-tips-p">使用说明：</p>
      <p class="ad-tips-p">
        选择图片，拖动或缩放至合适大小，图片列表可顺序拖动更换。
      </p>

      <upload-img
        :max_size="device_info.size"
        :img_width="device_info.width"
        :img_height="device_info.height"
        :img_list="img_list"
        @uploadImg="uploadImg"
        @removeImg="removeImg"
      ></upload-img>
    </div>
  </section>
</template>

<script>
import uploadImg from "@/components/MyUploadImg";
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "imgUpload",
  data() {
    return {
      device_info: {
        size: 5,
        width: 400, 
        height: 400
      }
    };
  },
  methods: {
    ...mapActions(['addImg', 'removeImg']),
    uploadImg(form_data) {
      this.addImg(form_data)
    },
    removeImg(options) {
      this.removeImg(options)
    }
  },
  computed: {
    ...mapGetters(['img_list'])
  },
  components: { uploadImg }
};
</script>

<style scoped>
.ad-img-mg {
  min-width: 400px;
  padding: 10px 0;
  padding-left: 20px;
}
.ad-img-main {
  /* height: calc(100vh - 250px); */
  overflow: auto;
}
.ad-tips {
  font-size: 14px;
  color: #d63939;
  margin-bottom: 20px;
}
.ad-tips-p {
  font-size: 12px;
  color: #868383;
  margin: 5px 0;
}
.ad-img-btn {
  margin-top: 10px;
}
</style>
