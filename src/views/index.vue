<template>
  <div>
    <index-header />

    <div id="course">
        <div v-for="item in data" :key="item.aspireName" class="item">
            <course-item :aspir=item></course-item>
        </div>
    </div>

    <index-footer />

  </div>
</template>
 
<script>
import IndexHeader from "@/components/indexHeader";
import courseItem from "@/components/courseItem";
import IndexFooter from "@/components/indexFooter";
import {getCourse} from "@/network/getCourse.js";


export default {
  components: {
    IndexHeader,
    courseItem,
    IndexFooter
  },
  data() {
    return {
      data: [
        // {
        //   aspireId: 1,
        //   aspireName: "前端",
        //   aspireCount: 1,
        //   createTime: "2020-11-7",
        // },
      ],
    };
  },
  activated(){
    getCourse()
    .then(res=>{
      if(res.data.code===0){
        this.$message({
          message: '请先登录！',
          type: 'warning'
        });
        return;
      }
      let data = res.data.data 
      data.map(item=>{
        item.createTime = item.createTime.slice(0,10);
      });
      this.data = data ;
    })
  }

};
</script>
 
<style scoped>
#course {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 50px;
  background: url("../assets/img/bg.jpg") center top no-repeat fixed;
  background-color: rgba(0,0,0,.5);
  position: relative;
  min-height: 60vh;
}
#course::before{
  content:"";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.7); 
}
.item{
  z-index: 10;
}
</style>