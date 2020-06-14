<template>
    <div >
      <!--<div style="text-align: center">-->
        <!--<h3>体质辨识报告</h3>-->
      <!--</div>-->

      <div class="back" >
        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">体质类型</div>
        </div>
        <div class="base">
          <div class="tab"  v-for="(item,index) in tabList" :key="index" @click="detail(item)">{{item}}
          </div>
        </div>
        <div v-for="item in detailArr" v-if="show">
          <div style="text-align: center">{{item.physiqueName}}</div>
          <div>体质介绍</div>
          <div style="font-weight:400;opacity: 0.6">{{item.introduce}}</div>
          <div>成因</div>
          <div style="opacity: 0.6">{{item.reason}}</div>
          <div style="text-align: center;width: 300px;margin: 0 auto;    padding: 10px 0px;display: flex; flex-direction: row;justify-content: space-around">
            <van-button @click="guanbi" type="primary" block style="width: 30%;border-radius:40px;padding-bottom: 26px;"
                        color="#4dd0e1">关闭
            </van-button>
          </div>
        </div>
      </div>
      <div style="display: flex;justify-content: space-between;text-align: center;padding: 12px;margin: 12px auto">
        <div style="display: flex;flex-direction: column;width: 48%">
          <div class="top" :style="{'background-color':healthColor}">{{healthMsg}}</div>
          <div class="back1">
            <div>
              <div class="top1">
<!--                <div class="a" :style="{'height':healthPercent}"><span>{{healthNum}}</span></div>-->
                <div :style="{'color':healthColor}"><span>{{healthNum}}</span></div>
              </div>
            </div>

            <div class="mid">
              <span>健康指数</span>
            </div>
            <div class="bot">
              <span>该分值为您的偏颇体质严重程度</span>
            </div>
          </div>
        </div>
        <div style="display: flex;flex-direction: column;width: 48%">
          <div class="top" :style="{'background-color':BMIColor}">{{BMIMsg}}</div>
          <div class="back1">
            <div class="top1">
<!--              <div class="a" :style="{'height':BMIPercent}"><span>20</span><span >.2</span></div>-->
              <div
                :style="{'color':BMIColor}"><span>{{BMINum}}</span><span style="font-size: 25px">.{{BMINumDig}}</span></div>
            </div>
            <div class="mid">
              <span>BMI检测结果</span>
            </div>
            <div class="bot">
              <span>您的标准体重应为 {{wS}}kg至{{wE}}kg</span>
            </div>

          </div>
        </div>
      </div>
      <div class="desc">注：健康指数0到100分，分值越高，健康状况越好。大于70分表示健康，50到70分表示亚健康，小于等于50分表示可能有疾病</div>
      <div class="back" >
        <div style="display: flex;">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
          <div style="font-weight: bold">疾病风险提示</div>
        </div>
        <div class="base">
          <div>
            <div>
              <span v-for="(item,index) in riskArr" style="margin-right: 9px;">{{item.riskWarning}}</span>
            </div>

            <van-image  height="143" src="../../../static/risk.gif" />
          </div>

        </div>
      </div>

      <div style="text-align: center;width: 300px;margin: 0 auto;padding-bottom: 28px;display: flex; flex-direction: row;justify-content: space-around">
        <van-button @click="reTest" type="primary" block style="width: 45%;border-radius:40px;padding-bottom: 26px;"
                    color="#4dd0e1">重新测试
        </van-button>
          <van-button v-if="healthMsg != '健康'"  @click="clickPhysique" type="primary" block
                       style="width: 45%;border-radius:40px;padding-bottom: 26px;"
                      color="#4dd0e1">查看健康管理方案
          </van-button>
      </div>
    </div>
</template>

