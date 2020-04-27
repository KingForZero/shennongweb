<template>
    <div id="physique">
      <div style="text-align: center; ">
        <h3>体质辨识</h3>
      </div>
      <div style="padding: 0 20px">
        <div class="tip">
          <div>注：9种体质测试共66题，请认真作答 </div>
          <div>(没有=根本不、很少=有些、有时=有些、经常=相当、一直=非常)</div>
        </div>
        <div class="title">
          请根据近一年的体验和感觉,回答以下问题:
        </div>
        <div v-for="(item,index) in tabList" :key="index">
          <div style="margin: 10px auto;">{{item.question}}</div>
          <div class="result">
            <div style="border-radius:10px 0px 0px 10px;background:rgba(189,236,242,1);width: 25%"
                 :class="{answer:item.selectIndex==0}"
                 @click="confirm(item,0)">没有
            </div>
            <div style="background:rgba(129,230,243,1);width: 25%" :class="{answer:item.selectIndex==1}"
                 @click="confirm(item,1)">很少</div>
            <div style="background:rgba(77,208,225,1);width: 25%" :class="{answer:item.selectIndex==2}"
                 @click="confirm(item,2)">有时</div>
            <div style="background:rgba(17,196,219,1);width: 25%" :class="{answer:item.selectIndex==3}"
                 @click="confirm(item,3)">经常</div>
            <div style="border-radius:0px 10px 10px 0px;background:rgba(0,180,203,1);width: 25%"
                 :class="{answer:item.selectIndex==4}"
                 @click="confirm(item,4)">一直</div>
          </div>
        </div>
        <div style="height: 50px;padding-top: 26px;padding-bottom: 26px;">
          <van-slider v-model="value" disabled  bar-height="5px" active-color="#4DD0E1" :min="0" :max="3">
          </van-slider>
          <div style="text-align: center;color:#4DD0E1;">
            {{value}}/3
          </div>
          <div style="display: flex;justify-content: space-between;color: #85E61F">
            <div >
              <span v-if="value != '1'" @click="pageUp">上一页</span>
            </div>
            <div >
              <span v-if="value != '3'" @click="pageDown">下一页</span>
              <span v-if="value == '3'" @click="done">完成</span>
            </div>
          </div>

        </div>

      </div>

    </div>
</template>

