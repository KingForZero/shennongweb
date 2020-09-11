<template>
    <div>
      <van-cell-group style="padding-bottom: 20%">
        <van-cell title="姓名" :value="medicalRecord.userName" />
        <van-cell title="电话" :value="medicalRecord.userTel"  />
        <van-cell title="创建时间" :value="medicalRecord.createTime"  />
        <van-cell title="状态" :value="medicalRecord.status"  />
        <!--<van-cell title="补充信息" v-if="medicalRecord.extraMsg" :value="medicalRecord.extraMsg"  />-->
        <!--<van-cell title="补充信息图片" v-if="medicalRecord.extraPic"/>-->

        <!--<div class="van-cell" v-if="medicalRecord.extraPic">-->
          <!--<div class="van-cell__value van-cell__value&#45;&#45;alone">-->
            <!--<van-image-->
              <!--v-for="item in extraPicList"-->
              <!--:key="item.index"-->
              <!--width="5rem"-->
              <!--height="5rem"-->
              <!--fit="contain"-->
              <!--:src="item"-->
            <!--/>-->
          <!--</div>-->
        <!--</div>-->

        <van-cell title="主治医生" :value="medicalRecord.docName"  />
        <!--<van-cell title="医生建议" :value="medicalRecord.docAdvice"  />-->
        <van-cell v-if="medicalRecord.isNutrition == '1'" title="点击寻找营养专家" is-link to="docList" />
        <van-cell title="临床诊断"  :value="clinical"  />
        <van-cell title="嘱托"  :value="entrust"  />
        <van-cell title="病历图片" v-if="medicalRecord.caseHistoryDoc" />
        <div class="van-cell" v-if="medicalRecord.caseHistoryDoc">
          <div class="van-cell__value van-cell__value--alone">
            <van-image
              v-for="item in caseHistoryDocPicList"
              :key="item.index"
              width="5rem"
              height="5rem"
              fit="contain"
              :src="item"
            />
          </div>
        </div>
        <van-cell title="电子处方图片" v-if="medicalRecord.docPic" />
          <div class="van-cell" v-if="medicalRecord.docPic">
            <div class="van-cell__value van-cell__value--alone">
              <van-image
                v-for="item in docPicList"
                :key="item.index"
                width="5rem"
                height="5rem"
                fit="contain"
                :src="item"
              />
            </div>
          </div>
        <van-cell title="药费" :value="medicalRecord.drugAmount" />
        <van-cell title="加工费" :value="medicalRecord.processCost"  />
        <van-cell title="服务费":value="medicalRecord.postage"  />
        <van-cell title="折扣系数":value="medicalRecord.discount"  />
        <van-cell title="邮寄地址" :value="medicalRecord.emsAddress"  />

      </van-cell-group>
      <van-tabbar>

        <van-submit-bar
          :price="medicalRecord.total*100"
          :button-text="payText"
          :disabled="isJY"
          @submit="onSubmit"
          style="background-color: #f2f3f5"
        >
         <span style="color: #1989fa" @click="show()">查看药品</span>
        </van-submit-bar>
      </van-tabbar>
      <van-popup
        v-model="isShow"
        round
        closeable
        position="bottom"
        :style="{ height: '70%' }"
      >
        <van-tabs v-model="active" style="margin: 30px 0">
          <van-tab :title="title(item,index)" :key="index" v-for="(item, index) in medicalList">
            <van-cell-group>
              <van-cell v-for="item1 in item.medicineList" :key="item1.index" :title="item1.name" :label="item1.entrust" :value="item1.amount"  />
            </van-cell-group>
          </van-tab>
        </van-tabs>
      </van-popup>
      <van-popup
        v-model="isShowAdress"
        round
        closeable
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-address-list
          v-model="chosenAddressId"
          :list="addressList"
          @edit="onEdit"
          @add="onAdd"
          @select="onSelect"
          style="margin-bottom: 60px;margin-top: 20px"
        >
        </van-address-list>
      </van-popup>
      <van-popup
        v-model="isShow111"
        round
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-area :area-list="areaList" :value="value" @cancel="quxiao" @confirm="firm" />
      </van-popup>
      <van-popup
        v-model="isShowEditAddress"
        round
        position="bottom"
        :style="{ height: '40%' }"
      >
        <div class="van-address-edit">
          <div class="van-address-edit__fields">
            <div role="button" tabindex="0" class="van-cell van-cell--clickable van-field" @click="editAd">
              <div class="van-cell__title van-field__label">
                <span>地区</span>
              </div>
              <div class="van-cell__value">
                <div class="van-field__body">
                  <input v-model="addressBefore" type="text" placeholder="选择省 / 市 / 区" readonly="readonly" class="van-field__control">
                  <div class="van-field__right-icon">
                    <i class="van-icon van-icon-arrow"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="van-cell van-address-edit-detail">
              <div class="van-cell__value van-cell__value--alone">
                <div class="van-cell van-field">
                  <div class="van-cell__title van-field__label">
                    <span>详细地址</span>
                  </div>
                  <div class="van-cell__value">
                    <div class="van-field__body">
                      <textarea v-model="address.detailAddress" rows="1" placeholder="街道门牌、楼层房间号等信息" class="van-field__control" style="height: 45px;">
                      </textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="van-address-edit__buttons" style="padding: 13px 4px">
            <button @click="baocun" class="van-button van-button--danger van-button--normal van-button--block van-button--round">
              <span class="van-button__text">保存</span>
            </button>
          </div>
        </div>

      </van-popup>


    </div>
