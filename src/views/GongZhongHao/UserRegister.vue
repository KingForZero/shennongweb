<template>
  <div>
    <div style="text-align: center;margin-bottom:8%">
      <img style="width:62%" :src="logoUrl"/>
    </div>
    <div class="van-address-edit">
      <div class="van-address-edit__fields">
          <van-field v-model="loginForm.name" required clearable label="姓名" placeholder="请输入姓名"/>
          <div class="van-cell van-cell--required van-field">
            <div class="van-cell__title van-field__label">
              <span>性别</span>
            </div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <van-radio-group v-model="loginForm.sex" style="display: flex">
                  <van-radio name="0">男</van-radio>
                  <van-radio name="1" style="margin-left: 20px">女</van-radio>
                </van-radio-group>
              </div>
            </div>
          </div>
          <van-field v-model="loginForm.age" required clearable label="年龄" type="number" placeholder="请输入年龄"/>
          <van-field v-model="loginForm.height" required clearable label="身高cm" type="number" placeholder="请输入身高"/>
          <van-field v-model="loginForm.weight" required clearable label="体重kg" type="number" placeholder="请输入体重"/>
          <van-field v-model="loginForm.tel" required clearable  label="手机号" type="tel" placeholder="请输入手机号"/>
          <van-field v-model="loginForm.code" type="number" required clearable label="短信验证码" placeholder="请输入短信验证码">
            <van-button slot="button" v-show="sendAuthCode" size="small" @click="getAuthCode" type="primary">发送验证码</van-button>
            <van-button slot="button" v-show="!sendAuthCode" size="small" type="primary">{{auth_time}} 秒</van-button>
          </van-field>
        <div class="van-address-edit__buttons">
          <button class="van-button  van-button--normal van-button--primary van-button--block van-button--round" @click="tijiao">
            <span class="van-button__text">提交</span>
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>

import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
import { Toast } from 'vant';
import Cookies from "js-cookie"
import wx from 'weixin-js-sdk';
import { Dialog } from 'vant';
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
      logoUrl:require("../../assets/logo_kitty_blue.png"),
      loading: false,
      loginForm: {
        name: '',
        sex:'',
        age:'',
        tel:'',
        openId:'',
        code:'',
        fromId:''
      },
      //跳转地址
      rePath:'',
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
                Toast("发送成功")
              }else{
                Toast("发送失败")
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

    tijiao() {
      if(!this.loginForm.name){
        Toast('请输入姓名')
        return
      }
      if(!this.loginForm.sex){
        Toast('请选择性别')
        return
      }
      if(!this.loginForm.age){
        Toast('请输入年龄')
        return
      }
      if(!this.loginForm.height){
        Toast('请输入身高')
        return
      }
      if(!this.loginForm.weight){
        Toast('请输入体重')
        return
      }
      if(!this.loginForm.tel){
        Toast('请输入手机号')
        return
      }
      if(!this.loginForm.code){
        Toast('请输入验证码')
        return
      }
        this.loginForm.state = Cookies.get("state")
        this.$api.user.cliengUser(this.loginForm).then((res) => {
          if(res.code == 200) {
            Dialog.alert({
              message: "注册成功"
            }).then(() => {
              // on close
              let url = window.location.href+"/"
              this.$api.gongZhongHao.getJsSdk({"url":url,state:Cookies.get("state")}).then((res) => {
                if(res.code == 200) {
                  this.wxshare(res.rows)
                }else{
                  Dialog.alert({
                    message: res.rows.msg
                  }).then(() => {
                    // on close
                  });
                }
              })
            });

          } else {
            Toast(res.msg)
          }
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        })
    },
    wxshare(data) {
      var appId = data.appId;
      var timestamp = data.timestamp;
      var nonceStr = data.nonceStr;
      var signature = data.signature;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: ['closeWindow']
      });
      wx.error(function(res){
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
      wx.ready(function() {
        wx.checkJsApi({
          jsApiList : ['closeWindow'],
          success : function(res) {
            console.log("closeWindow成功")
          }
        });
        //退出微信浏览器
        wx.closeWindow();
      });

    },
    fanhui() {
      this.$router.push("/login")
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  },
  mounted() {
    this.rePath = this.$route.query.rePath || ''
    let openId = this.$route.query.openId || Cookies.get("openId")
    let fromId = this.$route.query.fromId || Cookies.get("fromId")
    let state = this.$route.query.state || Cookies.get("state")
    Cookies.set("state",state)
    if(fromId){
      this.loginForm.fromId = fromId
    }
    if(openId){

    }else{
      //用户点击按钮跳转过来的
      let code = this.$route.query.code
      if(code){
        this.$api.assistant.getOpenId({code:code}).then((res) => {
          if(res.code == '200'){
            openId = res.rows
          }else{
            Toast(res.msg)
          }
        })
      }
    }
    if(openId){
      this.loginForm.openId = openId
      Cookies.set('openId', openId)
    }





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
