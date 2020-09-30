<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" size="small">
			<el-form-item>
				<el-input v-model="filters.tel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<!--<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>-->
		</el-form>
	</div>
	<!--表格内容栏-->
	<el-table :data="pageRequest.rows" style="width: 100%">
		<el-table-column type="index" label="序号">
		</el-table-column>
		<!--<el-table-column property="id" label="id" >-->
		<!--</el-table-column>-->
		<el-table-column property="userTel" label="电话">
		</el-table-column>
		<el-table-column property="userName" label="姓名" >
		</el-table-column>

		<el-table-column property="userLevel" label="是否是会员" :formatter="statusFormat">
		</el-table-column>
		<el-table-column property="createTime" label="创建时间" :formatter="timeFormat">
		</el-table-column>
		<el-table-column  label="操作" :formatter="timeFormat">
			<template slot-scope="scope">
				<el-button v-if="scope.row.userLevel == '0'" type="text" @click="addVip(scope.row.id)">加入会员</el-button>
				<el-button v-if="scope.row.userLevel == '1'" type="text" @click="cancleVip(scope.row.id)">解除会员</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageRequest.total" style="float:right;">
      </el-pagination>
    </div>
	<!--新增编辑界面-->
	<el-dialog title="成为会员" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px">
			<el-form-item  label="选择管家" prop="keeperId">
				<el-select v-model="dataForm.keeperId" placeholder="请选择">
					<el-option
					v-for="item in keeperList"
					:key="item.id"
					:label="item.name"
					:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
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
import { timestampToTime } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
			keeperList:[],

			filters: {
				tel: ''
			},
			pageRequest: { pageNum: 1, pageSize: 10 },
			columnFilters:{},
			pageResult: {},


			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,

			// 新增编辑界面数据
			dataForm: {
				clinetId: '',
				keeperId: ''
			},
			 rules: {
					keeperId: [
						{ required: true, message: '请选择管家', trigger: 'blur' },

					],

				},
			deptData: [],
			roles: [],
			departMentOneList:[],
			departMentTwoList:[],
		}
	},
	methods: {
		cancleVip:function(id){
			this.$confirm('确认提交吗？', '提示', {}).then(() => {
				this.$api.user.cancelVipKeeper({id:id}).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
			})
		},

		addVip:function (id) {
			this.dataForm.clinetId = id
			this.selectKeeyperList()
			this.dialogVisible = true
		},
		changeDepartmentTwo: function(data){

			this.$api.department.findDepartmentTwoByid({"departmentOneId":data}).then((res) => {
				// 加载角色集合
				this.departMentTwoList = res.rows

			})
		},

		// 获取分页数据
		findPage: function (data) {
			if(data) {
				this.pageRequest = data
			}
			this.pageRequest.columnFilters = this.columnFilters
			this.pageRequest.columnFilters.tel = {name:'tel', value:this.filters.tel}
			this.$api.user.selectClientUser(this.pageRequest).then((res) => {
				this.pageRequest = res

			}).then(data!=null?data.callback:'')
		},
			// 医疗记录列表换页刷新
		refreshPageRequest: function (pageNum) {
			this.pageRequest.pageNum = pageNum
			this.findPage(this.pageRequest)
		},

		handleUserSelectChange:function (params) {
			// alert("111")
		},

		selectKeeyperList:function () {
			 this.$api.user.selectKeeperList({pageNum: 1,pageSize: 100}).then((res) => {
				// 加载角色集合
				this.keeperList = res.rows

			})

		},

		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.$api.user.addVipKeeper(this.dataForm).then((res) => {
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



		// 会员状态格式化
      	statusFormat: function (row, column, cellValue, index){
			switch (row.userLevel){
				case "0":
					return '否'
				case "1":
					return "是"
			}
      	},
		//时间格式化
      	timeFormat: function (row, column, cellValue, index){
			if(row.createTime){
				return timestampToTime(row.createTime)
			}
      	}


	},
	mounted() {
		this.findPage(null)
	}
}
</script>

<style scoped>

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
</style>
