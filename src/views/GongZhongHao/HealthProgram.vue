<template>
    <div >
      <div style="text-align: center">
        <h3>体质辨识报告</h3>
      </div>

      <div class="back" >
        <div style="display: flex;padding: 14px 0px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div>饮食健康</div>
        </div>
        <div>啊啊啊啊啊啊啊A</div>
        <div style="display: flex;padding: 14px 0px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div>运动锻炼</div>
        </div>
        <div>啊啊啊啊啊啊啊A</div>
        <div style="display: flex;padding: 14px 0px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div>情志调养</div>
        </div>
        <div>啊啊啊啊啊啊啊A</div>
        <div style="display: flex;padding: 14px 0px">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div>
          <div>起居调理</div>
        </div>
        <div>啊啊啊啊啊啊啊A</div>
      </div>

      <div class="back">
        <div>
          中药调理
        </div>
        <van-tabs v-model="active" color="#4dd0e1">
          <van-tab title="药膳方案">内容 1</van-tab>
          <van-tab title="养生茶饮">内容 2</van-tab>
          <van-tab title="穴位调理">内容 3</van-tab>
          <van-tab title="常用中药">内容 4</van-tab>
        </van-tabs>
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
        name: "HealthProgram",
        data(){
          return{
            active:1
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
  padding: 12px;
  width:90%;
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
  justify-content: start;
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
  margin: 5px 5px;
  padding: 4px;
}
.choose{
  background:rgb(6, 221, 249);
  color: white;
  border: 0px
}
.re{transform:rotate(90deg);
  -ms-transform:rotate(90deg); /* Internet Explorer 9*/
  -moz-transform:rotate(90deg); /* Firefox */
  -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
  -o-transform:rotate(90deg); /* Opera */
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}


</style>
