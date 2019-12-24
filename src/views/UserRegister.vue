<template>
  <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <!-- <span class="tool-bar">
      <!-- 主题切换 
      <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
      <!-- 语言切换 -->
      <!-- <lang-selector class="lang-selector"></lang-selector>    
    </span> -->
    <img style="width:135px" :src="logoUrl"></img>
    <h2 class="title" >注册</h2>
    <el-form-item prop="tel">
      <el-input type="text" v-model="loginForm.tel" auto-complete="off" placeholder="电话"></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-col :span="18">
        <el-input type="text" v-model="loginForm.code" auto-complete="off" placeholder="验证码"></el-input>
      </el-col>
      <el-col :span="6" >
        <el-button v-show="sendAuthCode"  type="primary" @click="getAuthCode" style="width:100%">发送</el-button>
    		<el-button v-show="!sendAuthCode" type="primary" style="width:100%">{{auth_time}} 秒</el-button>
      </el-col>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="tijiao" >提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from "js-cookie"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
export default {
  name: 'Login',
  components:{
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      auth_time: 0, 
      sendAuthCode:true,
      logoUrl:require("../assets/logo_kitty_blue.png"),
      loading: false,
      loginForm: {
        tel: '',
        openId: 'oULFM0cZmGlfC5nMaQnyeuSBNWAQ',
        code:''
      },
      fieldRules: {
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getAuthCode:function () {
						this.$api.user.sendSmsCode({tel:this.loginForm.tel}).then((res) => {
              if(res.code==200){
                this.$message({ message: '发送成功', type: 'success' })
              }else{
                this.$message({ message: '发送失败'+res.msg, type: 'error' })
              }
					})
            this.sendAuthCode = false;
            this.auth_time = 60;
            var auth_timetimer =  setInterval(()=>{
                this.auth_time--;
                if(this.auth_time<=0){
                    this.sendAuthCode = true;
                    clearInterval(auth_timetimer);
                }
            }, 1000);
        },
    getCode() {
						this.$api.user.sendSmsCode({tel:this.loginForm.tel}).then((res) => {
              if(res.code == '200'){
                this.$message({ message: '发送成功', type: 'success' })
              }else{
                this.$message({ message: '失败', type: 'error' })
              }
          })
        },
    tijiao() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
        this.loading = true
        let userInfo = {tel:this.loginForm.tel, openId:this.loginForm.openId,code:this.loginForm.code}
        this.$api.user.cliengUser(userInfo).then((res) => {
          if(res.code != 200) {
            this.$message({
              message: "注册成功，您可以正常使用业务",
              type: 'error'
            })
          } else {
           this.$message({
              message: res.msg,
              type: 'success'
            })
            //this.$router.push("/login")
          }
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        })
				}
			})
      
    },
   
    fanhui() {
      this.$router.push("/login")
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  },
  created(){
    // let code = this.$route.query.code||'06167c1m1b2NUm0ddsXl1rr01m167c17'
    // this.$api.assistant.getOpenId({code:code}).then((res) => {
    //           if(res.code == '200'){
    //             this.loginForm.openId = res.rows
    //           }else{
    //             this.$message({ message: res.msg, type: 'error' })
    //           }
    //       })
  },
  mounted() {
   
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor
    })
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 80%;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>