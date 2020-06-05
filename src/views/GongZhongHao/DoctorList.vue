<template>
  <div>
<!--    <div style="text-align: center">-->
<!--      <h3>在线咨询</h3>-->
<!--    </div>-->
    <div class="back" v-if="state != '1'">
      <div style="display: flex">
        <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
        <div style="font-weight: bold">选择科室</div>
      </div>
      <div class="base1">
        <div class="tab" :class="{choose:idx==index}" v-for="(item,index) in departMentOneList"
             :key="index"
             @click="clickTab(item,index)">{{item.departmentOneName}}</div>
      </div>
    </div>
    <div class="back">
      <div style="display: flex">
        <div style="width: 3px;height: 20px;background-color: #4DD0E1;margin-right: 4px;"></div>
        <div style="font-weight: bold">医生列表</div>
      </div>
      <van-list
        v-model="loading"
        :finished=finished
        finished-text="没有更多了"
        @load="select"
      >
        <div v-for="item in docList" :key="item.index">
          <van-card
            :price=item.registrationFee||0
            currency="门诊费："
            @click="click(item.id)"
          >
            <div slot="thumb">
              <van-image
                round
                fit="fill"
                :src=item.docHeadImg
                style="width:88px; height: 80px"
              />
            </div>
            <div slot="title">
              {{item.name}}<span v-if="item.docPosition">，{{item.docPosition}}</span>
            </div>

            <div slot="desc">
              <div class="van-card__desc van-ellipsis">
                科室：{{item.keshi}}
              </div>
              <div class="van-card__desc van-ellipsis">
                简介：{{item.docMark}}
              </div>
            </div>
            <div slot="footer">
              <van-divider />
              <van-button @click.stop="tw(item.id)" icon="chat" plain  size="mini" type="info">图文问诊</van-button>
              <!--<van-button size="mini">图文问诊</van-button>-->
              <!--<van-button size="mini">按钮</van-button>-->
            </div>
          </van-card>
        </div>
      </van-list>
    </div>



  </div>


</template>
<script>
  import Cookies from "js-cookie"
  import { imageUrl } from '@/utils/global'
  import { Grid, GridItem } from 'vant';
  export default {
    name: 'DoctorList',
    data() {
      return {
        docList:[],
        loading: false,
        finished: false,
        map:"",
        departMentOneList:[],
        chooseAfterValue:[],
        idx:-1,
        //是否是从我的医生来的标识
        state:""
      }
    },
    methods: {
      clickTab(item,index){
       this.idx = index
      this.selectDocListWeb(item.departmentOneId)
      },
      selectDocList(state){
        this.findDepartmentOneList()
        let openId = Cookies.get("openId")
          if(state == '1'){
            //查询我的医生列表
            this.$api.gongZhongHao.selectMyDocGZ({openid:openId}).then((res) => {
              if(res.code == 200) {
                let data = res.rows
                for(let i = 0;i<data.length;i++){
                  data[i].docHeadImg = imageUrl+data[i].docHeadImg
                }
                this.docList = data
              }
              this.loading = false
              this.finished = true
            })
          }else{
            this.selectDocListWeb()
          }
          },
      selectDocListWeb(type){
        //查询医生列表
        this.$api.gongZhongHao.selectDocListWeb({type:type?type:''}).then((res) => {
          if(res.code == 200) {
            let data = res.rows
            for(let i = 0;i<data.length;i++){
              if(data[i].docHeadImg){
                data[i].docHeadImg = imageUrl+data[i].docHeadImg
              }

            }
            this.docList = data
          }
          this.loading = false
          this.finished = true
        })
      },
      //加载一级科室
      findDepartmentOneList:function(){
        this.$api.department.findAll().then((res) => {
          // 加载角色集合
          this.departMentOneList = res.rows
        })
      },
      click(id){
        this.$router.push({path: '/doctorDetail', query: {id: id}})
      },
      tw(id){
        this.$router.push({path: '/teletext', query: {id: id}})
      },
      select(){
        let code = this.$route.query.code
        let state = this.$route.query.state
        this.state =state
        if(Cookies.get("openId")){
          this.selectDocList(state)
        }else{
          if(code){
            this.$api.assistant.getOpenId({code:code}).then((res) => {
              if(res.code == '200'){
                Cookies.set("openId",res.rows.openid)
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.selectDocList(state)
              }else{
                //Toast(res.msg)
              }
            })
          }
        }

      }
    },
    mounted() {

    },
    created() {


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
    margin: 5px 6px;
    padding: 4px;
  }
  .choose{
    background:rgb(6, 221, 249);
    color: white;
    border: 0px
  }
  .base1{
    display: flex;
    margin: 11px 9px;
    align-items: center;
    font-weight: 400;
    opacity: 0.87;
    flex-wrap: wrap;
  }
</style>
