<template>
  <div id="content" @click="inter">
    <div v-if="aspir.aspirName=='前端'"><span class="iconfont icon-qianduan"></span></div> 
    <div v-else-if="aspir.aspirName=='后端'"><span class="iconfont icon-java"></span></div> 
    <div v-else><span class="iconfont icon-anzhuo-copy"></span></div> 
    <div>
      <div id="aspirName">{{ aspir.aspirName }}</div>
      <div id="intro">
        <div>课程码:{{ aspir.aspirId }}</div>
        <div id="createTime">创课时间:{{ aspir.createTime }}</div>
      </div>
    </div>
  </div>
</template>
 
<script>

export default {
  props: {
    aspir: {
      type: Object,
      default() {
        return {
          aspirId: 1,
          aspirName: "前端",
          aspirCount: 1,
          createTime: "2020-11-7",
        };
      },
    },
  },
  methods: {
    inter() {
      console.log(this.aspir.aspirId);
      this.$router.push({
        path: "/submit",
        query: {
          aspirId: this.aspir.aspirId,
          aspirName: this.aspir.aspirName,
        },
      });
    },
  },
};
</script>
 
<style scoped>
@import "~@/assets/css/course_icon/iconfont.css";
#content {
  width: 250px;
  border: 2px solid white;
  display: flex;
  border-radius: 5px;
  padding: 10px;
  margin: 20px;
  margin-bottom: 20px;
  align-items: center;
  color: white;
}
#aspireName {
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  transition: 0.3s;
}

#content:hover {
  color: rgb(169, 169, 228);
  border: 2px solid  rgb(169, 169, 228);
}

#intro {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  font-size: 13px;
  line-height: 30px;
  /* color: rgb(204, 201, 201); */
}
.iconfont{
  font-size: 60px;
  padding: 0 20px;
}
</style>