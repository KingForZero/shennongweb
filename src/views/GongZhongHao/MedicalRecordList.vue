<template>
  <div>
    <div v-if="list.length>0">
      <div  v-for="item in list" :key="item.index" class="van-cell-group van-hairline--top-bottom van-panel" @click="detail(item.recordId)">
        <div class="van-cell van-panel__header">
          <div class="van-cell__title">
            <span >主治医师：{{item.docName}}</span>
            <div style="margin-top: 30px">
              <div class="van-cell__label">总费用：{{item.total}}</div>
              <div class="van-cell__label">{{item.createTime}}</div>
            </div>
          </div>
          <div class="van-cell__value van-panel__header-value">
            <span style="color: black">{{item.status}}</span>
            <div class="van-cell__label" style="margin-top: 41px">
              <!--<button class="van-button van-button&#45;&#45;primary van-button&#45;&#45;plain van-button&#45;&#45;small" v-if="item.isPay" @click.stop="pay(item.recordId)">-->
              <!--<span class="van-button__text">支付</span>-->
              <!--</button>-->
              <button class="van-button van-button--danger van-button--plain van-button--small" v-if="item.isCancel" @click.stop="qx(item.recordId)">
                <span class="van-button__text">取消</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="van-doc-demo-block">
        <div class="van-doc-demo-block__title">您尚未建立医疗记录，请联系医生为您开方</div>

      </div>
    </div>
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
            finished:false
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
        //取消
        qx(recordId){
          Dialog.confirm({
            title: '提示',
            message: '确认取消吗？'
          }).then(() => {
            // on confirm
            this.$api.gongZhongHao.cancel({recordsId:recordId}).then((res) => {
              if(res.code == 200) {
                this.getList()
                Toast("操作成功")
              }else{
                Toast(res.msg)
              }
            })
          }).catch(() => {
            // on cancel
          });

        },
        getList(){
          let openId =  Cookies.get("openId")
          if(openId){
            this.$api.gongZhongHao.selectMedicalRecordsGZ({openId:openId}).then((res) => {
              if(res.code == 200) {
                var arr = res.rows;
                for(let i = 0;i<arr.length;i++){
                  arr[i].createTime = timestampToTime(arr[i].createTime)
                  arr[i].status = medicalRecordEnum.status(arr[i].recordState)
                  if(arr[i].recordState == 8){
                    arr[i].isPay = true
                  }
                  if(arr[i].recordState < 9){
                    arr[i].isCancel = true
                  }
                }
                this.list = res.rows
              }
            })
          }
          console.log("list的长度"+this.list.length)
        }
      },
      mounted() {
        if(Cookies.get("openId")){

        }else{
          let code = this.$route.query.code
          if(code){
            this.$api.assistant.getOpenId({code:code}).then((res) => {
              if(res.code == '200'){
                //该用户是否已注册
                let isRegister = res.rows.isRegister
                Cookies.set("openId",res.rows.openid)
                Cookies.set("isRegister",isRegister)
              }else{
                //Toast(res.msg)
              }
            })
          }
        }
        this.getList()
      }

    }
</script>

<style scoped>

</style>
