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
      <div style="text-align: center;width: 300px;margin: 0 auto">
          <van-button @click="clickPhysique" type="primary" block style="width: 100%;border-radius:40px"
                      color="#4dd0e1">体质辨识问卷
          </van-button>
      </div>
      <van-dialog @confirm="confirm" v-model="show" title="慢性病史" show-cancel-button>
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
            bingshi:'',
            result : [],
            healthRecord:{},
            tabList :
              ["高血压","糖尿病","慢性肠炎","高脂血症","胃溃疡","冠心病","慢性胃炎","阳痿早泄","脂肪肝","贫血","月经不调","痛经","十二指肠溃疡","慢性支气管炎","其他"],
            chooseAfterValue:[]
          }
       },
      methods:{
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
          this.$router.push({path: '/physiqueQuestion',query:{userSex:this.healthRecord.userSex}})
        },
        confirm(){
          this.tabList.push(this.bingshi)
          this.chooseAfterValue.push(this.bingshi)
        }
      },
      mounted() {
          let openId = "oULFM0cZmGlfC5nMaQnyeuSBNWAQ"
          Cookies.set("openId",openId)
        this.$api.physique.selectMsgByGzOpenId({openId:openId}).then((res) => {
          if(res.code == 200) {
            this.healthRecord = res.rows
          }
        })

      }
    }
</script>

<style scoped>
.back {
  margin:12px auto;
  width:90%;
  height:200px;
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
