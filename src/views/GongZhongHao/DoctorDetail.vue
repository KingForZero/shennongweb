<template>
  <div>
    <van-card
      :price=data.registrationFee
      currency="门诊费："
    >
      <div slot="thumb">
        <van-image
          round
          fit="fill"
          :src=data.docHeadImg
          style="width:88px; height: 80px"
        />
      </div>
      <div slot="title">
        {{data.name}}
      </div>

      <div slot="desc">
        <div class="van-card__desc van-ellipsis">
          性别：<span v-if="data.sex == 0">男</span><span v-if="data.sex == 1">女</span>
        </div>
        <div class="van-card__desc van-ellipsis">
          职称：{{data.docPosition}}
        </div>
        <div class="van-card__desc van-ellipsis">
          科室：{{data.keshi}}
        </div>
      </div>
      <div slot="footer">
        <van-divider />
      </div>
    </van-card>
      <h4 class="van-doc-demo-block__title">简介</h4>
      <div class="van-cell__label" style="margin: 16px;">
        {{data.docMark}}
      </div>
    <h4 class="van-doc-demo-block__title">企业微信</h4>
    <div class="van-cell__label" style="margin: 16px;">
      长按图片添加医生企业微信，有助于详细判断您的病情
      <van-image
        width="100"
        height="100"
        :src=data.contactMeQr
      />
    </div>

    <van-tabbar>

      <van-submit-bar
        label="问诊费："
        :price=(data.registrationFee||0)*100
        button-text="图文问诊"
        @submit="onSubmit"
        style="background-color: #f2f3f5"
      >
      </van-submit-bar>
    </van-tabbar>
  </div>

</template>
<script>
  import Cookies from "js-cookie"
  import { imageUrl } from '@/utils/global'
  export default {
    name: 'DoctorDetail',
    data() {
      return {
        data:{}
      }
    },
    methods: {
      selectById(){
        let id =  this.$route.query.id
        //根据id查询
        this.$api.gongZhongHao.selectById({"id":id}).then((res) => {
          if(res.code == 200) {
            this.data = res.rows
            this.data.docHeadImg = imageUrl+this.data.docHeadImg
            this.data.contactMeQr = imageUrl + this.data.contactMeQr
            console.log(this.data.registrationFee)
          }

        })
      },
      onSubmit(){
        this.$router.push({path: '/teletext', query: {id: this.data.id}})
      }
    },
    mounted() {
      this.selectById()
    }
  }
</script>
