<template>
  <!-- <el-button :size="size" :type="type" :icon="icon"
    :loading="loading" :disabled="!hasPerms(perms)" @click="handleClick">
    {{label}}
  </el-button> -->
  
  <div>
		<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" size="small">
			<el-form-item>
				<el-input v-model="filters.name" placeholder="药名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="add" type="primary">添加</el-button>
			</el-form-item>
		</el-form>
	</div>
    <el-table :data="pageRequest.rows" style="width: 100%">
		<el-table-column type="index" label="序号">
		</el-table-column>
		<el-table-column property="id" label="id">
		</el-table-column>
		<el-table-column property="name" label="药名">
		</el-table-column>
		<el-table-column property="number" label="数量">
		</el-table-column>
		<el-table-column property="unit" label="单位">
		</el-table-column>
		<el-table-column property="amount" label="金额">
		</el-table-column>
		<el-table-column property="createUser" label="添加人">
		</el-table-column>
		<el-table-column property="createTime" label="添加时间">
		</el-table-column>
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageRequest.total" style="float:right;">
      </el-pagination>
    </div>
	<!--新增药方页-->
    <el-dialog  title="药方"  width="60%" :visible.sync="isShow" :close-on-click-modal="false">
      
    </el-dialog>
  </div>
 
</template>

<script>
export default {
  name: 'Medical',
  props: {
		recordId:String
  },
  data: function () {
    return {
			filters:{
				name:''
			},
			isShow:false,
			pageRequest:{
				pageNum:1,pageSize:10
			}
    }
	},
	methods:{
		add(){
			this.isShow = true		
		},
		refreshPageRequest(pageNum){
			this.pageRequest.pageNum = pageNum
			this.findPage(this.pageRequest)
		},
		findPage(data){
			if(data){
				this.pageRequest = data
			}
			this.pageRequest.columnFilters = {recordId:{name:'recordId',value:this.recordId}}
        this.$api.assistant.selectMedical(this.pageRequest).then((res) => {
          this.pageRequest = res
        })
		}

	},
	mounted(){
		
	},
	watch:{
		recordId(newValue,oldValue){
			alert(111)
				this.findPage(null)
		}
	}
}
</script>

<style scoped>
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
</style>