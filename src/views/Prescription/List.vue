<template>
  <div class="page-container">
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio" size="medium" @change="change">
        <el-radio-button label="经典处方" ></el-radio-button>
        <el-radio-button label="养生保健处方"></el-radio-button>
      </el-radio-group>
    </div>
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.keywords" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
          </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="pageResult.rows" style="width: 100%">
      <el-table-column type="index" label="序号" >
      </el-table-column>
      <!--		<el-table-column property="id" label="id" >-->
      <!--		</el-table-column>-->
      <el-table-column property="name" label="处方名称" width="200px">
      </el-table-column>
      <el-table-column property="disaster" label="病名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="useful" label="功效" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  @click="detail(scope.row)" type="text" size="small">编辑</el-button>
          <el-button  @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
        <div class="toolbar" style="padding:10px;">
          <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
            :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
          </el-pagination>
        </div>
    <!--详情界面-->
    <el-dialog title="编辑" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.physiqueId" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="pharmacy">
          <el-radio-group v-model="dataForm.pharmacy">
            <el-radio label="1">饮片</el-radio>
            <el-radio label="3">颗粒剂</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="病名" prop="disaster">
          <el-input type="textarea" autosize v-model="dataForm.disaster" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功效" prop="usage">
          <el-input type="textarea" autosize v-model="dataForm.usage" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用法" prop="useful">
          <el-input type="textarea" autosize v-model="dataForm.useful" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="食材" prop="foods">
          <el-input type="textarea" autosize v-model="dataForm.foods" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="add" type="primary">查看药品</el-button>
      </div>
      <div  style="text-align: center" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!--新增药方页-->
    <el-dialog  title="电子处方"  width="90%" :visible.sync="isShow" :close-on-click-modal="false" @close='closeDialog'>
      <el-form :model="medicalForm" label-width="80px" ref="medicalForm" :size="size" label-position="right">
        <el-row v-for="(item,index) in medicalForm.medicalList" :key="index">
          <el-col :span="5">
            <el-form-item label="药名" :prop="'medicalList.' + index + '.name'" :rules="{
                      required: true, message: '药名不能为空', trigger: 'blur'
                    }">
              <el-autocomplete style="width:100%"
                               v-model="item.name"
                               :fetch-suggestions="querySearch"
                               placeholder="请输入药名"
                               @select="((item)=>{handleSelect(item, index)})"
                               :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="数量" :prop="'medicalList.' + index + '.number'" :rules="{
                      required: true, message: '药名不能为空', trigger: 'blur'
                    }">
              <el-input type="number" v-model="item.number" v-on:input="((val)=>{handlerNumber(val, index)})">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="item.unit" disabled auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="金额" prop="amount">
              <el-input v-model="item.amount"  disabled auto-complete="off">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="price">
              <el-button @click="addMedical" type="primary">新增</el-button>
              <el-button @click.prevent="removeMedical(item.id,index)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center">
        <el-button :size="size" @click.native="isShow = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitMedicalForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import { timestampToTime } from "@/utils/datetime"
  import { baseUrl } from '@/utils/global'
  export default {
    components:{
      PopupTreeInput,
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        down(row){
          return "http://39.106.123.28/images/"+row.fileUrl
        },
        isShow:false,
        radio:'经典处方',
        activeName:"1",
        size: 'small',
        type:'1',
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        filters:{

        },
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataForm:{
          id:'',
          name:'',
          disaster:'',
          pharmacy:'',
          usage:'',
          useful:'',
          foods:'',
          type:''
        },
        medicalForm:{
          medicalList:[],
        },
        fileList:[],
        dataFormRules: {
          title: [
            { required: true, message: '请输入主题', trigger: 'blur' }
          ]
        },
        restaurants:[]

      }
    },
    methods: {
      submitForm(){
        this.dataForm.type = this.type
        this.$api.healthHouseKeeper.addMedicById(this.dataForm).then((res) => {
          if(res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.dialogVisible = false
            this.findPage(null)
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        }).then()

      },
      handleAdd(){
        this.dialogVisible = true
        this.dataForm = {
          id:'',
          name:'',
          disaster:'',
          usage:'',
          useful:'',
          foods:''
        }
      },
      del(row){
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.$api.healthHouseKeeper.deletetMedicById({id:row.id}).then((res) => {
            if(res.code == 200) {
              this.$message({ message: '操作成功', type: 'success' })
              this.findPage(null)
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
          })
        })
      },
      // 编辑
      submitMedicalForm: function () {
        for(let a of this.medicalForm.medicalList){
          a.recipelId = this.dataForm.id
        }
        this.$refs.medicalForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              console.log(this.medicalForm.medicalList)
              this.$api.healthHouseKeeper.addRecipelMedicById(this.medicalForm.medicalList).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShow = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                // this.findMedicalPage(null)
              })
            })
          }
        })
      },
      handlerNumber(val,index){
        if(this.medicalForm.medicalList[index].price&&val){
          this.medicalForm.medicalList[index].amount =
            (Number.parseFloat(val)*Number.parseFloat(this.medicalForm.medicalList[index].price)).toFixed(2)
        }
      },
      //加载中医库
      zhongyi(type){
        if(type == 3){
          type = 4
        }
        this.$api.healthHouseKeeper.selectList({type:type}).then((res) => {
          if(res.code == '200'){
            this.restaurants = res.rows
            this.restaurants = this.restaurants.map(obj => {
              return{
                ...obj,
                value:obj.name
              }
            })

          }
        })
      },
      //远程搜索中医库
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelect(item,index) {
        this.medicalForm.medicalList[index].tcmId = item.id
        this.medicalForm.medicalList[index].unit = item.unit
        this.medicalForm.medicalList[index].price = item.price
        this.medicalForm.medicalList[index].number = ""
        this.medicalForm.medicalList[index].amount = ""
        // this.medicalForm.medicalList.splice(index,1,{
        //   name:item.name,
        //   unit:item.unit,
        //   price:item.price
        // })
      },
      closeDialog(){
        this.medicalForm.medicalList = [{
          id:'',
          name:'',
          number:'',
          unit:'',
          price:'',
          amount:'',
          entrust:''
        }]
      },
      removeMedical(id,index){
        if(this.medicalForm.medicalList.length==1){
          this.$message({message: '至少保留一项', type: 'error'})
        }else{
          this.medicalForm.medicalList.splice(index,1)
        }
      },
      addMedical(){
        this.medicalForm.medicalList.push(
          {
            id:'',
            name:'',
            number:'',
            unit:'',
            price:'',
            amount:'',
            entrust:''
          }
        )
      },
      add(){
        if(!this.dataForm.id){
          this.$message({message: '请先保存基本信息 ', type: 'error'})
          return
        }
        this.zhongyi(this.dataForm.pharmacy)
        this.$api.healthHouseKeeper.selectMedicById({id:this.dataForm.id}).then((res) => {
          if(res.rows.length>0){
            this.medicalForm.medicalList = res.rows
          }else if(res.rows.length==0 && this.medicalForm.medicalList.length == 0){
            this.medicalForm.medicalList.push({
              id:'',
              name:'',
              number:'',
              unit:'',
              price:'',
              amount:'',
              entrust:''
            })
          }
        }).then()
        this.isShow = true
      },
      detail(row){

        this.$api.healthHouseKeeper.selectByIdRecipelList({id:row.id}).then((res) => {
          this.dialogVisible = true
          this.dataForm = res.rows
          // this.zhongyi(res.rows.pharmacy)
        }).then()

      },
      change(value){
        console.log(value)
        if('经典处方'==value){
          this.type = '1'
          this.findPage(null)
        }else if('养生保健处方' == value){
          this.type = '3'
          this.findPage(null)
        }
      },
      selectMecicalConditionList(physiqueId,type){
        this.$api.physique.selectMedicalConditionById({id:physiqueId,type:type}).then((res) => {
          if(res.code == 200) {
            if(type == '1'){
              this.pageTab1Result = res
            }else if(type == '2'){
              this.pageTab2Result = res
            }else if(type == '3'){
              this.pageTab3Result = res
            }else if(type == '4'){
              this.pageTab4Result = res
            }
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        })
      },

      findPage: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {type: {name:'type', value:this.type}}
        if(this.filters.keywords){
          this.pageRequest.columnFilters.keywords = {name:'keywords',value:this.filters.keywords}
        }
        this.$api.healthHouseKeeper.selectRecipelList(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data!=null?data.callback:'')
      },
      refreshPageRequest: function(pageNum){
        this.pageRequest.pageNum  = pageNum
        this.findPage(null)
      }

    },
    mounted() {
      this.findPage(null);
    }
  }
</script>

<style >
  .demo .el-form-item__label{
    text-align: right;
    float: left;
    font-weight: bold;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .demo .el-form-item__content{
    text-align: left
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 98px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 48%;
  }

</style>
