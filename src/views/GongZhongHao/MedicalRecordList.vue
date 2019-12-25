<template>
  <div>
<!--    <van-list-->
<!--      v-model="loading"-->
<!--      :finished="finished"-->
<!--      finished-text="没有更多了"-->
<!--      @load="onLoad"-->
<!--    >-->
      <van-panel v-for="item in list" :key="item.index" :title="item.title" :desc="item.createTime"
                 :status="item.status">
<!--        <div class="van-cell__title">-->
<!--          <div class="van-cell__label">{{item.content}}</div>-->
<!--        </div>-->
        <div class="van-cell van-panel__header">
          <div class="van-cell__title">
            <div class="van-cell__label">{{item.content}}</div>
          </div>

        </div>
          <div slot="footer" style="padding-left: 60%">
            <van-button size="small">按钮</van-button>
            <van-button size="small" type="danger">按钮</van-button>
          </div>

      </van-panel>
<!--    </van-list>-->
  </div>

</template>

<script>
    export default {
        data(){
          return{
            list:[
              {
                title:"主治医生：金先红",
                desc:"描述1",
                status:"待支付",
                content:"病毒性流感",
                createTime:"2019.12.21 11:23:23"
              },
              {
                title:"主治医生：张三",
                desc:"描述2",
                status:"已取消",
                content:"狂犬病",
                createTime:"2019.12.21 11:23:23"
              }
            ],
            loading:false,
            finished:false
          }
        },
      methods:{
          onLoad(){

          }
      },
      mounted() {
        let userId =  this.$route.params.userId
        if(userId){
          alert(userId)
        }else{
          alret("无数据")
        }
      }

    }
</script>

<style scoped>

</style>
