<template>
  <div>
    <div v-if="JSON.stringify(this.wuliuList) !== '{}'">
      <van-tabs v-model="active">
        <van-tab :title="'物流'+(++index)" v-for="(value, key,index) in wuliuList" :key="key" >
          <van-steps direction="vertical" :active="0">
            <van-step v-for="item in value" :key="item.ftime">
              <h3>{{item.context}}</h3>
              <p>{{item.ftime}}</p>
            </van-step>
          </van-steps>
        </van-tab>
      </van-tabs>
    </div>
    <div v-else>
      <van-empty description="暂无数据"/>
    </div>
  </div>

</template>
<script>
  import Cookies from "js-cookie"
  import { imageUrl } from '@/utils/global'
  export default {
    name: 'Wuliu',
    data() {
      return {
        active:0,
        recordId:'',
        wuliuList:{},
      }
    },
    methods: {
      selectWuliu(recordId){
        this.$api.assistant.wuliu({"recordId":recordId}).then((res) => {
          if(res.code == 200) {
            this.wuliuList = res.rows
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        })
      }
    },
    mounted() {
      this.recordId = this.$route.query.recordId
      this.selectWuliu(this.recordId)
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
