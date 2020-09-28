<template>
    <div style="text-align: center;padding-top: 176px;">
      <van-image
        width="200"
        height="200"
        :src=imageUrl
      />
      <div>
        长按图片分享公众号
      </div>
    </div>
</template>

<script>
  import Cookies from "js-cookie"
    export default {
        name: "Share",
      data() {
        return {
            imageUrl:"https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQHy7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyS2hmcmRRX2thTF8xMDAwME0wN1UAAgTbfHFfAwQAAAAA"
        }
      },
      methods: {
        getPicUrl(openId,state){
          //根据id查询
          this.$api.gongZhongHao.getTicketByOpenId({"openId":openId,"state":state}).then((res) => {
            if(res.code == 200) {
              this.imageUrl = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+res.rows
            }else{

            }
          })
        },
        onLoad(){
          console.log("aaa");
          let code = this.$route.query.code
          let state = this.$route.query.state
          if(state){
            Cookies.set("state",state)
          }
          if(code){
            //state为1代表上医云的公众号 2代表北美容大的公众号
            if(state == '1'){
              this.$api.assistant.getOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.getPicUrl(res.rows.openid,state)
              })
            }else if(state == '2'){
              this.$api.assistant.getYingYangOpenId({code:code}).then((res) => {
                if(res.rows.openid){
                  Cookies.set("openId",res.rows.openid)
                }
                //获取邀请人id
                if(res.rows.fromId){
                  Cookies.set("fromId",res.rows.fromId)
                }
                this.getPicUrl(res.rows.openid,state)
              })
            }
          }
        }
      },
      mounted() {
       //this.onLoad()
      },

    }
</script>

<style scoped>

</style>
