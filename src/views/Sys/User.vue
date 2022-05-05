<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.tel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
	</div>

	<!--表格内容栏-->
	<kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"
		:data="pageResult" :columns="columns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @handleCurrentChange="handleUserSelectChange">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
				<el-form-item label="性别" prop="sex">
				<el-radio-group v-model="dataForm.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
			</el-form-item>
      <el-form-item label="企业微信id">
				<el-input v-model="dataForm.plugid" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="序号" prop="sort">
				<el-input v-model="dataForm.sort" type="number"></el-input>
			</el-form-item>
			<el-form-item label="是否启用" prop="status">
				<el-radio-group v-model="dataForm.status" >
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                  </el-radio-group>
			</el-form-item>
      <el-form-item label="是否显示" prop="show">
        <el-radio-group v-model="dataForm.isShow" >
          <el-radio label="0">显示</el-radio>
          <el-radio label="1">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="审核状态" prop="state">
				<el-radio-group v-model="dataForm.state" >
                    <el-radio label="1">未审核</el-radio>
                    <el-radio label="2">审核通过</el-radio>
                    <el-radio label="3">审核驳回</el-radio>
                  </el-radio-group>
			</el-form-item>
      <el-form-item label="驳回原因" prop="failMsg" v-if="dataForm.state == '3'">
        <el-input v-model="dataForm.failMsg" auto-complete="off"></el-input>
      </el-form-item>
			<el-form-item label="头像" prop="name">
				<el-upload
				accept="image/*"
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload" style="width:28%">
				<img v-if="dataForm.docHeadImg" :src="headSrc(dataForm.docHeadImg)" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
			<el-form-item label="签名图" prop="sign">
				<el-upload
				accept="image/*"
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess1"
				:before-upload="beforeAvatarUpload1" style="width:28%">
				<img v-if="dataForm.sign" :src="headSrc(dataForm.sign)" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
      <el-form-item label="企业微信" prop="contactMeQr">
        <el-upload
          accept="image/*"
          class="avatar-uploader"
          :action="uploadUrl()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess2"
          :before-upload="beforeAvatarUpload2" style="width:28%">
          <img v-if="dataForm.contactMeQr" :src="headSrc(dataForm.contactMeQr)" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
			<el-form-item label="角色" prop="employeeRoles">
				<el-select v-model="dataForm.employeeRoles" multiple placeholder="请选择"
					 style="width: 100%;" @change="isDocFun">
					<el-option v-for="item in roles" :key="item.id"
						:label="item.remark" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<template v-if="isKeeper">
				<el-form-item label="是否为特殊健康管家" prop="type" >
					<el-radio-group v-model="dataForm.isCompareKeeper" style="margin-left: -444px;">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</template>
			<template v-if="isDoc">
				<el-form-item label="选择助理" prop="assisantId" :rules="[
      { required: true, message: '请选择助理', trigger: 'blur' }
    ]">
					<el-select v-model="dataForm.assisantId"   placeholder="请选择"
					 style="width: 100%;" >
					<el-option v-for="item in assisantList" :key="item.id"
						:label="item.name" :value="item.id">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择类别" prop="docType" :rules="[
      { required: true, message: '请选择类别', trigger: 'blur' }
    ]">
					<el-radio-group v-model="dataForm.docType" @change="typeFun">
						<el-radio label="1">康复调理</el-radio>
						<el-radio label="2">专科医生</el-radio>
						<el-radio label="3">助理医师</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="一级科室" prop="docDepartment" v-if="isType" :rules="[
      { required: true, message: '请选择科室', trigger: 'blur' }
    ]">
					<el-select v-model="dataForm.docDepartment"  placeholder="请选择"
					 style="width: 100%;">
					<el-option v-for="item in departMentOneList" :key="item.departmentOneId"
						:label="item.departmentOneName" :value="item.departmentOneId">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否收费" prop="docLevel" :rules="[
      { required: true, message: '请选择是否收费', trigger: 'blur' }
    ]">
					<el-radio-group v-model="dataForm.docLevel" @change="isFeeFun">
						<el-radio label="0">免费</el-radio>
						<el-radio label="1">收费</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="isFee">
					<el-form-item label="挂号费" prop="registrationFee" :rules="[
      { required: true, message: '请输入挂号费', trigger: 'blur' }
    ]">
						<el-input v-model="dataForm.registrationFee" auto-complete="off"></el-input>
					</el-form-item>
				</template>
					<el-form-item label="简介" prop="docMark">
					<el-input type="textarea" autosize v-model="dataForm.docMark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="执业证号码" prop="docJobId">
				<el-input v-model="dataForm.docJobId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="身份证号码" prop="docCardId">
				<el-input v-model="dataForm.docCardId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="职称" prop="docPosition">
				<el-input v-model="dataForm.docPosition" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="毕业院校" prop="graduateSchool">
				<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
			</el-form-item>
				<el-form-item label="所在医院" prop="docHospital">
					<el-input v-model="dataForm.docHospital" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="医生资质证明" prop="graduateSchool">

				</el-form-item> -->


			</template>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
