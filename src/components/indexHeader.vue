<template>
  <div id="headerAll">
    <div id="header">
      <div id="header-left">Mis-Lab</div>
      <div id="header-right">
        <span><a href="#">关于我们</a></span>
        <span><a href="#">加入我们</a></span>
        <span v-if="stuName">
          <span class="iconfont icon-profile-copy"></span>
          <span>个人中心</span>
          <span @click="signOut" id="sighOut">注销</span>
        </span>
        <span v-else @click="login"> 登录 </span>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      stuName: sessionStorage.getItem("stuName"),
    };
  },
  activated() {
      this.stuName = sessionStorage.getItem("stuName");
  },
  methods: {
    login() {
      this.$router.push({ path: "/login" });
    },
    signOut() {
      sessionStorage.removeItem("stuName");
      sessionStorage.removeItem("stuId");
      sessionStorage.removeItem("major");
      this.$confirm('您确定退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$router.push({ path: "/login" });
        }).catch(() => {});
    },
  },
};
</script>
 
<style scoped>
@import "~@/assets/css/frofile/iconfont.css";
#headerAll {
  width: 100vw;
  height: 90px;
}
#header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  padding: 20px 50px;
  width: calc(100% - 100px);
  background-color: black;
  color: white;
  z-index: 100;
  min-width: 640px;
}
#header-left {
  font-size: 50px;
  font-weight: 550;
  letter-spacing: 3px;
  padding-left: 10px;
  /* color:#555555; */
}
#header-right {
  line-height: 50px;
}
#header-right > span {
  padding: 0 20px;
  cursor: pointer;
}
a {
  text-decoration: none;
  color: white;
}
#sighOut{
  padding: 0 20px;
}
</style>