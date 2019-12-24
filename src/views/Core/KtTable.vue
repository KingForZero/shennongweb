<template>
  <div>
    <!--表格栏-->
    <el-table :data="data.rows" :highlight-current-row="highlightCurrentRow" @selection-change="selectionChange"
          @current-change="handleCurrentChange" v-loading="loading" :element-loading-text="$t('action.loading')" :border="border" :stripe="stripe"
          :show-overflow-tooltip="showOverflowTooltip" :max-height="maxHeight" :size="size" :align="align" style="width:100%;" >
      <el-table-column type="selection" width="40" v-if="showBatchDelete & showOperation"></el-table-column>
      <el-table-column v-for="column in columns" header-align="center" align="center"
        :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth"
        :fixed="column.fixed" :key="column.prop" :type="column.type" :formatter="column.formatter"
        :sortable="column.sortable==null?true:column.sortable">
      </el-table-column>
     <el-table-column :label="状态" width="180" fixed="right" v-if="showStatus" header-align="center" align="center" :formatter="statusFormatter">
        <template slot-scope="scope">
          <el-tag
          :type="scope.row.status === '0' ? 'primary' : 'success'"
          disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('action.operation')" width="180" fixed="right" v-if="showBatchDelete & showOperation" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
      <!--助理工作台   我的医生  按钮：修改会诊时间，修改医生详情-->
      <el-table-column :label="$t('action.operation')" width="280" fixed="right" v-if="showAssistantWorkbenchMyDoctor" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.updateConsultationTime')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-edit" :label="$t('action.updateDoctorDetail')" :perms="permsDelete" :size="size" type="danger" @click="lookDoctorWorkTime(scope.$index, scope.row)" />
        </template>
      </el-table-column>
      <!--客服工作台，用户管理，审核按钮-->
      <el-table-column :label="$t('action.operation')" width="200" fixed="right" v-if="showCustomerExamine" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.customerExamine')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
        </template>
      </el-table-column>

      <!--助理工作台，今日接待，提交到医生，提交到药师按钮-->
      <el-table-column :label="$t('action.operation')" width="200" fixed="right" v-if="showToDoctorAndToPharmacist" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.assistantToDoctor')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-edit" :label="$t('action.assistantToPharmacist')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
        </template>
      </el-table-column>

      <!--医生工作台，患者跟踪管理，上传图片按钮，多图上传-->
      <el-table-column :label="$t('action.operation')" width="200" fixed="right" v-if="showUploadPicture" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" label="上传图片" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    <!-- 自定义编辑和删除 -->
      <el-table-column :label="$t('action.operation')" width="180" fixed="right" v-if="customEditeAndDelete" header-align="center" align="center">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" :label="$t('action.edit')" :perms="permsEdit" :size="size" @click="handleEdit(scope.$index, scope.row)" />
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" :perms="permsDelete" :size="size" type="danger" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <kt-button :label="$t('action.batchDelete')" :perms="permsDelete" :size="size" type="danger" @click="handleBatchDelete()"
        :disabled="this.selections.length===0" style="float:left;" v-if="showBatchDelete & showOperation"/>
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="data.total" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton"
export default {
  name: 'KtTable',
  components:{
			KtButton
	},
  props: {
    columns: Array, // 表格列配置
    data: Object, // 表格分页数据
    permsEdit: String,  // 编辑权限标识
    permsDelete: String,  // 删除权限标识
    size: { // 尺寸样式
      type: String,
      default: 'mini'
    },
    align: {  // 文本对齐方式
      type: String,
      default: 'left'
    },
    maxHeight: {  // 表格最大高度
      type: Number,
      default: 420
    },
    showOperation: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    border: {  // 是否显示边框
      type: Boolean,
      default: false
    },
    stripe: {  // 是否显示斑马线
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {  // // 是否高亮当前行
      type: Boolean,
      default: true
    },
    showOverflowTooltip: {  // 是否单行显示
      type: Boolean,
      default: true
    },
    showBatchDelete: {  // 是否显示操作组件
      type: Boolean,
      default: true
    },
    showAssistantWorkbenchMyDoctor:{//助理工作台，我的医生模块操作按钮
      type: Boolean,
      default: false
    },
    showStatus:{
      type: Boolean,
      default:false
      },
    //客服工作台，用户管理，审核按钮
    showCustomerExamine:{
      type: Boolean,
      default: false
    },
    //助理工作台，今日接待，提交医生，提交药师按钮
    showToDoctorAndToPharmacist:{
      type: Boolean,
      default: false
    },
    //医生工作台，上传图片
    showUploadPicture:{
      type: Boolean,
      default: false
    },
    //自定义编辑和删除
    customEditeAndDelete:{
    type: Boolean,
    default: false
    }
  },
  data() {
    return {
      // 分页信息
			pageRequest: {
				pageNum: 1,
        pageSize: 10
      },
      loading: false,  // 加载标识
      selections: []  // 列表选中列
    }
  },
  methods: {
    // 分页查询
    findPage: function () {
        this.loading = true
        let callback = res => {
          this.loading = false
        }
      this.$emit('findPage', {pageRequest:this.pageRequest, callback:callback})
    },
    // 选择切换
    selectionChange: function (selections) {
      this.selections = selections
      this.$emit('selectionChange', {selections:selections})
    },
    // 选择切换
    handleCurrentChange: function (val) {
      this.$emit('handleCurrentChange', {val:val})
    },
    // 换页刷新
		refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 编辑
		handleEdit: function (index, row) {
      this.$emit('handleEdit', {index:index, row:row})
		},

    //查看医生会诊时间
    lookDoctorWorkTime: function (index, row) {
      console.log("点击时间11");
      this.$emit('lookDoctorWorkTime', {index:index, row:row})
    },
    // 删除
		handleDelete: function (index, row) {
			this.delete(row.id)
		},
		// 批量删除
		handleBatchDelete: function () {
			let ids = this.selections.map(item => item.id).toString()
			this.delete(ids)
		},
		// 删除操作
		delete: function (ids) {
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				let params = []
				let idArray = (ids+'').split(',')
				for(var i=0; i<idArray.length; i++) {
					params.push({'id':idArray[i]})
        }
        this.loading = true
        let callback = res => {
          if(res.code == 200) {
            this.$message({message: '删除成功', type: 'success'})
            this.findPage()
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          this.loading = false
        }
        this.$emit('handleDelete', {params:params, callback:callback})
			}).catch(() => {
			})
		}
  },
  mounted() {
    this.refreshPageRequest(1)
  }
}
</script>

<style scoped>

</style>
