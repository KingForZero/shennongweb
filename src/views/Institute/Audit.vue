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
		<el-table-column property="title" label="科研主题" >
		</el-table-column>
		<el-table-column property="fileUrl" label="课题文件" >
			<template slot-scope="scope">
				<a class='download' :href='down(scope.row)' download=""  title="下载">下载</a>
			</template>
		</el-table-column>
		<el-table-column property="addUserName" label="添加人" >
		</el-table-column>
		<el-table-column property="addDate" label="添加日期" :formatter="dateFormat">
		</el-table-column>
		<el-table-column property="auditUserName" label="审核人" >
		</el-table-column>
		<el-table-column property="auditDate" label="审核日期" :formatter="dateFormat">
		</el-table-column>
		<el-table-column property="status" label="状态" :formatter="statusFormatter">
		</el-table-column>
		<el-table-column property="rejectReason" label="驳回原因" >
		</el-table-column>
		<el-table-column property="status" label="操作">
			<template slot-scope="scope">
				<el-button v-if="scope.row.status == '2'" @click="tongguo(scope.row)" type="text" size="small">通过</el-button>
				<el-button v-if="scope.row.status == '2'" @click="bohui(scope.row)" type="text" size="small">驳回</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
      </el-pagination>
    </div>
	<!--用户详情界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="主题" prop="title">
				<el-input v-model="dataForm.title" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="课题文件" prop="name">
				<el-upload
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload" style="width:20%">
				<el-button size="small" type="primary">点击上传</el-button>
				<a class='download' :href='dataForm.fileUrl' download=""  title="下载">下载</a>
			</el-upload>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!--驳回界面-->
	<el-dialog title="驳回原因" width="50%" :visible.sync="isBohui" :close-on-click-modal="false">
		<el-form :model="bohuiForm" label-width="80px" :rules="dataFormRules" ref="bohuiForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="bohuiForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="驳回原因" prop="rejectReason">
				<el-input v-model="bohuiForm.rejectReason" auto-complete="off"></el-input>
			</el-form-item>
		<!-- <div slot="footer" class="dialog-footer"> -->
			<el-button :size="size" @click.native="isBohui = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitBohui" :loading="editLoading">{{$t('action.submit')}}</el-button>
		<!-- </div> -->
		</el-form>
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
			isBohui:false,
			bohuiForm:{
				id:'',
				status:'',
				rejectReason:''
			},
			size: 'small',
			employeeId:'',
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
				title:'',
				fileUrl:'',
				addUserId:'',
				addUserName:'',
				status:''
			},
			dataFormRules: {
				title: [
					{ required: true, message: '请输入主题', trigger: 'blur' }
				]
			},

		}
	},
	methods: {
		dateFormat: function (row, column, cellValue, index){
			if(row[column.property]){
				return timestampToTime(row[column.property])
			}else{

			}
          
      	},
		tongguo(row){
			this.$api.project.save({id:row.id,status:'3'}).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.findPage(null)
			})
		},
		bohui(row){
			this.bohuiForm.id = row.id
			this.bohuiForm.status = '4'
			this.isBohui = true
		},
		submitBohui(){
			this.$api.project.save(this.bohuiForm).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.isBohui = false
				this.findPage(null)
			})
		},
		handleAdd(){
			this.dialogVisible = true
		},
			submitHealthGuidance(){
				this.$refs.healthGuidanceForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true

						this.$api.healthHouseKeeper.saveHealthGuidance(this.healthGuidanceForm).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.isHealthGuidance = false
								this.$refs['healthGuidanceForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.refreshHealthGuidance(1)
						})
					})
				}
			})
			},

			uploadUrl(){
				return baseUrl+"/system/upload";
			},
			handleAvatarSuccess(res, file) {
				this.dataForm.fileUrl = res.rows;
			},
			beforeAvatarUpload(file) {
				// const isJPG = file.type === 'image/jpeg';
				// const isLt2M = file.size / 1024 / 1024 < 2;

				// if (!isJPG) {
				// this.$message.error('上传头像图片只能是 JPG 格式!');
				// }
				// if (!isLt2M) {
				// this.$message.error('上传头像图片大小不能超过 2MB!');
				// }
				// return isJPG && isLt2M;
			},
		statusFormatter:function(row){
			switch (row.status){
				case "1":
					return "未提交";
				break;
				case "2":
					return "未审核";
				break;
				case "3":
					return "审核通过";
				break;
				case "4":
					return "审核驳回";
				break;

			}
		},
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			// this.employeeId = JSON.parse(sessionStorage.getItem("employee")).id
			// this.pageRequest.columnFilters = {addUserId: {name:'addUserId', value:this.employeeId}}
			this.$api.project.selectAllPage(this.pageRequest).then((res) => {
				this.pageResult = res
			}).then(data!=null?data.callback:'')
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						this.$api.project.save(this.dataForm).then((res) => {
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

		refreshPageRequest: function(pageNum){
			this.pageRequest.pageNum  = pageNum
			this.findPage(this.pageRequest)
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