</template>

<script>
  import wx from 'weixin-js-sdk';
  import { Dialog } from 'vant';
  import { imageUrl } from '@/utils/global'
  import { timestampToTime } from "@/utils/datetime"
  import medicalRecordEnum from "@/enums/MedicalRecordEnum"
  import areaList from "@/utils/city"
  import Cookies from "js-cookie"
    export default {
        name: "MedicalRecordDetail",
      data(){
          return{
            value:"",
            address:{
              id:"",
              userId:"",
              provinceCode:"",
              provinceName:"",
              cityCode:"",
              cityName:"",
              countyCode:"",
              countyName:"",
              detailAddress:""
            },
            addressBefore:"",
            addressBack:"",
            areaList:areaList,
            userId:"",
            medicalRecord:{

            },
            //补充信息图片
            extraPicList:[],
            //病历图片
            caseHistoryDocPicList:[],
            //电子处方图片
            docPicList:[],
            //药品列表
            medicalList:[{
              name:"aa "
            },{
              name:"bb"
            }],
            clinical:'',
            entrust:'',
            isShow:false,
            active:0,
            payText:"不可支付",
            isJY:false,
            isShowAdress:false,
            isShowEditAddress:false,
            isShow111:false,
            chosenAddressId: 0,
            addressList: [],
            addressListVO:[]
          }
      },
      methods:{

        title(item,index){
          return "处方"+(index+1)
        },
        show(){
          this.isShow = true
        },
        getAddressList(userId){
          this.$api.gongZhongHao.list({userId:userId}).then((res) => {
            if(res.code == 200) {
              //用于前后台数据交互
              this.addressListVO = this.copyArray(res.rows)
              let arr = res.rows
              for(var i = 0;i<arr.length;i++) {
                arr[i].id = i
                arr[i].name = ""
                arr[i].tel = ""
                arr[i].address = arr[i].provinceName + arr[i].cityName + arr[i].countyName + arr[i].detailAddress
              }
              //用于页面组件调用
              this.addressList = arr
            }
          })
        },
        onSubmit(){
          if(this.userId){
            this.getAddressList(this.userId)
          }else{
            Dialog.alert({
              message: "暂无userId"
            }).then(() => {
              // on close
            });
          }

          this.isShowAdress = true
        },
        copyArray(arr){
          return JSON.parse(JSON.stringify(arr));
        },
        onEdit(item,index){
          let arr = this.addressListVO
          if(arr[index].countyCode){
            this.value =  arr[index].countyCode
          }else if(arr[index].cityCode){
            this.value =  arr[index].cityCode
          }else if(arr[index].provinceCode){
            this.value =  arr[index].provinceCode
          }
          this.addressBefore = arr[index].provinceName+arr[index].cityName+arr[index].countyName
          this.address = arr[index]
          this.isShowEditAddress = true
        },
        onAdd(){
          this.address = {}
          this.addressBefore = ""
          this.value = ""
          this.isShowEditAddress = true
        },
        editAd(){
          this.isShow111 = true
        },
        quxiao(){
          this.isShow111 = false
        },
        firm(arr){
          if(arr[0]){
            this.address.provinceCode = arr[0].code
            this.address.provinceName = arr[0].name
        }
          if(arr[1]){
            this.address.cityCode = arr[1].code
            this.address.cityName = arr[1].name
          }
          if(arr[2]){
            this.address.countyCode = arr[2].code
            this.address.countyName = arr[2].name
          }
          this.addressBefore = this.address.provinceName+this.address.cityName+this.address.countyName
          this.isShow111 = false
        },
        baocun(){
          this.address.userId = this.userId
          console.log(this.address)
          this.$api.gongZhongHao.edit(this.address).then((res) => {
            if(res.code == 200) {
              this.getAddressList(this.userId)
              this.isShowEditAddress = false

            }else{
              Dialog.alert({
                message: res.rows.msg
              }).then(() => {
                // on close
              });
            }
          })
        },
        onSelect(item,index){
          let url = window.location.href+"/"
          this.$api.gongZhongHao.getJsSdk({"url":url,state:Cookies.get("state")}).then((res) => {

            if(res.code == 200) {
              this.wxshare(res.rows)

              let data = {
                amount: this.medicalRecord.total,
                MRecordId: this.medicalRecord.recordId,
                openId: Cookies.get("openId"),
                payType: 2,
                address: item.address,
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
                        this.getRecordDetail()
                        this.isShowAdress = false
                        this.payText = "已支付"
                        this.isJY = true
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
        getRecordDetail(){
          let recordId =  this.$route.query.recordId
          let openId = this.$route.query.openId
          if(openId){
            Cookies.set("openId",openId)
          }
          //查询医疗记录详情
          this.$api.gongZhongHao.selectByIdGZ({recordsId:recordId}).then((res) => {
            if(res.code == 200) {
              let data = res.rows
              this.userId = data.userId
              if(data.extraPic){
                let imgStr = data.extraPic
                let imgArr = imgStr.split(",")
                for(var i = 0;i<imgArr.length;i++){
                  this.extraPicList.push(imageUrl+imgArr[i])
                }
              }
              if(data.caseHistoryDoc){
                let imgStr = data.caseHistoryDoc
                let imgArr = imgStr.split(",")
                for(var i = 0;i<imgArr.length;i++){
                  this.caseHistoryDocPicList.push(imageUrl+imgArr[i])
                }
              }
              if(data.docPic){
                let imgStr = data.docPic
                let imgArr = imgStr.split(",")
                for(var i = 0;i<imgArr.length;i++){
                  this.docPicList.push(imageUrl+imgArr[i])
                }
              }
              if(data.createTime){
                data.createTime = timestampToTime(data.createTime)

              }
              this.payText = "支付"
              this.isJY = false
              if(data.recordState==8){
                this.payText = "支付"
                this.isJY = false
              }else if(data.recordState<8){
                this.payText = "不可支付"
                this.isJY = true
              }else{
                this.payText = "已支付"
                this.isJY = true
              }
              data.status = medicalRecordEnum.status(data.recordState)
              this.medicalRecord = data
              //查询电子处方及药品信息
              this.$api.gongZhongHao.selectByRecordIdWX({recordId:recordId}).then((res) => {
                if(res.code == 200) {
                  this.medicalList = res.rows
                  if(res.rows[0]){
                    this.clinical = res.rows[0].clinical
                    this.entrust = res.rows[0].entrust
                  }
                }
              })
            }else{
              this.payText = "不可支付"
              this.isJY = true
              Dialog.alert({
                message: res.rows.msg
              }).then(() => {
                // on close
              });
            }
          })
        }

      },
      mounted(){
        this.getRecordDetail()
      }
    }
</script>

<style scoped>

</style>
