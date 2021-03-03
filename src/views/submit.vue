<template>
  <div id="all">
    <index-header />
    <div id="container">
      <div id="title">{{ aspirName }}</div>
      <div id="banner">作业详情</div>
      <div class="detail" v-for="item in work" :key="item.workId">
        <div class="detail_title">{{ item.workName }}</div>
        <div class="detail_content">{{ item.workContent }}</div>
        <div class="detail_bottom">
          <div class="bottom_left">
            <el-button type="primary" @click="showMyWork(item.workId)"
              >查看我的作业</el-button
            >
            <el-upload
              class="upload-demo"
              action
              :auto-upload="false"
              :on-success="successed"
              :on-change="changeFile"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- <upload></upload> -->
          </div>
          <div class="bottom_right">
            <span>发布日期:{{ item.createTime || item.updateTime }}</span>
            <span>截止日期:{{ item.deadline || "无限制" }}</span>
          </div>
        </div>
      </div>
    </div>
    <index-footer />
    <div class="show_my" v-if="showmy" @click="changeStatus">
      <div class="show_my_container" @click.stop>
        <div class="show_my_container_title">我的作业</div>
        <div class="work_item" v-for="item in myWork" :key="item.swork_id">
          <a :href="item.src">{{ item.swork_name }}</a>
          <el-button type="danger" @click="del(item.swork_id)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import IndexHeader from "@/components/indexHeader";
import IndexFooter from "@/components/indexFooter";
import { showWork, showMyWork, delMyWork } from "@/network/submitPage.js";
// import upload from "@/components/upload1";
import SparkMD5 from "spark-md5";
import axios from "axios";
import { fileParse } from "@/network/fileParse.js";
// import qs from 'qs'; //将数据转化为x-www-form-encode

export default {
  components: {
    IndexHeader,
    IndexFooter,
    // upload,
  },
  filters: {
    btnText(btn) {
      return btn ? "继续" : "暂停";
    },
    totalText(total) {
      return total > 100 ? 100 : total;
    },
  },
  data() {
    return {
      total: 0,
      btn: false,
      partCount: 0,
      size: 0,
      aspirId: this.$route.query.aspirId,
      aspirName: this.$route.query.aspirName,
      showmy: false, //用于控制是否显示我的作业板块
      work: [
        {
          workId: "1",
          workName: "JS基础",
          workContent:
            "JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础JS基础",
          deadline: "xxx",
          updateTime: "xxxx",
        },
      ],
      myWork: [
        {
          src: "172.22.4.2/hihi",
          swork_id: "201921",
          swork_name: "作业1",
        },
        {
          src: "172.22.4.2/hihi",
          swork_id: "201922",
          swork_name: "xxxxxxx",
        },
      ],
    };
  },

  activated() {
    // console.log(this.aspirId)
    //获取所有作业
    this.aspirId = this.$route.query.aspirId;
    (this.aspirName = this.$route.query.aspirName),
      showWork(this.aspirId).then((res) => {
        if (res.data.code) {
          let data = res.data.data;
          data.map((item) => {
            if (Object.prototype.hasOwnProperty.call(item, "updateTime")) {
              item.updateTime = item.updateTime.slice(0, 10);
            }
            if (Object.prototype.hasOwnProperty.call(item, "deadline")) {
              item.deadline = item.deadline.slice(0, 10);
            }
            if (Object.prototype.hasOwnProperty.call(item, "createTime")) {
              item.createTime = item.createTime.slice(0, 10);
            }
          });
          this.work = data;
        } else {
          this.$message({
            message: "出错啦~！",
            type: "warning",
          });
        }
      });
  },

  methods: {
    //控制是否显示我的作业
    changeStatus() {
      this.showmy = !this.showmy;
    },
    showMyWork(id) {
      this.showmy = true;
      let data = {
        workId: id,
        stuId: sessionStorage.getItem("stuId"),
        aspirId: this.aspirId,
      };
      console.log(data);
      showMyWork(data).then((res) => {
        console.log(res);
      });
    },
    del(id) {
      delMyWork(id).then((res) => {
        console.log(res);
      });
      console.log(id);
    },
    




     handleBtn() {
      if (this.btn) {
        //断点续传
        this.btn = false;
        this.abort = true;
        // this.sendRequest();
      }
      this.btn = true;
      this.abort = false;
    },

    successed() {},

    async changeFile(file) {
      if (!file) return;

      file = file.raw;
      this.size = file.size;
      console.log(file.size);

      //解析为buffer数据
      let buffer = await fileParse(file, "buffer");
      let spark = new SparkMD5.ArrayBuffer(), //创建实例，生成hash
        hash,
        suffix; //获取文件后缀
      spark.append(buffer); //通过文件内容生成hash，相同文件生成相同hash
      hash = spark.end(); //拿到hash
      suffix = /\.([0-9a-zA-Z]+)$/i.exec(file.name)[1]; //得到文件后缀名

      //创建切片
      let partList = [],
        partsize = 40000, //固定每个切片大小
        cur = 0;
      this.partCount = Math.ceil(file.size / partsize);

      for (let i = 0; i < this.partCount; i++) {
        let item = {
          file: file.slice(
            cur,
            cur + partsize > file.zise ? file.size : cur + partsize
          ),
          // name: `${hash}_${i}.${suffix}`,
          name: `${hash}.${suffix}`,
        };
        item.size = item.file.size;
        console.log(item);
        cur += partsize;
        partList.push(item);
      }

      this.partList = partList;
      this.hash = hash;
      this.suffix = suffix;
      this.sendRequest();
    },

    async sendRequest() {
      let requestList = [];
      this.partList.forEach((item, index) => {
        //每一个fn都是发送一个切片请求
        let fn = () => {
          let formData = new FormData();
          formData.append("file", item.file);
          formData.append("name", item.name);
          formData.append("size", Number(item.size)); //每个分片大小
          formData.append("chunk", index); //当前分片
          formData.append("chunks", this.partCount); //分片总数
          formData.append("allSize", this.size);

          return axios
            .post("/stu/uploadFile", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((result) => {
              if (result.code == 0) {
                this.total += 1;
                //传完的切片移除掉
                this.partList.splice(index, 1);
              }
            });
        };
        requestList.push(fn);
      });

      //传递 串行发送
      let i = 0;
      let complete = async () => {
        let formData = new FormData();
        formData.append("wordId", 1);
        formData.append("stuId", 2019210932);
        formData.append("aspirId", 1);
        formData.append("fileName", `${this.hash}.${this.suffix}`);

        let result = await axios
          .post("/stu/mergingChunks", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            if (res.data.code == 1) {
              this.$message({
                message: "上传成功！",
                type: "success",
              });
            }
          });
        result = result.data;
        console.log(result);
      };
      let send = async () => {
        if (this.abort) return;
        if (i >= requestList.length) {
          //都传完了
          complete();
          return;
        }
        await requestList[i](); //将当前切片上传
        i++;
        send();
      };
      send();
    },
  },
};
</script>
 
