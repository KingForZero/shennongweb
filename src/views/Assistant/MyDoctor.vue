<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.assisantId" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary"
                     @click="findPage(null)"/>
        </el-form-item>
        <!--  <el-form-item>
            <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
          </el-form-item>-->
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="findPage(null)"></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"
                                  @handleFilterColumns="handleFilterColumns">
      </table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete" :showOperation="false"
              :showAssistantWorkbenchMyDoctor="true"
              :data="pageResult" :columns="filterColumns"
              @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @lookDoctorWorkTime="lookDoctorWorkTime">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'修改会诊时间'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="docId" v-if="false">
          <el-input v-model="dataForm.docId" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会诊时间" prop="workDay">
          <el-input v-model="dataForm.workDay" auto-complete="off" placeholder="多个逗号隔开，如:11,22,33"></el-input>
        </el-form-item>

        <el-form-item label="上午:" prop="amStartTime"  >
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.amStartTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '12:00'
            }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.amEndTime"
            :picker-options="{
               start: '08:30',
              step: '00:15',
              end: '12:00',
              minTime: dataForm.amStartTime
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="下午:" prop="pmStartTime" >
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.pmStartTime"
            :picker-options="{
              start: '12:30',
              step: '00:15',
              end: '18:30'
            }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.pmEndTime"
            :picker-options="{
              start: '12:30',
              step: '00:15',
              end: '18:30',
              minTime: dataForm.pmStartTime
            }">
          </el-time-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">
          {{$t('action.submit')}}
        </el-button>
      </div>
    </el-dialog>


