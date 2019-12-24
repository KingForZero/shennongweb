<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        
          <el-form-item>
            <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
          </el-form-item>
      </el-form>
    </div>
    
    <!--表格内容栏-->
    <kt-table permsEdit="sys:user:edit" :showOperation="false" :customEditeAndDelete="true"
              :data="pageResult" :columns="filterColumns"
              @findPage="findPage" @handleEdit="handleEdit" >
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'修改'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close='closeDialog'>
      <el-form  :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="描述" prop="protocol">
          <!--<el-input v-model="dataForm.mark" auto-complete="off" placeholder="描述"></el-input>-->
          <!-- <UEditor :defaultMsg=this.config.initialContent :config=config ref="ueditor" v-if="dialogFormDiviable"></UEditor> -->
          <editor-bar :isClear="isClear" @change="change" :value="value"></editor-bar>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">
          {{$t('action.submit')}}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible2">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import {format, formatTimeStr} from "@/utils/datetime"
  import { baseUrl,imageUrl } from '@/utils/global'
  import UEditor from '@/components/ueditor/ueditor.vue'
  import EditorBar from '@/components/wangEnduit/wangEditor.vue'
  

  export default {
    components: {
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog,
      UEditor,
      EditorBar
    },
    data() {
      return {
        value:'',
        isClear: false,
        dialogFormDiviable:false,
        size: 'small',
        fileList:[],
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
            
         

        },
        // 新增编辑界面数据
        dataForm: {
          id: '',
          protocol: ''
        },
        deptData: [],
        roles: [],
        departMentOneList: [],
        departMentTwoList: [],
        uploadComplete: true, // 图片上传完成状态
        dialogImageUrl: '',
        dialogVisible2: false,
        config: {
          //可以在此处定义工具栏的内容
          // toolbars: [
          //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
          //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
          //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
          // ],
          autoHeightEnabled: false,
          autoFloatEnabled: true,
          initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: 'static/ueditor/'
        },
        defaultMsg: '',
      }
    },
    methods: {
      //关闭弹框的事件
      closeDialog(){
        console.log("弹窗关闭")
        this.dialogFormDiviable = false;//清空数据
        // this.config.initialContent=''
      },
      change(val) {
       this.dataForm.protocol = val
        
      
    },
      //获取富文本编辑器内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        // console.log(content);
        // alert(content);
        return content;
      },
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
          // this.pageRequest.assisantId = this.currentUserId.id
        }
        // this.pageRequest.columnFilters = {assisantId: {name:'assisantId', value:this.filters.assisantId}}
        this.$api.portalmanage.findProtocol(this.pageRequest).then((res) => {
          this.pageResult = res
          // this.findDepartmentOneList()
          //加载弹出框的用户角色
          // this.findUserRoles()
        }).then(data != null ? data.callback : '')
      },
      // 显示新增界面
      handleAdd: function () {
        for(var obj in this.dataForm){
          this.dataForm[obj] = ""
        }
        this.value = ""
        // this.defaultMsg=''
        this.fileList=[]
        this.dialogVisible = true
        this.dialogFormDiviable=true
        this.operation = true

      },
     
      // 显示编辑界面
      handleEdit: function (params) {
        console.log(params)
        //this.dialogFormDiviable=true
        this.dialogVisible = true
        this.operation = false
       
      

        // params.row.isFlag
        //this.config.initialContent =  params.row.protocol
        this.value = params.row.protocol
        
        // this.$api.assistant.selectDocWorkTimeById({"docId": params.row.id}).then((res) => {
        //   // 加载时间问题
        //   console.log("查询医生id::"+res.rows)
        //   this.dataForm = Object.assign({}, res.rows)
        //   this.dataForm.docId=params.row.id
        // })
        this.dataForm = Object.assign({}, params.row)
        // let userRoles = []
        // for(let i=0,len=params.row.userRoles.length; i<len; i++) {
        //   userRoles.push(params.row.userRoles[i].roleId)
        // }
        // this.dataForm.userRoles = userRoles


      },
      // 编辑
      submitForm: function () {
        let _slef = this;
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              //this.dataForm.protocol=_slef.change()
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
              this.$api.portalmanage.editProtocol(params).then((res) => {
                this.editLoading = false
                if (res.code == 200) {
                  this.$message({message: '操作成功', type: 'success'})
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                  this.defaultMsg=''
                  this.fileList=[]
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findPage(null)
              })
            })
          }
        })
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
          {prop: "titla", label: "标题", minWidth: 50},
          {prop: "isFlag", label: "状态", minWidth: 50,formatter:this.recordStateFormat},
          {prop: "createUser", label: "创建人", minWidth: 50},
          {prop: "createTime", label: "创建时间", minWidth: 50,formatter:this.dateFormat},
        ]
        this.filterColumns = this.columns;
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
