<template>
  <div class="wrapper">
    <div class="particles-wrapper">
      <vue-particles
        class="item"
        color="#409EFF"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="5"
        linesColor="#409EFF"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="3"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
    <div class="back-icon-wrapper">
      <el-button
        icon="el-icon-arrow-left"
        class="back-icon"
        circle
        @click="back"
      ></el-button>
    </div>
    <div class="change-icon-wrapper">
      <el-button round class="change-icon" @click="changeStatus" v-if="isLogin"
        >跳转到注册</el-button
      >
      <el-button round class="change-icon" @click="changeStatus" v-else
        >跳转到登录</el-button
      >
    </div>
    <div class="container">
      <div
        v-bind:class="{ leave: isLogin, enter: !isLogin }"
        class="from-wrapper"
      >
        <el-form
          ref="registerForm"
          :rules="fromRules.registerRules"
          label-width="70px"
          :model="formLabelAlignRegister"
        >
          <el-form-item label="姓名" prop="stuName">
            <el-input v-model="formLabelAlignRegister.stuName"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="stuId">
            <el-input v-model="formLabelAlignRegister.stuId"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="stuSex">
            <el-input v-model="formLabelAlignRegister.stuSex"></el-input>
          </el-form-item>
          <el-form-item label="年级" prop="stuGrade">
            <el-input v-model="formLabelAlignRegister.stuGrade"></el-input>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="formLabelAlignRegister.major"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="formLabelAlignRegister.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              :show-password="true"
              type="password"
              v-model="formLabelAlignRegister.password"
            ></el-input>
          </el-form-item>
          <el-form-item label="方向" prop="aspireId">
            <el-checkbox-group v-model="formLabelAlignRegister.aspireId">
              <el-checkbox label="前端" name="1"></el-checkbox>
              <el-checkbox label="java后端" name="2"></el-checkbox>
              <el-checkbox label="安卓" name="3"></el-checkbox>
              <el-checkbox label="机器学习" name="4"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button round class="submit-buttom" @click="register"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div
      v-bind:class="{ enter: isLogin, leave: !isLogin }"
      class="from-wrapper back"
    >
      <el-form
        ref="loginForm"
        label-width="70px"
        :model="formLabelAlignLogin"
        :rules="fromRules.LoginRules"
      >
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="formLabelAlignLogin.stuId"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            :show-password="true"
            type="password"
            v-model="formLabelAlignLogin.pwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" round class="submit-buttom">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login} from "@/network/login.js"
import {register} from "@/network/register.js"

export default {
  data () {
    return {
      codeSrc: '',
      isLogin: true,
      formLabelAlignLogin: {
        stuId: '',
        pwd: ''
      },
      formLabelAlignRegister: {
        stuId: '',
        password: '',
        stuName: '',
        stuSex:'',
        stuGrade:'',
        phone: '',
        major: '',
        aspireId:[]
      },
      fromRules: {
        registerRules: {
          stuName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          // stuSex:[
          //  { required: true, message: '请输入用户名', trigger: 'blur' },
          // ],
          // stuGrade:[
          //   { required: true, message: '请输入年级', trigger: 'blur' },
          // ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20 个字符',
              trigger: 'blur'
            }
          ],
          stuId: [
            { required: true, message: '请输入学号', trigger: 'blur' },
            {
              min: 10,
              max: 10,
              message: '长度为10个字符',
              trigger: 'blur'
            }
          ],
          // phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
          aspire_id: [
            {
              required: true,
              message: '请至少选择一个技术方向',
              trigger: 'change'
            }
          ],
          major: [{ required: true, message: '请输入专业', trigger: 'change' }]
        },
        LoginRules: {
          stuId: [
            { required: true, message: '请输入学号', trigger: 'blur' },
            {
              min: 5,
              max: 15,
              message: '长度在 5 到 15 个字符',
              trigger: 'blur'
            }
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {
              min: 5,
              max: 20,
              message: '长度在 5 到 20 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/index' })
    },
    changeStatus () {
      this.isLogin = !this.isLogin
    },
    register () {  
      this.formLabelAlignRegister.aspireId = this.formLabelAlignRegister.aspireId.map(
        item => {
          if (item === '前端') {
            return 1
          } else if (item === 'java后端') {
            return 2
          } else if (item === '安卓') {
            return 3
          }
        }
      )
      console.log(this.formLabelAlignRegister)
      register(this.formLabelAlignRegister)
      .then(res=>{
        console.log(res)
      })


    },
    login () {
      console.log(this.formLabelAlignLogin);

     login(this.formLabelAlignLogin)
     .then(res=>{
      if(res.data.code==1){
      sessionStorage.setItem("stuName", res.data.data.stuName);
      sessionStorage.setItem("stuId",res.data.data.stuId);
      sessionStorage.setItem("major",res.data.data.major);
        this.$router.push({ path: "/index" });
      }
     })

    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/stylus/common.styl';

.wrapper {
  width: 100% ;
  height 130vh
  overflow: hidden;
  transition: 1s;
  background: rgb(244, 244, 245);

  @media screen and (max-width: $view-small) {
    height: 150vh;
  }

  .particles-wrapper {
    width: 100%;
    height: 100%;
    float: left;
  }

  .back-icon-wrapper {
    position: absolute;

    .back-icon {
      color: #409EFF;
      border-color: #409EFF;
      background: white;
      margin: 30px;
      transition: 1s;
    }

    .back-icon:hover {
      background: rgb(140, 197, 255);
    }
  }

  .change-icon-wrapper {
    position: absolute;
    right: 0;

    .change-icon {
      color: #409EFF;
      background: white;
      border-color: #409EFF;
      margin: 30px;
      transition: 1s;
    }

    .change-icon:hover {
      background: rgb(140, 197, 255);
    }
  }

  .from-wrapper {
    background white
    z-index: 999;
    position: absolute;
    padding: 30px 30px 0px 10px;
    width: 450px;
    backface-visibility: hidden;
    top: 10%;
    left: 0;
    padding: auto 0;
    right: 0;
    margin: auto;
    transition: 2s;
    background: white;
    box-shadow: 1px;
    border-radius: 10px;
    margin-top: 50px;

    @media screen and (max-width: $view-small) {
      width: 80%;
      top: 100px;
    }

    .submit-buttom {
      height: 100%;
      width: 100%;
      color: black;
      transition: 1s;
      font-size: 15px;
    }
  }
}

.back {
  position: relative;
  transform: rotateY(-180deg);
}

.leave {
  transform: rotateY(-180deg);
}

.enter {
  transform: rotateY(-360deg);
}

.code-img {
  float: left;
  width: 120px;
  height: 50px;
}

.code-img:hover {
  cursor: pointer;
}

#particles-js {
  height: 100%;
  width: 100%;
}

.container {
  perspective: 500;
}

.el-form-item__label {
  color: white;
}
</style>