<!--查看会诊时间-->
    <el-dialog :title="operation?'新增':'查看会诊时间'" width="40%" :visible.sync="workTimeDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataWorkTime" label-width="80px" :rules="dataFormRules" ref="dataWorkTime" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="docId" v-if="false">
          <el-input v-model="dataWorkTime.docId" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会诊时间" prop="workDay">
          <el-input disabled v-model="dataWorkTime.workDay" auto-complete="off" placeholder="多个逗号隔开，如:11,22,33"></el-input>
        </el-form-item>

        <el-form-item label="上午:" prop="amStartTime"  >
          <el-time-select disabled
            placeholder="起始时间"
            v-model="dataWorkTime.amStartTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '12:00'
            }">
          </el-time-select>
          <el-time-select disabled
            placeholder="结束时间"
            v-model="dataWorkTime.amEndTime"
            :picker-options="{
               start: '08:30',
              step: '00:15',
              end: '12:00',
              minTime: dataWorkTime.amStartTime
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="下午:" prop="pmStartTime" >
          <el-time-select disabled
            placeholder="起始时间"
            v-model="dataWorkTime.pmStartTime"
            :picker-options="{
              start: '12:30',
              step: '00:15',
              end: '18:30'
            }">
          </el-time-select>
          <el-time-select disabled
            placeholder="结束时间"
            v-model="dataWorkTime.pmEndTime"
            :picker-options="{
              start: '12:30',
              step: '00:15',
              end: '18:30',
              minTime: dataWorkTime.pmStartTime
            }">
          </el-time-select>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import {format, formatTimeStr} from "@/utils/datetime"

  export default {
    components: {
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        size: 'small',
        isDoc: false,
        isAssistant: false,
        isKeeper: false,
        isCustomer: false,
        isFee: true,
        currentIndex: 0,
        remarkArr: [],
        filters: {
          assisantId: ''
        },
        columns: [],
        filterColumns: [],
        pageRequest: {pageNum: 1, pageSize: 10},
        pageResult: {},
        currentUserId: {},
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        workTimeDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
            workDay: [
              {required: true, message: '请输入会诊时间', trigger: 'blur'}
            ],
            amStartTime: [
              {required: true, message: '请输入上午开始时间', trigger: 'blur'}
            ],
            amEndTime: [
              {required: true, message: '请输入上午结束时间', trigger: 'blur'}
            ],
            pmStartTime: [
              {required: true, message: '请输入下午开始时间', trigger: 'blur'}
            ],
            pmEndTime: [
              {required: true, message: '请输入下午结束时间', trigger: 'blur'}
            ],

        },
        // 新增编辑界面数据
        dataForm: {
          docId: 0,
          workDay: '123',
          amStartTime: '123456',
          amEndTime: '13889700023',
          pmStartTime: '123',
          pmEndTime: '123'
        },
        dataWorkTime:{
          docId: 0,
          workDay: '123',
          amStartTime: '123456',
          amEndTime: '13889700023',
          pmStartTime: '123',
          pmEndTime: '123'
        },
        deptData: [],
        roles: [],
        departMentOneList: [],
        departMentTwoList: [],
      }
    },
    methods: {
      changeDepartmentTwo: function (data) {

        this.$api.department.findDepartmentTwoByid({"departmentOneId": data}).then((res) => {
          // 加载角色集合
          this.departMentTwoList = res.rows

        })
      },
      isFeeFun: function (data) {

        if (data == 0) {
          this.isFee = false
        } else if (data == 1) {
          this.isFee = true
        }
      },
      isDocFun: function (data) {
        if (this.currentIndex == data.length) {
          this.currentIndex = 0

          if (this.remarkArr.indexOf("医生") > -1) {
            this.isDoc = true
          } else {
            this.isDoc = false
          }
          if (this.remarkArr.indexOf("助理") > -1) {
            this.isAssistant = true
          } else {
            this.isAssistant = false
          }
          if (this.remarkArr.indexOf("健康管家") > -1) {
            this.isKeeper = true
          } else {
            this.isKeeper = false
          }

          this.remarkArr = []
          return
        }
        let id = data[this.currentIndex]

        this.$api.role.findById({"roleId": id}).then((res) => {
          this.remarkArr.push(res.rows.remark)
          this.currentIndex++
          //console.log(res.rows.remark)
          this.isDocFun(data)
        }).then(data != null ? data.callback : '')

        ;

      },
      // 获取分页数据
      findPage: function (data) {
        this.currentUserId = JSON.parse(sessionStorage.getItem('employee'))
        console.log(this.currentUserId.id)
        if (data !== null) {
          this.pageRequest = data.pageRequest
          // this.pageRequest.assisantId = this.currentUserId.id
        }
        // this.pageRequest.columnFilters = {assisantId: {name:'assisantId', value:this.filters.assisantId}}
        this.pageRequest.assisantId = this.currentUserId.id
        this.$api.assistant.findPage(this.pageRequest).then((res) => {
          this.pageResult = res
          // this.findDepartmentOneList()
          //加载弹出框的用户角色
          // this.findUserRoles()
        }).then(data != null ? data.callback : '')
      },
      //加载一级科室
      findDepartmentOneList: function () {
        this.$api.department.findAll().then((res) => {
          // 加载角色集合
          this.departMentOneList = res.rows
        })
      },
      // 加载用户角色信息
      findUserRoles: function () {
        this.$api.role.findAll().then((res) => {
          // 加载角色集合
          this.roles = res.rows
        })
      },
      // 批量删除
      handleDelete: function (data) {
        this.$api.user.batchDelete(data.params).then(data != null ? data.callback : '')
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true

      },
      //查看会诊时间
      lookDoctorWorkTime:function (params){
        this.workTimeDialogVisible = true
        this.operation = false
        this.$api.assistant.selectDocWorkTimeById({"docId": params.row.id}).then((res) => {
          // 加载时间问题
          console.log(JSON.stringify(res.rows.amStartTime))
          this.dataWorkTime = Object.assign({}, res.rows)
        })
      },
      // 显示编辑界面
      handleEdit: function (params) {
        console.log("编辑222");
        this.dialogVisible = true
        this.operation = false
        console.log(params.row);
        this.$api.assistant.selectDocWorkTimeById({"docId": params.row.id}).then((res) => {
          // 加载时间问题
          console.log("查询医生id::"+res.rows)
          this.dataForm = Object.assign({}, res.rows)
          this.dataForm.docId=params.row.id
        })
        // this.dataForm = Object.assign({}, params.row)
        // let userRoles = []
        // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
        //   userRoles.push(params.row.userRoles[i].roleId)
        // }
        // this.dataForm.userRoles = userRoles

      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              // let userRoles = []
              // for(let i=0,len=params.userRoles.length; i<len; i++) {
              //   let userRole = {
              //     userId: params.id,
              //     roleId: params.userRoles[i]
              //   }
              //   userRoles.push(userRole)
              // }
              // params.userRoles = userRoles
              this.$api.assistant.updateDocWorkTime(params).then((res) => {
                this.editLoading = false
                if (res.code == 200) {
                  this.$message({message: '操作成功', type: 'success'})
                  this.dialogVisible = false
                  this.$refs['dataWorkTime'].resetFields()
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findPage(null)
              })
            })
          }
        })
      },
      // 获取部门列表
      // findDeptTree: function () {
      // 	this.$api.dept.findDeptTree().then((res) => {
      // 		this.deptData = res.data
      // 	})
      // },
      // 菜单树选中
      // deptTreeCurrentChangeHandle (data, node) {
      //   this.dataForm.deptId = data.id
      //   this.dataForm.deptName = data.name
      // },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
      // 处理表格列过滤显示
      displayFilterColumnsDialog: function (filterColumns) {
        this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      },
      // 处理表格列过滤显示
      handleFilterColumns: function (data) {
        this.filterColumns = data.filterColumns
        this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      },
      // 处理表格列过滤显示
      initColumns: function () {
        this.columns = [
          {prop: "id", label: "ID", minWidth: 50},
          {prop: "name", label: "姓名", minWidth: 50},
          {prop: "name", label: "电话", minWidth: 50},
          // {prop: "name", label: "会诊时间", minWidth: 50},
          {prop: "name", label: "医生详情", minWidth: 50},
          // //{prop:"deptName", label:"机构", minWidth:120},
          // {prop:"roleNames", label:"角色", minWidth:100},
          // //{prop:"email", label:"邮箱", minWidth:120},
          // {prop:"tel", label:"手机", minWidth:100},
          // {prop:"status", label:"状态", minWidth:70},
          // {prop:"createBy", label:"创建人", minWidth:120},
          // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      },
    },
    mounted() {
      //this.findDeptTree()
      this.initColumns()
    }
  }
</script>

<style scoped>

</style>
