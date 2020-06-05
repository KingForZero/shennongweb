<template>
    <div >
      <div style="text-align: center">
        <h3>养生方案</h3>
      </div>
      <van-tabs color="#4DD0E1" type="card" v-model="activeName"  @click="onClick">
        <van-tab class="tab" v-for="item in nameList" :title="item" :name="item" :key="item"></van-tab>
      </van-tabs>
      <div class="back" >

        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">饮食健康</div>
        </div>
        <div class="base">
          {{reginmen.foodHealth}}
        </div>
        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">运动锻炼</div>
        </div>
        <div class="base">
          {{reginmen.sport}}
        </div>
        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">情志调养</div>
        </div>
        <div class="base">
          {{reginmen.feeling}}
        </div>
        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">起居调理</div>
        </div>
        <div class="base">
          {{reginmen.dailyLife}}
        </div>


      </div>
      <div style="margin-left: 23px;font-weight: bold">
        中医调理
      </div>
      <div class="back">
        <van-tabs color="#4DD0E1" type="card" v-model="tabName"  @click="onComClick">
          <van-tab title="药膳方案" >
            <div  v-for="item in yaoshanList" :key="item.name">
              <div v-if="item.show">
                <div>
                  <img class="midTab" style="width: 90%;height: 152px;" :src="item.image">
                </div>
                <div style="margin: 6px 19px;">{{item.name}}</div>
                <div style="margin: 6px 19px;">
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>用料清单</div>
                  <div class="ziTi">{{item.repertoire}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>烹煮方法</div>
                  <div class="ziTi">{{item.cookingMethod}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>功效说明</div>
                  <div class="ziTi">{{item.effect}}</div>
                </div>
              </div>
              <div class="yaoshan" v-else>
                <div>
                  <img class="midTab" style="width: 125px;height: 80px;" :src="item.image">
                </div>
                <div class="midTab midDiv">
                  <div style="display: flex;"><div class="choose"></div> {{item.name}}</div>
                  <div class="ziTi">{{item.effectStr}}</div>
                  <div class="detailButton" @click="detail(item)">查看详情</div>
                </div>
              </div>

            </div>
          </van-tab>
          <van-tab title="养生茶饮" >
            <div  v-for="item in yaoshanList" :key="item.name">
              <div v-if="item.show">
                <div>
                  <img class="midTab" style="width: 90%;height: 152px;" :src="item.image">
                </div>
                <div style="margin: 6px 19px;">{{item.name}}</div>
                <div style="margin: 6px 19px;">
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>用料清单</div>
                  <div class="ziTi">{{item.repertoire}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>烹煮方法</div>
                  <div class="ziTi">{{item.cookingMethod}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>功效主治</div>
                  <div class="ziTi">{{item.effect}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>说明</div>
                  <div class="ziTi">{{item.explain}}</div>
                </div>
              </div>
              <div class="yaoshan" v-else>
                <div>
                  <img class="midTab" style="width: 125px;height: 80px;" :src="item.image">
                </div>
                <div class="midTab midDiv">
                  <div style="display: flex;"><div class="choose"></div> {{item.name}}</div>
                  <div class="ziTi">{{item.effectStr}}</div>
                  <div class="detailButton" @click="detail(item)">查看详情</div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="穴位调理" >
            <div  v-for="item in yaoshanList" :key="item.name">
              <div v-if="item.show">
                <div>
                  <img class="midTab" style="width: 90%;height: 152px;" :src="item.image">
                </div>
                <div style="margin: 6px 19px;">{{item.name}}</div>
                <div style="margin: 6px 19px;">
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>定位方法</div>
                  <div class="ziTi">{{item.positioningMethod}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>操作方法</div>
                  <div class="ziTi">{{item.operationMethod}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>功效主治</div>
                  <div class="ziTi">{{item.effect}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>说明</div>
                  <div class="ziTi">{{item.explain}}</div>
                </div>
              </div>
              <div class="yaoshan" v-else>
                <div>
                  <img class="midTab" style="width: 125px;height: 80px;" :src="item.image">
                </div>
                <div class="midTab midDiv">
                  <div style="display: flex;"><div class="choose"></div> {{item.name}}</div>
                  <div class="ziTi">{{item.effectStr}}</div>
                  <div class="detailButton" @click="detail(item)">查看详情</div>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="常用中药" >
            <div  v-for="item in yaoshanList" :key="item.name" style="border-bottom: 1px solid rgba(0,0,0,.1);">
                <div style="margin: 6px 19px;">{{item.name}}</div>
                <div style="margin: 6px 33px;">
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>用料清单</div>
                  <div class="ziTi">{{item.repertoire}}</div>
                  <div style="display: flex;margin: 8px 0px;"><div class="choose"></div>功效主治</div>
                  <div class="ziTi">{{item.effect}}</div>
                </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
      <div style="text-align: center;width: 300px;margin: 0 auto">
        <van-button @click="zixun" type="primary" block style="width: 100%;border-radius:40px;"
                    color="#4dd0e1">咨询医生
        </van-button>
      </div>

    </div>
</template>

<script>
    import {Toast} from "vant";

    export default {
        name: "Reginmen",
        data(){
          return{
            activeName:"",
            nameList:[],
            reginmen:{},
            tabName:0,
            yaoshanList:[],
            yangshengList:[],
            xueweiList:[],
            zhongyaoList:[],
            isShow:false
          }
       },
      methods:{
        onClick(name,title){
         this.selectReginmenByName(name)
          this.selectMedicalConditionByName(this.activeName,1)
        },
        selectReginmenByName(name){
          this.$api.physique.selectReginmenByName({name:name}).then((res) => {
            if(res.code == 200) {
              this.reginmen = res.rows
            }else{
              Toast(res.msg)
            }
          })
        },
        selectMedicalConditionByName(name,type){
          this.$api.physique.selectMedicalConditionByName({name:name,type:type}).then((res) => {
            if(res.code == 200) {
              this.yaoshanList = res.rows
              for (let i = 0; i < this.yaoshanList.length; i++) {
                this.yaoshanList[i].image = "http://39.106.123.28/images/"+this.yaoshanList[i].image
                if(this.yaoshanList[i].effect.length>18){
                  this.yaoshanList[i].effectStr = this.yaoshanList[i].effect.substring(0,18)+"..."
                }
              }
            }else{
              Toast(res.msg)
            }
          })
        },
        onComClick(name,title){
          this.selectMedicalConditionByName(this.activeName,Number(name)+1)
        },
        detail(item){
          item.show = true
          this.$forceUpdate()
        },
        zixun(){
          this.$router.push({path: '/doctorList'})
        }
      },
      mounted() {
          this.tizhi = this.$route.query.tizhi || ''
          this.nameList = this.tizhi.split(",")
          if(this.tizhi){
            this.selectReginmenByName(this.nameList[0])
            this.selectMedicalConditionByName(this.nameList[0],'1')
          }

      }
    }
</script>

<style scoped>
.back {
  margin:12px auto;
  padding: 8px;
  width:90%;
  background:rgba(255,255,255,1);
  box-shadow:-5px -2px 39px 1px rgba(195,195,195,0.34);
  border-radius:10px;
}
.back1 {
  padding: 12px;
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
  background:rgba(77,208,225,1);
  border-radius:10px 10px 0px 0px;
}
.choose{
  width:6px;
  height:6px;
  background:rgba(77,208,225,1);
  border-radius:50%;
  margin-top: 7px;
  margin-left: -11px;
  margin-right: 4px;
}
.re{transform:rotate(90deg);
  -ms-transform:rotate(90deg); /* Internet Explorer 9*/
  -moz-transform:rotate(90deg); /* Firefox */
  -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
  -o-transform:rotate(90deg); /* Opera */
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}
  .top{
    align-self: flex-end;
    background:rgba(255,181,64,1);
    border-radius:10px 10px 0px 0px;
    padding: 5px 10px;
    font-size: 12px;
    font-weight:400;
    color:rgba(255,255,255,1);
    opacity:0.87
  }
  .top1{
    font-size: 100px;
    text-shadow: 0px 0px 9px grey;
    font-weight: bold;
    position:relative;
    color: #FFB540;
  }
.a {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  color: #f5f7fa;
}
.mid{
  font-weight:500;
  color:rgba(0,0,0,1);
  opacity:0.87;
  font-size: 17px;
}
  .bot{
    font-weight:400;
    color:rgba(0,0,0,1);
    opacity:0.6;
    font-size: 13px;
  }
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
