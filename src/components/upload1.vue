<template>
  <el-upload
    class="upload-demo"
    action
    :auto-upload="false"
    :on-success="successed"
    :on-change="changeFile"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
  <!-- <div id="progress">
   <span>上传进度:{{ total | partCount }}%</span> 
    <el-link
      type="primary"
      v-if="total >= 0 && total < 100"
      @click="handleBtn"
      >{{ btn | btnText }}</el-link
    > 
 </div>  -->
</template>
 
<script>
import { fileParse } from "@/network/fileParse.js";

//生成hash
import SparkMD5 from "spark-md5";
import axios from "axios";
// import qs from 'qs'; //将数据转化为x-www-form-encode

export default {
  data() {
    return {
      total: 0,
      btn: false,
      partCount: 0,
      size: 0,
      //file:''
    };
  },
  filters: {
    btnText(btn) {
      return btn ? "继续" : "暂停";
    },
    totalText(total) {
      return total > 100 ? 100 : total;
    },
  },
  methods: {
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
#container {
  text-align: center;
  padding: 20px;
  display: flex;
  width: ;
}
#progress {
  padding: 9px 15px;
  font-size: 12px;
}
#progress > span {
  padding-right: 9px;
}
</style>