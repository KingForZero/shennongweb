<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-date-picker
            v-model="dateCondition"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <!--   <el-form-item>
             <kt-button icon="fa fa-plus" :label="$t('action.supplementaryMedicalRecords')" perms="sys:user:add" type="primary" @click="handleAdd" />
           </el-form-item>-->
      </el-form>
    </div>
    
    <!--表格内容栏-->
    <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"   :showOperation="false" :showAssistantWorkbenchMyDoctor="false"
              :data="pageResult" :columns="filterColumns"
              @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
    </kt-table>
   
  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import { format,formatTimeStr } from "@/utils/datetime"

  export default {
    components:{
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        size: 'small',
        isDoc:false,
        isAssistant:false,
        isKeeper:false,
        isCustomer:false,
        isFee:true,
        currentIndex:0,
        remarkArr:[],
        filters: {
          docId: ''
        },
        columns: [],
        filterColumns: [],
        columnFilters:{},
        pageRequest: { pageNum: 1, pageSize: 10},
        pageResult: {},
        currentUserId:{},
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          name: '',
          password: '123456',
          tel: '13889700023',
          age:'',
          sex:'',
          address:'',
          workAddress:'',
          graduateSchool:'',
          status: 1,
          userRoles: [],
          docDepartmentOne:'',
          docDepartment:'',
          docLevel:"1",
          registrationFee:'',
          docHospital:'',
          docMark:''
        },
        deptData: [],
        roles: [],
        departMentOneList:[],
        departMentTwoList:[],
        dateCondition:'',
        startTime:'',
        endTime:''
      }
    },
    methods: {
      //获取文档内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        console.log(content);
        alert(content);
      },
      changeDepartmentTwo: function(data){

        this.$api.department.findDepartmentTwoByid({"departmentOneId":data}).then((res) => {
          // 加载角色集合
          this.departMentTwoList = res.rows

        })
      },
      isFeeFun:function(data){

        if(data==0){
          this.isFee = false
        }else if(data == 1){
          this.isFee = true
        }
      },
      isDocFun:function(data){
        if(this.currentIndex==data.length){
          this.currentIndex = 0

          if(this.remarkArr.indexOf("医生")>-1){
            this.isDoc = true
          }else{
            this.isDoc = false
          }
          if(this.remarkArr.indexOf("助理")>-1){
            this.isAssistant = true
          }else{
            this.isAssistant = false
          }
          if(this.remarkArr.indexOf("健康管家")>-1){
            this.isKeeper = true
          }else{
            this.isKeeper = false
          }

          this.remarkArr = []
          return
        }
        let id = data[this.currentIndex]

        this.$api.role.findById({"roleId":id}).then((res) => {
          this.remarkArr.push(res.rows.remark)
          this.currentIndex++
          //console.log(res.rows.remark)
          this.isDocFun(data)
        }).then(data!=null?data.callback:'')

        ;

      },
      // 获取分页数据
      findPage: function (data) {
        console.log(this.dateCondition)
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        // this.pageRequest.columnFilters = {assisantId: {name:'assisantId', value:this.filters.assisantId}}
        if(this.dateCondition.length!=0){
          this.columnFilters.startTime = {name:'startTime', value:formatTimeStr(this.dateCondition[0])}
          this.columnFilters.endTime = {name:'endTime', value:formatTimeStr(this.dateCondition[1])}

          this.pageRequest.columnFilters=this.columnFilters;
          // this.pageRequest.columnFilters.endTime= {name:'endTime', value:formatTimeStr(this.dateCondition[1])};
        }
        this.$api.doctor.findPageForWorkLoad(this.pageRequest).then((res) => {
          this.pageResult = res
          // this.findDepartmentOneList()
          //加载弹出框的用户角色
          // this.findUserRoles()
        }).then(data!=null?data.callback:'')
      },
      //加载一级科室
      findDepartmentOneList:function(){
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
        this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true

      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.dialogVisible = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)
        let userRoles = []
        for(let i=0,len=params.row.userRoles.length; i<len; i++) {
          userRoles.push(params.row.userRoles[i].roleId)
        }
        this.dataForm.userRoles = userRoles
      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              let userRoles = []
              for(let i=0,len=params.userRoles.length; i<len; i++) {
                let userRole = {
                  userId: params.id,
                  roleId: params.userRoles[i]
                }
                userRoles.push(userRole)
              }
              params.userRoles = userRoles
              this.$api.user.save(params).then((res) => {
                this.editLoading = false
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
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
      deptTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.id
        this.dataForm.deptName = data.name
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
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
           {prop:"name", label:"医生姓名", minWidth:50},
          {prop:"count", label:"处理病人数量", minWidth:50},
          {prop:"drugAmount", label:"门诊费用", minWidth:50},
          {prop:"feeAmount", label:"药品费用", minWidth:50},
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
