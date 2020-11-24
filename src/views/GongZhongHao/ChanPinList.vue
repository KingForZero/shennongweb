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
          <div v-if="item.show">
            <div>
              <img class="midTab" style="width: 90%;height: 152px;" :src="item.image">
            </div>
            <div style="margin: 6px 19px;">{{item.name}}</div>
            <div style="margin: 6px 19px;">
              <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>功效</div>
              <div class="ziTi">{{item.effect}}</div>
              <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>组成</div>
              <div class="ziTi">{{item.form}}</div>
              <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>价格</div>
              <div class="ziTi">{{item.price}}</div>
            </div>
            <div style="margin: 6px 19px;">
              <div class="detailButton" style="text-align: center;" @click="sale()">点击购买</div>
            </div>
            <div style="margin: 6px 19px;">
              <div class="detailButton" style="text-align: center;" @click="shouqi(item)">收起</div>
            </div>
          </div>
          <div class="yaoshan" v-else>
            <div>
              <img class="midTab"  style="width: 125px;height: 80px;" :src="item.image">
            </div>
            <div class="midTab midDiv">
              <div style="display: flex;"><div class="choose"></div> {{item.name}}</div>
              <div class="ziTi">{{item.effectSub}}</div>
              <div class="detailButton" @click="detail(item)">查看详情</div>
            </div>
          </div>
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
        sale(){
          Dialog.confirm({
            title: '提示',
            message: '为了保证你的健康，平台所有产品使用均需咨询专业人士',
          })
            .then(() => {
              // on confirm
              window.location.href = 'http://soelaine.com/docList'
            })
            .catch(() => {
              // on cancel
            });
        },
        shouqi(item){
          item.show = false
          this.$forceUpdate()
        },
        detail(item){
          item.show = true
          this.$forceUpdate()
        },

        onRefresh() {
          // 清空列表数据
          this.finished = false;

          // 重新加载数据
          // 将 loading 设置为 true，表示处于加载状态
          this.loading = true;
          this.onLoad();
        },
        selectList(){
          if (this.refreshing) {
            this.list = [];
            this.refreshing = false;
          }
          this.loading = false;
          this.$api.chanpin.selectListGZ().then((res) => {
            if(res.code == 200) {
              var arr = res.rows;
              for(let i = 0;i<arr.length;i++){
                arr[i].image = "http://39.106.123.28/images/"+arr[i].image
                if(arr[i].effect.length>18){
                  arr[i].effectSub = arr[i].effect.substring(0,18)+"..."
                }else{
                  arr[i].effectSub = arr[i].effect
                }
              }
              this.list = arr
              this.finished = true;
            }
          })
          console.log("list的长度"+this.list.length)
        },
        onLoad(){
          let code = this.$route.query.code
          let state = this.$route.query.state
          if(state){
            Cookies.set("state",state)
          }
          if(code){
            if(state == '1'){
              this.$api.assistant.getOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.selectList()
              })
            }else if(state == 2){
              this.$api.assistant.getYingYangOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.selectList()
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
  .yaoshan{
    display: flex;
    justify-content: space-around;
  }
  .midTab{
    width: 50%;
    margin: 15px;
  }
  .ziTi{
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity:0.6;
    font-size: 13px;
  }
  .midDiv{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .detailButton{
    font-size: 13px;
    color: #4DD0E1;
  }
</style>
