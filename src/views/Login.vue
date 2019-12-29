<template>
  <el-form style="text-align: center" :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <!-- <span class="tool-bar">
      <!-- 主题切换 
      <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
      <!-- 语言切换 -->
      <!-- <lang-selector class="lang-selector"></lang-selector>   
    </span> -->
    <img style="width:135px" :src="logoUrl"></img>
    <h2 class="title" >上医林健康管理系统</h2>
    <el-form-item prop="tel">
      <el-input type="text" v-model="loginForm.tel" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item >
      <el-col>
           <router-link tag='a' :to="'/forgetPwd'" >忘记密码？</router-link>
           <a href="app/上医云.apk" download="">下载医生app</a>
            <a href="#" @click="download">下载页面</a>
      </el-col>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="loading">登 录</el-button>
      <el-button type="primary" style="width:48%;" @click="register">注 册</el-button>
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
      logoUrl:require("../assets/logo_kitty_blue.png"),
      loading: false,
      loginForm: {
        tel: '',
        password: '',
        captcha:'',
        src: '',
        currentUser:''
      },
      fieldRules: {
        tel: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // ,
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      checked: true
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {tel:this.loginForm.tel, password:this.loginForm.password}
      console.log("userInfo:"+userInfo);
      this.$api.login.login(userInfo).then((res) => {
          if(res.code != 200) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            Cookies.set('Authorization', res.rows.token) // 放置token到Cookie
            sessionStorage.setItem('user', userInfo.tel) // 保存用户到本地会话
            
            sessionStorage.setItem('employee',JSON.stringify(res.rows))
            this.currentUser = JSON.parse(sessionStorage.getItem('employee'))
            console.log(this.currentUser)
            console.log(this.currentUser.id)

            let _self=this
            // this.$imConn.listen({
            //   onTextMessage: function ( message ) {
            //     console.log(message);
            //     // alert("用户："+message.from+"发来消息，请点击聊天室选择"+message.from+"进行聊天")
            //     _self.$message({message: "用户："+message.from+"发来消息，请点击聊天室选择"+message.from+"进行聊天", type: 'success'})
            //     _self.messageData.push({data:message.from+":"+message.data})
            //     // that.chatCont.push({id: 2, cont: message.data});
            //   },
            //   //接收到表情消息
            //   onEmojiMessage: function (message) {
            //     // 当为WebIM添加了Emoji属性后，若发送的消息含WebIM.Emoji里特定的字符串，connection就会自动将
            //     // 这些字符串和其它文字按顺序组合成一个数组，每一个数组元素的结构为{type: 'emoji(或者txt)', data:''}
            //     // 当type='emoji'时，data表示表情图像的路径，当type='txt'时，data表示文本消息
            //     console.log('Emoji');
            //     var data = message.data;
            //     for(var i = 0 , l = data.length ; i < l ; i++){
            //       console.log(data[i]);
            //     }
            //   },
            //   onPresence: function ( message ) {
            //     // 这里需要弹出面板标识有人要添加您为好友
            //     console.log(message)
            //     // if(message.type == 'subscribe') {
            //     //   that.privateUser = message.from;
            //     //   that.privateUserPanel = true;
            //     // }
            //   }
            // });


            console.log("环信登录用户名："+this.currentUser.tel,+"环信登录密码::"+this.currentUser.tel)
            // 登录信息
            let options = {
              apiUrl:(location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',//不用动
              user: this.currentUser.tel,
              pwd: this.currentUser.tel,
              appKey: '1153180327253026#shangyi'
            }
            console.log('登录信息',options)
            // this.$imConn.open(options)
            // console.log('环信登录成功',options)
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/')  // 登录成功，跳转到主页
          }
          this.loading = false
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        });
    },
    register(){
      this.$router.push('/register')  // 登录成功，跳转到主页
    },
     download(){
      this.$router.push('/download')  // 登录成功，跳转到主页
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
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
    width: 484px;
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
