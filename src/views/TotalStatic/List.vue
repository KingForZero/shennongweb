<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-date-picker
              v-model="value1"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
          </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-plus" label="导出"  type="primary" @click="derive()"/>
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
      <el-table-column property="docName" label="姓名">
      </el-table-column>
      <el-table-column property="total" label="开单金额">
      </el-table-column>
      <el-table-column property="docTotal" label="一级邀请医生开单金额">
      </el-table-column>
      <el-table-column property="erjiDocTotal" label="二级邀请医生开单金额">
      </el-table-column>
      <!--<el-table-column label="状态" prop="status" :formatter="recordStateFormatter"></el-table-column>-->
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

    <el-dialog title="记录详情" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-tabs>
        <el-tab-pane label="我的记录">
          <el-table :data="recordList.myList" style="width: 100%">
            <el-table-column property="userName" label="姓名">
            </el-table-column>
            <el-table-column property="total" label="金额">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="一级邀请记录">
          <el-table :data="recordList.shareDocList" style="width: 100%">
            <el-table-column property="docName" label="姓名">
            </el-table-column>
            <el-table-column property="total" label="金额">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="二级邀请记录">
          <el-table :data="recordList.erjiShareDocList" style="width: 100%">
            <el-table-column property="docName" label="姓名">
            </el-table-column>
            <el-table-column property="total" label="金额">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: [],
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
      derive(){
        let userId = JSON.parse(sessionStorage.getItem("employee")).id
        window.location.href="http://localhost:8080/bussiness/medicalRecords/exportStatic?userId="+userId
      },
      detail(row){
        if(this.value1){
          this.filters.startTime  = this.value1[0]
          this.filters.endTime  = this.value1[1]
        }else{
          this.filters.startTime  = ""
          this.filters.endTime  = ""
        }
        this.$api.healthHouseKeeper.selectTotalDetailByDocId({docId:row.docId,startTime:this.filters.startTime,endTime:this.filters.endTime}).then((res) => {
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
        if(this.value1){
          this.filters.startTime  = this.value1[0]
          this.filters.endTime  = this.value1[1]
        }else{
          this.filters.startTime  = ""
          this.filters.endTime  = ""
        }

        if(this.filters.startTime){
          this.pageRequest.columnFilters.startTime = {name:'startTime',value:this.filters.startTime}
        }
        if(this.filters.endTime){
          this.pageRequest.columnFilters.endTime = {name:'endTime',value:this.filters.endTime}
        }
        this.$api.healthHouseKeeper.totalStatic(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data!=null?data.callback:'')
      },
      refreshPageRequest: function(pageNum){
        this.pageRequest.pageNum  = pageNum
        this.findPage(null)
      },

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
