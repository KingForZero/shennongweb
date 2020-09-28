<template>
  <section class="van-doc-demo-section demo-field">
    <div class="van-doc-demo-block">
        <h2 class="van-doc-demo-block__title" style="display: flex;justify-content:space-between">
          <div>
            <span style="color: red">*</span>病情描述
          </div>
          <div>
            <van-button @click="muban" type="primary" size="small">使用模板</van-button>
            <van-button @click="clearmuban" type="danger" size="small" v-if="medicalRecord.extraMsg">清除内容</van-button>
          </div>
        </h2>
      <van-field
        v-model=medicalRecord.extraMsg
        rows="6"
        autosize
        type="textarea"
        placeholder="健康信息采集"
      />
    </div>
    <div class="van-doc-demo-block">
      <van-uploader preview-size="100px" v-model="fileList"  multiple style="margin-left: 16px"/>
    </div>
    <div class="van-doc-demo-block">
      <div style="margin-left: 16px" class="van-cell__label">请上传和病情有关的图片</div>
    </div>
    <van-tabbar>

      <van-submit-bar
        label="问诊费："
        :price=(docMsg.registrationFee||0)*100
        button-text="提交"
        @submit="onSubmit"
        style="background-color: #f2f3f5"
      >
      </van-submit-bar>
    </van-tabbar>
  </section>

</template>
<script>
  import wx from 'weixin-js-sdk';
  import Cookies from "js-cookie"
  import axios from 'axios';
  import { Toast } from 'vant';
  import { Dialog } from 'vant';
  import { imageUrl } from '@/utils/global'
  export default {
    name: 'Teletext',
    data() {
      return {
        medicalRecord:{
          docId:"",
          extraMsg:"",
          extraPic:"",
          state:"",
        },
        docMsg:{},
        docList:[],
        loading: false,
        finished: false,
        fileList:[]
      }
    },
    methods: {
      muban(){
        this.medicalRecord.extraMsg = "1、工作类别（如学生、IT人员、办公室人员等）：\n" +
          "2、饮食检查问卷\n" +
          "你几乎每天都食用高糖、高盐、经过加工的食品（熏肉、咸菜、火腿等）吗?  \n" +
          "答案：\n" +
          "你每天吸烟的数量是否超过5支?  \n" +
          "答案：\n" +
          "你平均几天喝一次酒、喝多少? \n" +
          " 答案：\n" +
          "你每周食用煎炸食品、快餐、红肉的次数是否超过2次?  \n" +
          "答案：\n" +
          "你的饮食中，新鲜水果和蔬所占的比例是否还不到1/3?  \n" +
          "答案：\n" +
          "你是否经常食用白米、面粉或面色，而不常食用全谷类食物?  \n" +
          "答案：\n" +
          "你每天早晚餐吗、吃什么?   答案：\n" +
          "3、运动调查问卷\n" +
          "你每周从事持续20分钟以上高强度体育锻炼几次？  答案：\n" +
          "你日常有什么运动项目吗？   答案：\n" +
          "4、既往病史：\n" +
          "（诊断结果、恢复情况等逐条简单描述）\n" +
          "5、当前情况（简单描述）\n" +
          "自我感觉哪里不舒服：\n" +
          "做过的医学检查："
      },
      clearmuban(){
        this.medicalRecord.extraMsg = ""
      },
      onSubmit(){
        if(!this.medicalRecord.extraMsg){
          Toast("请填写内容")
          return
        }
        const that = this
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner'
        });
       // Cookies.set("openId","oULFM0cZmGlfC5nMaQnyeuSBNWAQ")
        let docId =  this.$route.query.id
        this.medicalRecord.docId = docId
        let url = "http://39.106.123.28/sh/system/batchUpload"
        let fd = new FormData()
        for(let i = 0;i<this.fileList.length;i++){
          fd.append("file",this.fileList[i].file)
        }
        axios.post(url, fd, {headers: {
            'Content-Type': 'multipart/form-data'
          }}).then(res => {
            this.medicalRecord.extraPic = res.data.rows
          //记录是那个公众号的记录 1上医云 2北美容大
            this.medicalRecord.state = Cookies.get("state")
          //创建医疗记录
          this.$api.gongZhongHao.addByGZhao(this.medicalRecord).then((res) => {
            if(res.code == 200) {
              this.medicalRecord = res.rows
              //如果是免费医生则不收取费用
              if(this.docMsg.docLevel == '0'||this.medicalRecord.feeAmount == 0){
                Toast("提交成功")
                this.$router.push({path:'/medicalRecordList',query:{state:Cookies.get("state"),code:"aa"}})
              }else{
                let url = window.location.href+"/"
                this.$api.gongZhongHao.getJsSdk({url:url,state:Cookies.get("state")}).then((res) => {

                  if(res.code == 200) {
                    this.wxshare(res.rows)

                    let data = {
                      amount: this.medicalRecord.feeAmount,
                      // amount: 0.01,
                      MRecordId: this.medicalRecord.recordId,
                      openId: Cookies.get("openId"),
                      payType: 1,
                      appId:res.rows.appId
                    }
                    this.$api.gongZhongHao.wxpay(data).then((res) => {
                      if(res.code == 200){
                        wx.ready(function () {
                          wx.chooseWXPay({
                            appId:res.rows.appId,
                            timestamp: res.rows.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: res.rows.nonceStr, // 支付签名随机串，不长于 32 位
                            package: res.rows.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: res.rows.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: res.rows.paySign, // 支付签名
                            success: function (res) {
                              // 支付成功后的回调函数
                              this.$router.push({path:'/medicalRecordList',query:{state:Cookies.get("state"),code:"aa"}})
                            }
                          });
                        });
                      }
                    })

                  }else{
                    Dialog.alert({
                      message: res.rows.msg
                    }).then(() => {
                      // on close
                    });
                  }
                })
              }

            }else{
              Dialog.alert({
                message: res.msg
              }).then(() => {
                // on close
              });
            }

          })


        }).catch(err => {
          alert(err)
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
          jsApiList: ['chooseWXPay']
        });
        wx.error(function(res){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });

      },
      selectById(id){
        //根据id查询
        this.$api.gongZhongHao.selectById({"id":id}).then((res) => {
          if(res.code == 200) {
            this.docMsg = res.rows
          }

        })
      }
    },
    mounted() {
      this.selectById(this.$route.query.id)
    }
  }
</script>
<style>
  .van-doc-demo-section {
    box-sizing: border-box;
    min-height: calc(100vh - 56px);
    padding-bottom: 20px;
    border:1px;
  }
  .van-doc-demo-block__title {
    margin: 0;
    padding: 32px 16px 16px;
    color: #323233;
    font-weight: normal;
    font-size: 20px;
    line-height: 16px;
  }
  .van-field__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    margin: 0;
    padding: 0;
    color: #323233;
    text-align: left;
    border: 1px solid;
    border-radius: 4px;
    background-color: #20212114;
    resize: none;
  }
  .van-uploader__upload{
    border: 1px solid;
  }
  .van-cell__label {
    margin-top: 3px;
    color: #969799;
    font-size: 14px;
    line-height: 18px;
  }

</style>