import { baseUrl } from '@/utils/global'
import { imageUrl } from '@/utils/global'

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
			isFee:false,
			isType:false,
			currentIndex:0,
			remarkArr:[],
			filters: {
				tel: ''
			},
			columns: [
				{type:"index",label:"序号", minWidth:50},
				// {prop:"id", label:"ID", minWidth:60},
				{prop:"name", label:"用户名", minWidth:120},
				//{prop:"deptName", label:"机构", minWidth:120},
				{prop:"roleNames", label:"角色", minWidth:100},
				//{prop:"email", label:"邮箱", minWidth:120},
				{prop:"tel", label:"手机", minWidth:100},
				{prop:"status", label:"是否启用", minWidth:120, formatter:this.statusFormat},
				{prop:"state", label:"审核状态", minWidth:60, formatter:this.stateFormat}

			],
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
				id: '',
				name: '',
				docHeadImg:'',
				password: '',
				tel: '',
				age:'',
				sex:'',
				address:'',
				workAddress:'',
				graduateSchool:'',
				docType:'',
				docIntegral:'',
				docMark:'',
        show:"",
				docHospital:'',
				docDepartmentOne:'',
				docDepartment:'',
				docLevel:"1",
				registrationFee:'',
				assisantId:'',
				sign:'',
        contactMeQr:"",
				employeeRoles:[]
			},
			deptData: [],
			roles: [],
			departMentOneList:[],
			departMentTwoList:[],
			assisantList:[]
		}
	},
	methods: {
			headSrc(url){
				return imageUrl+url
			},
			uploadUrl(){
				//return baseUrl+"/system/upload";
				return "http://baxitang.com/sh/system/upload";
			},

			handleAvatarSuccess(res, file) {
				this.dataForm.docHeadImg = res.rows;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleAvatarSuccess1(res, file) {
				this.dataForm.sign = res.rows;
			},
			beforeAvatarUpload1(file) {
				const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
    handleAvatarSuccess2(res, file) {
      this.dataForm.contactMeQr = res.rows;
      this.$forceUpdate()
    },
    beforeAvatarUpload2(file) {
      const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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

		typeFun:function(data){

			if(data==1){
				this.isType = false
			}else if(data == 2){
				this.isType = true
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
			this.pageRequest.columnFilters = {tel: {name:'tel', value:this.filters.tel}}
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = res
				this.findDepartmentOneList()
				this.findUserRoles()
				this.selectAssisant()
			}).then(data!=null?data.callback:'')
		},
		//加载所有助理
		selectAssisant:function(){
			this.$api.user.selectAssisant().then((res) => {
				// 加载所有助理
				this.assisantList = res.rows
			})
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
		handleUserSelectChange:function (params) {

		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {

			for(var obj in this.dataForm){
				if(obj == 'employeeRoles'){
					this.dataForm[obj] = []
				}else{
					this.dataForm[obj] = ""
				}
			}
			this.dialogVisible = true
			this.operation = true
			this.isDoc = false

		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let employeeRoles = []
			for(let i=0,len=params.row.employeeRoles.length; i<len; i++) {
				employeeRoles.push(params.row.employeeRoles[i].roleId)
			}
			this.dataForm.employeeRoles = employeeRoles
			this.isDocFun(employeeRoles)
			this.isFeeFun(this.dataForm.docLevel)
			this.typeFun(this.dataForm.docType)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let employeeRoles = []
						for(let i=0,len=params.employeeRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.employeeRoles[i]
							}
							employeeRoles.push(userRole)
						}
						params.employeeRoles = employeeRoles
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
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 时间格式化
      	statusFormat: function (row, column, cellValue, index){
			switch (row.status){
				case "0":
					return '已禁用'
				case "1":
					return "已启用"
			}
      	},
// 用户状态格式化
      	stateFormat: function (row, column, cellValue, index){
			switch (row.state){
				case "1":
					return '未审核'
				case "2":
					return "审核通过"
				case "3":
					return "审核驳回"
			}
      	},


	},
	mounted() {
		//this.findDeptTree()
		//this.initColumns()
	}
}
</script>

<style scoped>

  .avatar-uploader .el-upload {
    border: 1px dashed #2e151515;
	width: 30%;
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
</style>
