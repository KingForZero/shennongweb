<template>
    <div >
      <div style="text-align: center">
        <h3>健康评估</h3>
      </div>

      <div class="back" >
        <div style="display: flex;padding: 12px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div style="font-weight: bold">基本信息</div>
        </div>
        <div class="base">
          <div>姓 名：张三</div>
          <div>身 高：175cm</div>
        </div>
        <div class="base">
          <div>性 别：男</div>
          <div>体 重：60kg</div>
        </div>
        <div class="base">
          <div>年 龄：26岁</div>
        </div>
        <div class="base">
          <div>手 机：15238656215</div>
        </div>
      </div>
      <div class="back1" >
        <div style="display: flex;padding: 12px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div style="font-weight: bold">慢性病史</div>
        </div>
        <div class="base">
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
    </div>
</template>

<script>
    export default {
        name: "HealthAssessment",
        data(){
          return{
            result : [],
            tabList :
              ["高血压","糖尿病","慢性肠炎","高脂血症","胃溃疡","冠心病","慢性胃炎","阳痿早泄","脂肪肝","贫血","月经不调","痛经","十二指肠溃疡","慢性支气管炎","其他"],
            chooseAfterValue:[]
          }
       },
      methods:{
        clickTab(item,index){
          if(this.chooseAfterValue.indexOf(item)!=-1){
            this.chooseAfterValue.splice( this.chooseAfterValue.indexOf(item), 1 )
          }else{
            this.chooseAfterValue.push(item)
          }
        },
        clickPhysique(){
          this.$router.push({path: '/physiqueQuestion'})
        }
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
  height:250px;
  background:rgba(255,255,255,1);
  box-shadow:-5px -2px 39px 1px rgba(195,195,195,0.34);
  border-radius:10px;
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
  margin: 5px 0px;
  padding: 4px;
}
.choose{
  background:rgb(6, 221, 249);
  color: white;
  border: 0px
}

</style>
