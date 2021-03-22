<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div  v-for="item in list" :key="item.index" class="van-cell-group van-hairline--top-bottom van-panel" @click="detail(item.recordId)">
          <div class="van-cell van-panel__header">
            <div class="van-cell__title">
              <span >{{item.healthMsg}}</span>
            </div>

          </div>
          <div class="van-cell__label" style="margin: 2px 20px;text-align: right">
            <!--<button class="van-button van-button--primary van-button--plain van-button--small" v-if="item.isPay" @click.stop="pay(item.recordId)">-->
            <!--<span class="van-button__text">支付</span>-->
            <!--</button>-->
            <span style="color: black">创建人:{{item.createName}}</span>
          </div>
          <!--<van-cell :value="item.healthMsg" />-->
        </div>

      </van-list>
    </van-pull-refresh>

  </div>

</template>

<script>
  import { timestampToTime } from "@/utils/datetime"
  import medicalRecordEnum from "@/enums/MedicalRecordEnum"
  import { Dialog } from 'vant';
  import { Toast } from 'vant';
  import Cookies from "js-cookie"
    export default {
        data(){
          return{
            list:[],
            loading:false,
            finished:false,
            refreshing:false
          }
        },
      methods:{
          //进入医疗记录详情
        detail(recordId){
          this.$router.push({path: '/medicalRecordDetail', query: {recordId: recordId}})
        },
        //支付
        pay(recordId){
          alert("支付Id:"+recordId)
        },
        onRefresh() {
          // 清空列表数据
          this.finished = false;

          // 重新加载数据
          // 将 loading 设置为 true，表示处于加载状态
          this.loading = true;
          this.onLoad();
        },
        selectMList(state){
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }
          let openId =  Cookies.get("openId")
          this.loading = false;
          this.$api.gongZhongHao.selectAssessmentGZ({openId:openId,state:state}).then((res) => {
            if(res.code == 200) {
              var arr = res.rows;
              this.list = res.rows
              this.finished = true;
            }
          })
        },
        onLoad(){
          //this.selectMList(1)
          let code = this.$route.query.code
          let state = this.$route.query.state
          if(state){
            Cookies.set("state",state)
          }
          if(code){
            //state为1代表上医云的公众号 2代表北美容大的公众号
            if(state == '1'){
              this.$api.assistant.getOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.selectMList(state)
              })
            }else if(state == '2'){
              this.$api.assistant.getYingYangOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.selectMList(state)
              })
            }
          }
        }
      },
      created() {


      }

    }
</script>

<style scoped>

</style>
