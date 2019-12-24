<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.tel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
		<!--	<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>-->
		</el-form>
	</div>
	<!--<div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
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
		&lt;!&ndash;表格显示列界面&ndash;&gt;
		<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns"
			@handleFilterColumns="handleFilterColumns">
		</table-column-filter-dialog>
	</div>-->
	<!--&lt;!&ndash;表格内容栏&ndash;&gt;
	<kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"  showOperation="false" showAssistantWorkbenchMyDoctor="false"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	&lt;!&ndash;新增编辑界面&ndash;&gt;
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="头像" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" type="password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="tel">
				<el-input v-model="dataForm.tel" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="dataForm.age" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="家庭地址" prop="address">
				<el-input v-model="dataForm.address" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="工作地址" prop="workAddress">
				<el-input v-model="dataForm.workAddress" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="毕业院校" prop="graduateSchool">
				<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色" prop="userRoles">
				<el-select v-model="dataForm.userRoles" multiple placeholder="请选择"
					 style="width: 100%;" @change="isDocFun">
					<el-option v-for="item in roles" :key="item.id"
						:label="item.remark" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<template v-if="isDoc">
				<el-form-item label="一级科室" prop="graduateSchool">
					<el-select v-model="dataForm.docDepartmentOne"  placeholder="请选择"
					 style="width: 100%;" @change="changeDepartmentTwo">
					<el-option v-for="item in departMentOneList" :key="item.departmentOneId"
						:label="item.departmentOneName" :value="item.departmentOneId">
					</el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="二级科室" prop="graduateSchool">
					<el-select v-model="dataForm.docDepartment"   placeholder="请选择"
					 style="width: 100%;" >
					<el-option v-for="item in departMentTwoList" :key="item.departmentTwoId"
						:label="item.departmentTwoName" :value="item.departmentTwoId">
					</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="是否收费" prop="graduateSchool" >
					<el-radio-group v-model="dataForm.docLevel" @change="isFeeFun">
						<el-radio label="0">免费</el-radio>
						<el-radio label="1">收费</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="isFee">
					<el-form-item label="挂号费" prop="graduateSchool">
						<el-input v-model="dataForm.registrationFee" auto-complete="off"></el-input>
					</el-form-item>
				</template>
				<el-form-item label="所在医院" prop="graduateSchool">
					<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="医生资质证明" prop="graduateSchool">
					<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="graduateSchool">
					<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
				</el-form-item>
			</template>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>-->
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
      <el-tab-pane label="健康管家" name="first">
        <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"  :showOperation="false" :showAssistantWorkbenchMyDoctor="false"
                  :data="pageResult" :columns="filterColumns"
                  @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </kt-table>
      </el-tab-pane>
      <el-tab-pane label="助理" name="second">
        <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"  :showOperation="false" :showAssistantWorkbenchMyDoctor="false"
                  :data="pageResult" :columns="filterColumns"
                  @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </kt-table>
      </el-tab-pane>
      <el-tab-pane label="医生" name="third">
        <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"  :showOperation="false" :showAssistantWorkbenchMyDoctor="false"
                  :data="pageResult" :columns="filterColumns"
                  @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
        </kt-table>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>


<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
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
      activeName2: 'first',
			isDoc:false,
			isAssistant:false,
			isKeeper:false,
			isCustomer:false,
			isFee:true,
			currentIndex:0,
			remarkArr:[],
			filters: {
        roleId: '',
        tel:''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

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

				status: 1,
				userRoles: [],
				docDepartmentOne:'',
				docDepartment:'',
				docLevel:"1",
				registrationFee:''
			},
			deptData: [],
			roles: [],
			departMentOneList:[],
			departMentTwoList:[],
		}
	},
	methods: {
		changeDepartmentTwo: function(data){

			this.$api.department.findDepartmentTwoByid({"departmentOneId":data}).then((res) => {
				// 加载角色集合
				this.departMentTwoList = res.rows

			})
		},
    handleClick(tab, event) {
      console.log(tab, event)
      if(tab.index=="0"){
        console.log("0");
        this.filters.roleId=1;
        this.findPage(null);
      }else if(tab.index=="1"){
        console.log("1");
        this.filters.roleId=3;
        this.findPage(null);
      }else if(tab.index=="2"){
        console.log("2");
        this.filters.roleId=2;
        this.findPage(null);
      }

      // this.findPage(null)
      // this.initColumns2()
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
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			//第一次加载，默认是健康管家
			if(this.filters.roleId==''){
        this.filters.roleId=1;
      }

			this.pageRequest.columnFilters = {roleId: {name:'roleId', value:this.filters.roleId},tel:{name:'tel', value:this.filters.tel}}
			this.$api.assistant.myTeam(this.pageRequest).then((res) => {
			  console.log(res.rows);
				this.pageResult = res
				// this.findDepartmentOneList()
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
				{prop:"address", label:"id", minWidth:50},
				{prop:"name", label:"姓名", minWidth:120},
				{prop:"tel", label:"电话", minWidth:100},
				{prop:"docMark", label:"描述", minWidth:100},
				// {prop:"createBy", label:"创建人", minWidth:120},
				// {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	}
,
    initColumns2: function () {
      this.columns = [
        {prop:"id", label:"ID", minWidth:50},
        {prop:"name", label:"123", minWidth:120},
        {prop:"roleNames", label:"456", minWidth:100},
        {prop:"tel", label:"789", minWidth:100},
        // {prop:"createBy", label:"创建人", minWidth:120},
        // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    }
	},
	mounted() {
		//this.findDeptTree()
		this.initColumns()
	}
}
</script>

<style scoped>

</style>