<script>
  import { Notify } from 'vant';
  import { Dialog } from 'vant';
    export default {
        name: "PhysiqueQuestion",
        data(){
          return{
            value: 1,
            result : [],
            //分数排序：
            // 倒叙：desc:5,4,3,2,1
            // 正序asc： 1，2，3，4，5
            tabList:[],
            //第一页的数据
            tabListOne : [
              {
                type:"A",
                question:"1.您精力充沛吗（工作、学习强度耐受力）",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"2.您日常活动容易疲乏吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"3.您说话声音低弱无力吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"4.您感到闷闷不乐、情绪低沉吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"5.您比一般人耐受不了寒冷(冬天的寒冷,夏天的冷空调、电扇)吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"6.您能适应外界自然和社会环境的变化吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"7.您容易失眠吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"A",
                question:"8.您容易忘事(健忘)吗",
                scoreSort:"desc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"9.你容易疲乏吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"10.您容易气短(呼吸短促,接不上气)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"11.您容易心慌吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"12.您容易头晕或站起时晕眩吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"13.您比别人容易患感冒吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"14.您喜欢安静、懒得说话吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"15.您说话声音无力吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"B",
                question:"16.您活动量稍大就容易出虚汗吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"17.您手脚发凉吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"18.您胃脘部、背部或腰膝部怕冷吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"19.您感到怕冷、衣服比别人穿得多吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"20.您比一般人耐受不了寒冷(冬天的寒冷,夏天的冷空调、电扇等)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"21.您比别人容易患感冒吗?",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"22.您吃(喝)凉的东西会感到不舒服或者怕吃(喝)凉东西吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"C",
                question:"23.你受凉或吃(喝)凉的东西后,容易腹泻(拉肚子)吗",
                scoreSort:"asc",
                selectIndex:-1
              }
            ],
            //第二页的数据
            tabListTwo : [
              {
                type:"D",
                question:"1.您感到手脚心发热吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"2.您感觉身体、脸上发热吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"3.您皮肤或☐唇干吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"4.您☐唇的颜色比般人红吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"5.您容易便秘或大便干燥吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"6.您面部两颧潮红或偏红吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"7.您感到眼睛干涩吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"D",
                question:"8.你感到☐干咽燥,总想喝水吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"9.您感到胸闷或腹部胀满吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"10.您感到身体沉重不轻松或不爽快吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"11.您腹部肥满松软吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"12.您有额部油脂分泌多的现象吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"13.您上眼睑比别人肿(轻微隆起的现象)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"14.您嘴里有黏黏的感觉吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"15.您平时痰多,特别是咽喉部总感到有痰堵着吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"E",
                question:"16.您舌苔厚腻或有舌苔厚厚的感觉吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"17.您面部或鼻部有油腻感或者油亮发光吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"18.你容易生痤疮或疮疖吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"19.您感到☐苦或嘴里有异味吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"20.您大便黏滞不爽、有解不尽的感觉吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"21.您小便时尿道有发热感、尿色浓(深)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"22.您带下色黄(白带颜色发黄)吗(限女性回答)",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"F",
                question:"23.您的阴囊部位潮湿吗(限男性回答)",
                scoreSort:"asc",
                selectIndex:-1
              }
            ],
            //第三页的数据
            tabListThree : [
              {
                type:"G",
                question:"1.您的皮肤在不知不觉中会出现青紫瘀斑(皮下出血)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"2.您两颧部有细微红丝吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"3.您身体上有哪里疼痛吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"4.您面色晦黯或容易出现褐斑吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"5.您容易有黑眼圈吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"6.您容易忘事(健忘)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"G",
                question:"7.您☐唇颜色偏黯吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"8.您感到闷闷不乐吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"9.您容易精神紧张、焦虑不安吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"10.您多愁善感、感情脆弱吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"11.您容易感到害怕或受到惊吓吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"12.您胁肋部或乳房胀痛吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"13.您无缘无故叹气吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"H",
                question:"14.您咽喉部有异物感,且吐之不出、咽之不下吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"15.您没有感冒时也会打喷嚏吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"16.您没有感冒时也会鼻塞、流鼻涕吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"17.您有因季节变化、温度变化或异味等原因而咳喘的现象吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"18.您容易过敏(对药物、食物、气味、花粉或在季节交替、气候变化时)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"19.您的皮肤容易起尊麻疹(风团、风疹块、风疙瘩)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"20.您的皮肤因过敏出现过紫癜(紫红色瘀点、瘀斑)吗",
                scoreSort:"asc",
                selectIndex:-1
              },
              {
                type:"I",
                question:"21.您的皮肤一抓就红,并出现抓痕吗",
                scoreSort:"asc",
                selectIndex:-1
              },
            ],
            resultList:[
              "没有","很少","有时","经常","一直"
            ],
            //平和质得分
            scoreA:0,
            //气虚体质得分
            scoreB:0,
            //阳虚体质得分
            scoreC:0,
            //阴虚质得分
            scoreD:0,
            //痰湿质得分
            scoreE:0,
            //湿热质得分
            scoreF:0,
            //血瘀质得分
            scoreG:0,
            //气郁质得分
            scoreH:0,
            //特禀质得分
            scoreI:0,
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
        confirm(item,index){
          item.selectIndex = index
        },
        //计算分数
        sumScore(totalScore,num){
          //原始分＝各个条目的分值相加
          //转化分＝[(原始分一条目数)/(条目数×4)]×100
          return [(totalScore-num)/(num*4)]*100
        },
        pageUp(){
          this.value--
        },
        pageDown(){
          let flag = true
          if(this.value == 1){
            this.tabListOne.filter((item,index) => {
              console.log(index)
              if(item.selectIndex == -1){
                Notify({ type: 'danger', message: '请填写第'+(index+1)+'个问题' })
                flag = false
                return
              }
            })
          }else if(this.value == 2){
            this.tabListTwo.filter((item,index) => {

              if(item.selectIndex == -1){
                Notify({ type: 'danger', message: '请填写第'+(index+1)+'个问题' })
                flag = false
                return false
              }
            })
          }
          if(flag){
            this.value++
          }
        },
        done(){
          Dialog.confirm({
            title: '标题',
            message: '确认提交吗',
          }).then(() => {
              // on confirm
            let scoreMapAsc = new Map();
            scoreMapAsc.set(0,1);
            scoreMapAsc.set(1,2);
            scoreMapAsc.set(2,3);
            scoreMapAsc.set(3,4);
            scoreMapAsc.set(4,5);
            let scoreMapDesc = new Map();
            scoreMapDesc.set(0,5);
            scoreMapDesc.set(1,4);
            scoreMapDesc.set(2,3);
            scoreMapDesc.set(3,2);
            scoreMapDesc.set(4,1);
            let flag = true
            if(this.value == 3){
              this.tabListThree.filter((item,index) => {

                if(item.selectIndex == -1){
                  Notify({ type: 'danger', message: '请填写第'+(index+1)+'个问题' })
                  flag = false
                  return
                }
              })
            }
            //如果验证通过则开始计算分数
            if(flag){
              this.tabListOne.filter((item,index) =>{
                if(item.type == 'A'){
                  if(item.scoreSort == 'asc'){
                    this.scoreA += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreA += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'B'){
                  if(item.scoreSort == 'asc'){
                    this.scoreB += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreB += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'C'){
                  if(item.scoreSort == 'asc'){
                    this.scoreC += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreC += scoreMapDesc.get(item.selectIndex)
                  }
                }
              })
              this.tabListTwo.filter((item,index) =>{
                if(item.type == 'D'){
                  if(item.scoreSort == 'asc'){
                    this.scoreD += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreD += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'E'){
                  if(item.scoreSort == 'asc'){
                    this.scoreE += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreE += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'F'){
                  if(item.scoreSort == 'asc'){
                    this.scoreF += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreF += scoreMapDesc.get(item.selectIndex)
                  }
                }
              })
              this.tabListThree.filter((item,index) =>{
                if(item.type == 'G'){
                  if(item.scoreSort == 'asc'){
                    this.scoreG += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreG += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'H'){
                  if(item.scoreSort == 'asc'){
                    this.scoreH += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreH += scoreMapDesc.get(item.selectIndex)
                  }
                }
                if(item.type == 'I'){
                  if(item.scoreSort == 'asc'){
                    this.scoreI += scoreMapAsc.get(item.selectIndex)
                  }
                  if(item.scoreSort == 'desc'){
                    this.scoreI += scoreMapDesc.get(item.selectIndex)
                  }
                }
              })
              let a = this.sumScore(this.scoreA,8)
              let b = this.sumScore(this.scoreB,8)
              let c = this.sumScore(this.scoreC,8)
              let d = this.sumScore(this.scoreD,8)
              let e = this.sumScore(this.scoreE,8)
              let f = this.sumScore(this.scoreF,8)
              let g = this.sumScore(this.scoreG,8)
              let h = this.sumScore(this.scoreH,8)
              let i = this.sumScore(this.scoreI,8)
              let tizhi = '';
              if(a >= 60 && b<40 && c<40 && d<40 && e<40 && f<40 && g<40 && h<40 && i<40){
                tizhi = '平和体质'
              }else {
                if(b >= 40){
                  tizhi += '气虚体质 '
                }
                if(c >= 40){
                  tizhi += '阳虚体质 '
                }
                if(d >= 40){
                  tizhi += '阴虚质 '
                }
                if(e >= 40){
                  tizhi += '痰湿质 '
                }
                if(f >= 40){
                  tizhi += '湿热质 '
                }
                if(g >= 40){
                  tizhi += '血瘀质 '
                }
                if(h >= 40){
                  tizhi += '气郁质 '
                }
                if(i >= 40){
                  tizhi += '特禀质 '
                }
              }
              console.log(tizhi)
              this.$router.push({path: '/physiqueReport'})

            }
            }).catch(() => {
              // on cancel
            });

        }
      },
      mounted() {
          this.tabList = this.tabListOne
      },
      watch: {
          'value':function(newVal) {
            physique.scrollIntoView();
            if(newVal == 1){
              this.tabList = this.tabListOne
            }else if(newVal == 2){
              this.tabList = this.tabListTwo
            }else if(newVal == 3){
              this.tabList = this.tabListThree
            }
        }
      }
    }
</script>

<style scoped>
  @import "../../font/font.css";
  .tip{
    font-size: 12px;
    font-weight:500;
    color:rgba(0,0,0,1);
    opacity:0.6;
    margin: 0 auto;
  }
  .title{
    font-weight:500;
    color:rgba(0,0,0,1);
    opacity:0.87;
    margin: 15px auto;
  }
  .result{
    color: white;
    display: flex;
    justify-content: space-around;
    text-align: center;
  }
  .answer{
    border-bottom: 7px solid #85E61F;
  }
  .custom-button {
    width: 26px;
    color: #fff;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: #ee0a24;
    border-radius: 100px;
  }




</style>
