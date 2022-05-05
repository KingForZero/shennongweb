<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.tel" placeholder="电话"></el-input>
          </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
          </el-form-item>
        <!--<el-form-item>-->
          <!--<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />-->
        <!--</el-form-item>-->
      </el-form>
    </div>

    <el-table :data="pageResult.rows" style="width: 100%">
      <el-table-column type="index" label="序号" >
      </el-table-column>
      <!--		<el-table-column property="id" label="id" >-->
      <!--		</el-table-column>-->
      <el-table-column property="tel" label="电话">
      </el-table-column>
      <el-table-column property="name" label="姓名">
      </el-table-column>

      <el-table-column label="状态" prop="status" :formatter="recordStateFormatter"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button  @click="detail(scope.row)" type="text" size="small">查看记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
      </el-pagination>
    </div>

    <el-dialog title="开单记录" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-table :data="recordList" style="width: 100%">
        <el-table-column type="index" label="序号" >
        </el-table-column>
        <!--		<el-table-column property="id" label="id" >-->
        <!--		</el-table-column>-->
        <el-table-column property="userName" label="姓名">
        </el-table-column>
        <el-table-column property="drugAmount" label="药费">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter">
        </el-table-column>
      </el-table>
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
          return "http://baxitang.com/images/"+row.fileUrl
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
        recordList:[],
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

      detail(row){

        this.$api.healthHouseKeeper.selectByUserIdWeb({userId:row.userId}).then((res) => {
          this.dialogVisible = true
          this.recordList = res.rows
        }).then()

      },
      timeFormatter:function(row) {
        return timestampToTime(row.createTime)
      },
      findPage: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {}
        if(this.filters.tel){
          this.pageRequest.columnFilters.tel = {name:'tel',value:this.filters.tel}
        }
        if(this.filters.name){
          this.pageRequest.columnFilters.name = {name:'name',value:this.filters.name}
        }
        this.$api.healthHouseKeeper.selectListShare(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data!=null?data.callback:'')
      },
      refreshPageRequest: function(pageNum){
        this.pageRequest.pageNum  = pageNum
        this.findPage(null)
      },
      //医疗记录状态格式化
      recordStateFormatter:function(row){
        switch (row.status){
          case '0':
            return "已邀请";
          case '1':
            return "已注册";
          case '2':
            return "审核通过";
          case '3':
            return "审核不通过";
          case '4':
            return "已下单";
        }
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