<style scoped>
#all {
  background: url("../assets/img/bg.jpg") center top no-repeat fixed;
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  /* z-index: -10; */
}
#all::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  /* z-index: -8; */
}
#container {
  position: relative;
  z-index: 10;
  width: 650px;
  margin: 0 auto;
  background-color: rgba(95, 93, 93, 0.8);
  border-radius: 10px;
  margin-top: 50px;
  padding: 30px;
  color: white;
  min-height: 70vh;
}

#title {
  font-size: 25px;
  font-weight: 600;
  padding: 10px 0;
}
#banner {
  padding: 10px 0;
}
.detail {
  border: 2px solid rgb(197, 196, 196);
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.detail_title {
  font-size: 20px;
  font-weight: 550;
  padding: 8px 0;
}
.detail_content {
  padding: 10px 0;
}
.detail_bottom {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  color: rgb(189, 185, 185);
  font-size: 14px;
  padding: 10px 0;
}
.bottom_right,
.bottom_left {
  display: flex;
}

.bottom_right > span {
  padding: 5px;
  font-size: 10px;
}
/**element-ui样式修改 */
.el-button--primary {
  padding: 9px 15px;
  font-size: 12px;
  margin-right: 20px;
  height: 36px;
}
.show_my {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(185, 184, 184, 0.6);
  top: 0;
  left: 0;
  z-index: 1000;
}

.show_my_container {
  margin: 0 auto;
  margin-top: 50px;
  width: 50vw;
  min-width: 400px;
  height: 70vh;
  background-color: white;
  border-radius: 8px;
  border: 2px solid rgb(221, 218, 218);
  padding: 10px;
}

.show_my_container_title {
  text-align: center;
  font-size: 20px;
  padding: 8px 0;
  font-weight: 600;
  border-bottom: 1px solid rgb(201, 197, 197);
}

.work_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 0;
  border-bottom: 1px solid rgb(201, 197, 197);
}
</style>