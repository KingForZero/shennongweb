<template>
  <div>
    <div v-for="item in list" :key="item.index" class="van-cell-group van-hairline--top-bottom van-panel" @click="detail(item.recordId)">
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
            <button class="van-button van-button--primary van-button--plain van-button--small" v-if="item.isPay" @click.stop="pay(item.recordId)">
              <span class="van-button__text">支付</span>
            </button>
            <button class="van-button van-button--danger van-button--plain van-button--small" v-if="item.isCancel" @click.stop="qx(item.recordId)">
              <span class="van-button__text">取消</span>
            </button>
          </div>

        </div>
      </div>
      <van-divider />
    </div>
<!--    <van-list-->
<!--      v-model="loading"-->
<!--      :finished="finished"-->
<!--      finished-text="没有更多了"-->
<!--      @load="onLoad"-->
<!--    >-->
      <!--<van-panel v-for="item in list" :key="item.index" :title="item.docName" :desc="item.createTime"-->
                 <!--:status="item.status">-->
<!--&lt;!&ndash;        <div class="van-cell__title">&ndash;&gt;-->
<!--&lt;!&ndash;          <div class="van-cell__label">{{item.content}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
        <!--<div class="van-cell van-panel__header">-->
          <!--<div class="van-cell__title">-->
            <!--<div class="van-cell__label">总费用：{{item.total}}</div>-->
          <!--</div>-->

        <!--</div>-->
          <!--<div slot="footer" style="padding-left: 60%">-->
            <!--<van-button size="small" v-if="item.isCancel" type="danger">取消</van-button>-->
            <!--<van-button size="small" v-if="item.isPay">支付</van-button>-->

          <!--</div>-->

      <!--</van-panel>-->
<!--    </van-list>-->
  </div>

</template>

<script>
  import { timestampToTime } from "@/utils/datetime"
  import medicalRecordEnum from "@/enums/MedicalRecordEnum"
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
          this.$router.push({name: 'MedicalRecordDetail', params: {recordId: recordId}})
        },
        //支付
        pay(recordId){
          alert("支付Id:"+recordId)
        },
        //取消
        qx(recordId){
          alert("取消Id："+recordId)
        },
      },
      mounted() {
        let userId =  this.$route.params.userId || "1210848909806399489"
        if(userId){
          this.$api.gongZhongHao.selectMedicalRecordsGZ({userId:userId}).then((res) => {
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
        }else{
          alert("无数据")
        }
      }

    }
</script>

<style scoped>

</style>
