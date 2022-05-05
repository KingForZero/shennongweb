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
    <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete" :showOperation="false" :customEditeAndDelete="true"
              :data="pageResult" :columns="filterColumns"
              @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @lookDoctorWorkTime="lookDoctorWorkTime">
    </kt-table>
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'修改'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close='closeDialog'>
      <el-form  :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
                label-position="right">
        <el-form-item label="ID" prop="goodsId" v-if="false">
          <el-input v-model="dataForm.goodsId" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="dataForm.goodsName" auto-complete="off" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item  label="启用/禁用" prop="isFlag">
          <!--   <el-tooltip :content="'Switch value: ' + dataForm.is_flag" placement="top">-->
          <div style="float: left">
            <el-switch  label-position="right"  @change="isFlag" v-model="dataForm.isFlag"  active-color="#13ce66"   inactive-color="#ff4949" active-value="1"
                        inactive-value="0" >
            </el-switch>
          </div>
          <!--  </el-tooltip>-->
        </el-form-item>

        <el-form-item label="商品图片" prop="goodsImg">
          <div style="float: left">
            <el-upload
              :action="uploadUrl()"
              multiple
              accept="image/png, image/jpeg"
              :file-list="fileList"
              list-type="picture-card"
              :before-upload="beforeUploadPicture"
              :on-preview="handlePictureCardPreview"
              :on-progress="uploadProgress"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="描述" prop="goodsMark">
          <!--<el-input v-model="dataForm.mark" auto-complete="off" placeholder="描述"></el-input>-->
          <UEditor :defaultMsg=this.config.initialContent :config=config ref="ueditor" v-if="dialogFormDiviable" ></UEditor>
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

  export default {
    components: {
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog,
      UEditor
    },
    data() {
      return {
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
          goodsId: 0,
          isFlag: 1,//1启用0禁用
          goodsImg: '',
          goodsMark: '',
          goodsName: '',
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
          initialContent:'',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
          BaseUrl: '',
          UEDITOR_HOME_URL: 'static/ueditor/'
        },
      }
    },
    methods: {
      //关闭弹框的事件
      closeDialog(){
        console.log("弹窗关闭")
        this.dialogFormDiviable = false;//清空数据
        // this.config.initialContent=''
      },
      //获取富文本编辑器内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        // console.log(content);
        // alert(content);
        return content;
      },
      uploadUrl(){
        return "http://baxitang.com/sh/system/upload";
      },
      // 上传图片前调用方法
      beforeUploadPicture(file) {
        if(file.size > 10*1024*1024){
          this.$message.error("上传图片不能大于10M");
          return false;
        }
      },
      // 上传图片时调用
      uploadProgress(event,file, fileList){
        this.uploadComplete = false;
      },
      // 上传图片成功
      uploadSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange(fileList);
      },
      // 上传图片出错
      uploadError(err, file, fileList) {
        this.$message.error("上传出错");
      },
      // 移除图片
      handleRemove(file, fileList) {
        this.fileChange(fileList);
        console.log("设置图片的地址222：："+this.dataForm.goodsImg)
      },
      // 设置photo值
      fileChange(fileList) {
        let temp_str = '';
        if(fileList.length > 0){
          for(let i=0; i<fileList.length; i++){
            if(fileList[i].response){
              if(fileList[i].response.code == 200){
                if(i===0){
                  temp_str += fileList[i].response.rows;
                } else {
                  // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开）
                  temp_str += ',' + fileList[i].response.rows;
                }
              }
            }
          }
        }
        this.dataForm.goodsImg = temp_str;
        console.log("设置图片的地址：："+this.dataForm.goodsImg)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
      },
      isFlag (val) {//启用禁用按钮
        console.log(val)
        this.dataForm.isFlag=val
      },
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
        if (data !== null) {
          this.pageRequest = data.pageRequest
          // this.pageRequest.assisantId = this.currentUserId.id
        }
        // this.pageRequest.columnFilters = {assisantId: {name:'assisantId', value:this.filters.assisantId}}
        this.$api.portalmanage.goodsManagefindPage(this.pageRequest).then((res) => {
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
        console.log(data.params[0])
        // this.$api.portalmanage.batchDelete(data.params).then(data != null ? data.callback : '')
        this.$api.portalmanage.goodsManageBatchDelete(data.params[0]).then(data != null ? data.callback : '')
      },
      // 显示新增界面
      handleAdd: function () {
        for(var obj in this.dataForm){
          this.dataForm[obj] = ""
        }
        // this.config.initialContent=''
        this.fileList=[]
        this.dialogVisible = true
        this.dialogFormDiviable=true
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
        this.dialogFormDiviable=true
        this.dialogVisible = true
        this.operation = false
        console.log(params.row);
        //回显图片操作
        let files=[]
        let idArray = (params.row.goodsImg+'').split(',')
        for(var i=0; i<idArray.length; i++) {
          files.push({name: idArray[i], url: 'http://baxitang.com/images/'+idArray[i]})
        }
        //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        this.fileList  =files

        // params.row.isFlag
        this.config.initialContent =  params.row.goodsMark
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
              this.dataForm.goodsMark=_slef.getContent()
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
              this.$api.portalmanage.addGoods(params).then((res) => {
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
      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
      //状态
      recordStateFormat: function (row, column, cellValue, index){
        switch (row[column.property]){
          case '0':
            return '禁用'
          case '1':
            return '启用'
          default:
            return "未知状态"
        }
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
          {prop: "goodsId", label: "ID", minWidth: 50},
          {prop: "goodsName", label: "名称", minWidth: 50},
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
