<template>
    <div >
      <div style="text-align: center">
        <h3>健康评估</h3>
      </div>

      <div class="back" >
        <div style="display: flex;padding: 12px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">基本信息</div>
        </div>
        <div class="base">
          <div>姓 名：{{healthRecord.userName}}</div>
          <div>身 高：{{healthRecord.height}}cm</div>
        </div>
        <div class="base">
          <div>
            性 别：<span v-if="healthRecord.userSex == '0'">男</span>
            <span v-if="healthRecord.userSex=='1'">女</span>
          </div>
          <div style="margin-right: 14px;">体 重：{{healthRecord.weight}}kg</div>
        </div>
        <div class="base">
          <div>年 龄：{{healthRecord.userAge}}岁</div>
        </div>
        <div class="base">
          <div>手 机：{{healthRecord.userTel}}</div>
        </div>
        <!--<div style="text-align: center;width: 40%;margin: 0 auto;padding-bottom: 26px">-->
          <!--<van-button @click="editMsg" type="primary" block style="width: 100%;border-radius:40px"-->
                      <!--color="#4dd0e1">修改信息-->
          <!--</van-button>-->
        <!--</div>-->
      </div>
      <div class="back1" >
        <div style="display: flex;padding: 12px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">慢性病史</div>
        </div>
        <div class="base1">
          <div class="tab" :class="{choose:chooseAfterValue.indexOf(item)!=-1}" v-for="(item,index) in tabList"
               :key="index"
               @click="clickTab(item,index)">{{item}}</div>
        </div>

      </div>
      <div style="text-align: center;width: 300px;margin: 0 auto;padding-bottom: 26px">
          <van-button @click="clickPhysique" type="primary" block style="width: 100%;border-radius:40px"
                      color="#4dd0e1">体质辨识问卷
          </van-button>
      </div>
      <van-dialog @confirm="confirm" v-model="show" title="慢性病史" show-cancel-button>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
      </van-dialog>
      <van-dialog @confirm="confirm" v-model="showMsg" title="修改信息" show-cancel-button>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
        <van-field v-model="bingshi" clearable  placeholder="请输入病史"/>
      </van-dialog>
    </div>
</template>

<script>
    import Cookies from "js-cookie";
    import {Toast} from "vant";
    import { Dialog } from 'vant';

    export default {
      components: {
        [Dialog.Component.name]: Dialog.Component,
      },
        name: "HealthAssessment",
        data(){
          return{
            show:false,
            showMsg:false,
            bingshi:'',
            result : [],
            healthRecord:{},
            tabList :
              ["高血压","糖尿病","慢性肠炎","高脂血症","胃溃疡","冠心病","慢性胃炎","阳痿早泄","脂肪肝","贫血","月经不调","痛经","十二指肠溃疡","慢性支气管炎","其他"],
            chooseAfterValue:[],
            reTest:''
          }
       },
      methods:{
        editMsg(){
          this.showMsg = true
        },
        clickTab(item,index){
          if(item == '其他'){
            this.show = true
          }else{
            if(this.chooseAfterValue.indexOf(item)!=-1){
              this.chooseAfterValue.splice( this.chooseAfterValue.indexOf(item), 1 )
            }else{
              this.chooseAfterValue.push(item)
            }
          }
        },
        clickPhysique(){
          let isMan = 0
          if(this.chooseAfterValue.length>0){
            isMan = 1
            this.healthRecord.allergicHistory = this.chooseAfterValue.join(",")
            this.$api.assistant.updateHealthRecord(this.healthRecord).then((res) => {
              if(res.code == '200'){

              }
            })
          }
          this.$router.push({path: '/physiqueQuestion',query:{userSex:this.healthRecord.userSex,isMan:isMan}})
        },
        confirm(){
          this.tabList.push(this.bingshi)
          this.chooseAfterValue.push(this.bingshi)
        },
        selectMsgByGzOpenId(){
          this.$api.physique.selectMsgByGzOpenId({openId:Cookies.get("openId")}).then((res) => {
            if(res.code == 200) {
              this.healthRecord = res.rows
              if(res.rows.allergicHistory){
                this.chooseAfterValue =res.rows.allergicHistory.split(",")
              }
              if(this.reTest == '1'){

              }else{
                if(res.rows.isPhysiqe == '1'){
                  //如果已经测试过体质辨识则直接显示测试结果
                  this.$router.push({path: '/physiqueReport',query: {tizhi: res.rows.physiqe,high:res.rows.highScore}})
                }
              }

            }
          })
        }

      },
      mounted() {
      },
      created() {
        let code = this.$route.query.code
        //获取是否是从重新测试跳转来的标识
        this.reTest = this.$route.query.reTest
        if(code){
          this.$api.assistant.getOpenId({code:code}).then((res) => {
            if(res.code == '200'){
              Cookies.set("openId",res.rows.openid)
              //获取邀请人id
              if(res.rows.fromId){
                Cookies.set("fromId",res.rows.fromId)
              }

              this.selectMsgByGzOpenId()
            }else{
              //Toast(res.msg)
            }
          })
        }
        this.selectMsgByGzOpenId()

      }
    }
</script>

<style scoped>
.back {
  margin:12px auto;
  width:90%;
  background:rgba(255,255,255,1);
  box-shadow:-5px -2px 39px 1px rgba(195,195,195,0.34);
  border-radius:10px;
}
.back1 {
  margin:12px auto;
  width:90%;
  padding: 2px 0px;
  background:rgba(255,255,255,1);
  box-shadow:-5px -2px 39px 1px rgba(195,195,195,0.34);
  border-radius:10px;
}
.base1{
  display: flex;
  margin: 11px 9px;
  align-items: center;
  font-weight: 400;
  opacity: 0.87;
  flex-wrap: wrap;
}
.base{
  display: flex;
  justify-content: space-between;
  margin: 11px 16px;
  align-items: center;
  font-weight: 400;
  opacity: 0.87;
  flex-wrap: wrap;
}
.tab{
  height:22px;
  border:1px solid #c0c4cc;
  opacity:0.5;
  border-radius:5px;
  text-align: center;
  margin: 5px 6px;
  padding: 4px;
}
.choose{
  background:rgb(6, 221, 249);
  color: white;
  border: 0px
}

</style>
