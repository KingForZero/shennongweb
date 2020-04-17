<template>
    <div >
      <div style="text-align: center">
        <h3>健康评估</h3>
      </div>
      <div class="back" >
        <div style="display: flex">
          <div style="width: 3px;height: 20px;background-color: #4DD0E1"></div><div style="font-weight: 500">基本信息</div>
        </div>
        <div style="display: flex">
          <div>姓名：张三</div>
          <div>身高：张三</div>
        </div>

      </div>
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
    </div>
</template>

<script>
    export default {
        name: "HealthAssessment"
    }
</script>

<style scoped>
.back {
  margin:0 auto;
  width:90%;
  height:290px;
  background:rgba(255,255,255,1);
  box-shadow:-5px -2px 39px 1px rgba(195,195,195,0.34);
  border-radius:10px;
}
</style>