<script>
    import {Toast} from "vant";
    import Cookies from "js-cookie";

    export default {
        name: "PhysiqueReport",
        data(){
          return{
            show:false,
            result : [],
            tabList : [],
            chooseAfterValue:[],
            detailArr:[],
            tizhi:"",
            high:0,
            //健康描述
            healthMsg:"",
            //健康指数
            healthNum:"",
            //健康颜色
            healthColor:"",
            //健康百分比
            healthPercent:"",
            //BMI描述
            BMIMsg:"",
            //BMI指数整数
            BMINum:"",
            //BMI指数小数
            BMINumDig:"",
            //BMI颜色
            BMIColor:"",
            //BMI百分比
            BMIPercent:"",
            wS:'',
            wE:'',
            riskArr:[]

          }
       },
      methods:{
        guanbi(){
          this.show = false
        },
        reTest(){
          this.$router.push({path: 'healthAssessment',query:{reTest:'1',state:Cookies.get("state"),code:"aa"}})
        },
        getHealthColor(){
          return "green"
        },
        clickTab(item,index){
          if(this.chooseAfterValue.indexOf(item)!=-1){
            this.chooseAfterValue.splice( this.chooseAfterValue.indexOf(item), 1 )
          }else{
            this.chooseAfterValue.push(item)
          }
        },
        clickPhysique(){
          this.$router.push({path: '/reginmen',query: {tizhi: this.tizhi}})
        },
        detail(item){
          if(this.tizhi){
            this.show = true
            this.$api.physique.selectByName({name:item}).then((res) => {
              if(res.code == 200) {
                this.detailArr = res.rows
              }else{
                Toast(res.msg)
              }
            })
          }
        },
        GetPercent(num, total) {
          /// <summary>
          /// 求百分比
          /// </summary>
          /// <param name="num">当前数</param>
          /// <param name="total">总数</param>
          num = parseFloat(num);
          total = parseFloat(total);
          if (isNaN(num) || isNaN(total)) {
            return "-";
          }
          return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
        },
        //计算BMI指数
        getBMI(height,weight){
          return  Number(weight)/(Number(height/100)*Number(height/100))
        },
        //根据身高计算正常的体重范围
        getWeightRange(height){
          let w1 = Math.round((Number(height/100)*Number(height/100))*18.5)
          let w2 = Math.round((Number(height/100)*Number(height/100))*23)
          return w1+"-"+w2
        },
        //
        getRiskWarning(){
          this.$api.physique.selectRiskWarningByName({name:this.tizhi}).then((res) => {
            if(res.code == 200) {
              this.riskArr = res.rows
            }else{
              Toast(res.msg)
            }
          })
        }
      },
      mounted() {
          this.tizhi = this.$route.query.tizhi || ''
          this.tabList = this.tizhi.split(",")
          this.high = this.$route.query.high || 0
          if(this.tizhi){
            this.getRiskWarning()
          }

        this.$api.physique.selectMsgByGzOpenId({openId:Cookies.get("openId"),state:Cookies.get("state")}).then((res) => {
          if(res.code == 200) {
            let num = 100-this.high
            if(res.rows.allergicHistory){
              num = num * 0.8
            }
            this.healthNum = Math.round(num)
            if(num>70){
              this.healthMsg = "健康"
              this.healthColor = "#67c23a"
            }else if(num > 50 && num <= 70){
              this.healthMsg = "亚健康"
              this.healthColor = "#FFB540"
            }else if(num <= 50){
              this.healthMsg = "可能有疾病"
              this.healthColor = "grey"
            }
            let height = res.rows.height
            let weight = res.rows.weight
            let w = this.getWeightRange(height)
            this.wS = w.split("-")[0]
            this.wE = w.split("-")[1]
            let BMI = Number(this.getBMI(height,weight)).toFixed(1)
            BMI.toString().split(".")
            this.BMINum =  BMI.toString().split(".")[0]
            this.BMINumDig = BMI.toString().split(".")[1]
            if(BMI<18.5){
              this.BMIMsg = '过轻'
              this.BMIColor = '#FFB540'
            }else if(BMI<23 && BMI >= 18.5){
              this.BMIMsg = '正常'
              this.BMIColor = '#67c23a'
            }else if(BMI<28 && BMI >= 23){
              this.BMIMsg = '超重'
              this.BMIColor = '#1989fa'
            }else if(BMI<30 && BMI >= 28){
              this.BMIMsg = '轻度肥胖'
              this.BMIColor = '#f56c6c'
            }else if(BMI >= 30){
              this.BMIMsg = '重度肥胖'
              this.BMIColor = '#ee0a24'
            }
          }
        })


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
  .desc{
    font-weight: 400;
    opacity: 0.5;
    font-size: 12px;
    margin: 0px 15px;
  }
</style>
