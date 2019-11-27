<template>
  <div class="img-list">
    <draggable :list="img_list" :options="{group: draggable_group_name}">
      <div class="upload-img-box" v-for="(file, index) in img_list" :key="index">
        <img class="upload-img" :src="file[url]" alt />
        <span class="upload-icons">
          <div>
            <span class="upload-icons-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="upload-icons-delete" @click="handleRemove(file, index)">
              <i class="el-icon-delete"></i>
            </span>
          </div>
          <div class="upload-cover" v-if="has_cover">
            <el-button
              type="primary"
              :disabled="!!file.is_cover"
              size="mini"
              @click="setCover(file, index)"
            >{{!!file.is_cover ? '当前封面' : '设为封面'}}</el-button>
          </div>
        </span>
      </div>
    </draggable>
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <img width="100%" :src="preview_src" alt />
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "myUploadImgList",

  props: {
    img_list: {
      type: Array,
      required: true
    },
    // 是否需要设为封面
    has_cover: {
      type: Boolean,
      default: false
    },
    // 图片对象的默认URL名称
    url: {
      type: String,
      default: "url"
    },
    draggable_group_name: String
  },
  data() {
    return {
      disabled: false,
      preview_src: "",
      dialogVisible: false,
      dragover: false
    };
  },
  methods: {
    onDrop() {},
    onDragover() {},
    handlePictureCardPreview(file) {
      this.preview_src = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, idx) {
      this.$confirm("您确定删除此图片么，删除后无法恢复！", {
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.$emit("removeImg", { file, idx });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    setCover(file, idx) {
      this.$confirm("您确定要设置该图片为封面吗！", {
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.$emit("setCover", { file, idx });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  },
  components: { draggable }
};
</script>
<style scoped>
.upload-img-box {
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
  position: relative;
}
.upload-img-box:hover > .upload-icons {
  opacity: 1;
}
.upload-img {
  width: 100%;
  height: 100%;
}
.upload-icons {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload-cover {
  margin-top: 10px;
}
</style>