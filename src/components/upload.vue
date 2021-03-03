<template>
  <div id="container">
    <el-upload
      class="upload-demo"
      action
      :auto-upload="false"
      :on-success="successed"
      :on-change="changeFile"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div id="progress">
      <span>上传进度:{{ total | totalText }}%</span>
      <el-link
        type="primary"
        v-if="total >= 0 && total < 100"
        @click="handleBtn"
        >{{ btn | btnText }}</el-link
      >
    </div>
  </div>
</template>
 
<script>
import { fileParse } from "@/network/fileParse.js";

//生成hash
import SparkMD5 from "spark-md5";
import axios from 'axios'
// import qs from 'qs'; //将数据转化为x-www-form-encode

export default {
  data() {
    return {
      total: 0,
      btn: false,
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
        if(this.btn){
            //断点续传
            this.btn = false;
            this.abort = true;
            // this.sendRequest();
            return;
        }
      this.btn = true;
      this.abort = false;  
    },
    successed() {},
    async changeFile(file) {
      if (!file) return;
      
      file = file.raw;
      // console.log("file-----"+file)
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
        
        partsize = file.size / 100, //将文件分为100份
        cur = 0;

      for (let i = 0; i < 100; i++) {
        let item = {
          file: file.slice(cur, cur + partsize),
          name: `${hash}_${i}.${suffix}`,
          zise:partsize
        };
        console.log(item.file)
        cur += partsize;
        partList.push(item);
      }
      this.partList = partList;
      this.hash = hash;
      this.sendRequest();
      this.size = file.size;
      console.log( typeof file.size)
    },

    async sendRequest() {
      //根据100个切片创建100个请求（集合）
      let requestList = [];
      this.partList.forEach((item, index) => {

        //每一个fn都是发送一个切片请求
        let fn = () => {
          let formData = new FormData();
          formData.append("file", item.file);
          formData.append("name", item.name);
          formData.append("size",Number(94728));//每个分片大小
          formData.append("chunk",index)     //当前分片
          formData.append("chunks",100)   //分片总数

          return axios.post('/stu/uploadFile',formData,{
              headers:{"Content-Type":"multipart/form-data"}
          }).then(result=>{
              if(result.code==0){
                  this.total+=1;
                  //传完的切片移除掉
                  this.partList.splice(index,1)
              }
          })
        };
        requestList.push(fn);
      });

      //传递 并行/串行
      let i = 0;
      let complete = async()=>{
          let result = await axios.post('/stu/mergingChunks',{
              data:{
                  name:this.hash,
                  size:Number(this.size),
                  chunks:100,
              }
          });
          result = result.data;
          console.log(result)
      };
      let send =async ()=>{
          if(this.abort) return;
         if(i>=requestList.length){
             //都传完了
             complete();
             return;
         }
         await requestList[i](); //将当前切片上传
         i++;
         send();
      }
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
}
#progress{
  padding:9px 15px;
  font-size: 12px;
}
#progress>span{
  padding-right:9px;
}
</style>