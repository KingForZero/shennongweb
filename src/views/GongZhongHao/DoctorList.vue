<template>
  <van-list
    v-model="loading"
    :finished=finished
    finished-text="没有更多了"
    @load="selectDocList"
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

</template>
<script>
  import Cookies from "js-cookie"
  import { imageUrl } from '@/utils/global'
  export default {
    name: 'DoctorList',
    data() {
      return {
        docList:[],
        loading: false,
        finished: false,
        map:""
      }
    },
    methods: {
      selectDocList(state){
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
            //查询医生列表
            this.$api.gongZhongHao.selectDocListWeb().then((res) => {
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
          }
          },

      click(id){
        this.$router.push({path: '/doctorDetail', query: {id: id}})
      },
      tw(id){
        this.$router.push({path: '/teletext', query: {id: id}})
      }
    },
    mounted() {
    },
    created() {
      let code = this.$route.query.code
      let state = this.$route.query.state
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
</script>
