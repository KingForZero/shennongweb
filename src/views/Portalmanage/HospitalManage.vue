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
    <el-dialog :title="operation?'新增':'修改'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form  :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
                label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="医院名称" prop="hosName">
          <el-input v-model="dataForm.hosName" auto-complete="off" placeholder="医院名称"></el-input>
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
        <el-form-item label="医院门头" prop="hosHeadImg">
         <!-- <el-input v-model="dataForm.hosHeadImg" auto-complete="off" placeholder="医院门头图片"></el-input>-->
          <div style="float: left">
            <el-upload
              :action="uploadUrl()"
              multiple
              accept="image/png, image/jpeg"
              :file-list="hosHeadImgFileList"
              list-type="picture-card"
              :before-upload="beforeUploadPicture"
              :on-preview="handlePictureCardPreview"
              :on-progress="uploadProgress"
              :on-remove="hosHeadImgHandleRemove"
              :on-success="hosHeadImgUploadSuccess"
              :on-error="uploadError"
              :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>


        </el-form-item>
        <el-form-item label="医院资质" prop="hosZzImg">
          <!--<el-input v-model="dataForm.hosZzImg" auto-complete="off" placeholder="医院资质图片"></el-input>-->
          <div style="float: left">
            <el-upload
              :action="uploadUrl()"
              multiple
              accept="image/png, image/jpeg"
              :file-list="hosZzImgFileList"
              list-type="picture-card"
              :before-upload="beforeUploadPicture"
              :on-preview="handlePictureCardPreview"
              :on-progress="uploadProgress"
              :on-remove="hosZzImgHandleRemove"
              :on-success="hosZzImgUploadSuccess"
              :on-error="uploadError"
              :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="医院描述" prop="hosMark">
          <el-input type="textarea" autosize  v-model="dataForm.hosMark" auto-complete="off" placeholder="医院描述"></el-input>
        </el-form-item>
        <el-form-item label="医院地址" prop="hosAddress">
          <el-input v-model="dataForm.hosAddress" auto-complete="off" placeholder="医院地址"></el-input>
        </el-form-item>
        <el-form-item label="专家姓名" prop="expertsName">
          <el-input v-model="dataForm.expertsName" auto-complete="off" placeholder="专家姓名"></el-input>
        </el-form-item>
        <el-form-item label="专家头像" prop="expertsImg">
          <!--<el-input v-model="dataForm.expertsImg" auto-complete="off" placeholder="专家头像"></el-input>-->
          <div style="float: left">
            <el-upload
              :action="uploadUrl()"
              multiple
              accept="image/png, image/jpeg"
              :file-list="expertsImgFileList"
              list-type="picture-card"
              :before-upload="beforeUploadPicture"
              :on-preview="handlePictureCardPreview"
              :on-progress="uploadProgress"
              :on-remove="expertsImgHandleRemove"
              :on-success="expertsImgUploadSuccess"
              :on-error="uploadError"
              :show-file-list="true">
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="二级科室" prop="hosDepartment">
         <!-- <el-input v-model="dataForm.hosDepartment" auto-complete="off" placeholder="二级科室id"></el-input>-->
          <div style="float: left">
          <el-select v-model="dataForm.hosDepartment" size="medium" placeholder="请选择">
            <el-option
              v-for="item in departTwoData"
              :key="item.departmentTwoId"
              :label="item.departmentTwoName"
              :value="item.departmentTwoId">
            </el-option>
          </el-select>
          </div>
        </el-form-item>
        <el-form-item label="专家简介" prop="expertsMark">
          <el-input v-model="dataForm.expertsMark" auto-complete="off" placeholder="专家简介"></el-input>
        </el-form-item>
        <el-form-item label="推荐理由" prop="recommendedReason">
          <el-input v-model="dataForm.recommendedReason" auto-complete="off" placeholder="推荐理由"></el-input>
        </el-form-item>
        <!--<el-form-item label="图片" prop="img">
          &lt;!&ndash; <el-input v-model="dataForm.img" auto-complete="off" placeholder="图片"></el-input>&ndash;&gt;
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
        <el-form-item label="描述" prop="mark">
          &lt;!&ndash;<el-input v-model="dataForm.mark" auto-complete="off" placeholder="描述"></el-input>&ndash;&gt;
          <UEditor :defaultMsg=defaultMsg :config=config ref="ueditor" v-model="dataForm.mark"></UEditor>
        </el-form-item>-->
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

  export default {
    components: {
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog
    },
    data() {
      return {
        departTwoData: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        size: 'small',
        hosHeadImgFileList:[],
        hosZzImgFileList:[],
        expertsImgFileList:[],
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
          id: 0,
          isFlag: 1,//1启用0禁用
          hosName: '医院名称',
          hosHeadImg: '医院门头图片',
          hosZzImg: '医院资质图片',
          hosMark: '医院描述',
          hosAddress: '医院地址',
          expertsName: '专家姓名',
          expertsImg: '专家头像',
          hosDepartment:'',
          expertsMark:'专家简介',
          recommendedReason:'推荐理由',
        },
        deptData: [],
        roles: [],
        departMentOneList: [],
        departMentTwoList: [],
        uploadComplete: true, // 图片上传完成状态
        dialogImageUrl: '',
        dialogVisible2: false,
      }
    },
    methods: {
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
      // 上传医院门头图片成功
      hosHeadImgUploadSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.hosHeadImgFileChange(fileList);
      },
      //上传医院资质图片成功
      hosZzImgUploadSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.hosZzImgFileChange(fileList);
      },
      //上传专家图片成功
      expertsImgUploadSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.expertsImgFileChange(fileList);
      },
      // 上传图片出错
      uploadError(err, file, fileList) {
        this.$message.error("上传出错");
      },
      // 移除医院门头图片
      hosHeadImgHandleRemove(file, fileList) {
        this.hosHeadImgFileChange(fileList);
      },
      // 移除医院资质图片
      hosZzImgHandleRemove(file, fileList) {
        this.hosZzImgFileChange(fileList);
      },
      // 移除专家图片
      expertsImgHandleRemove(file, fileList) {
        this.expertsImgFileChange(fileList);
      },
      // 设置医院门头图片值
      hosHeadImgFileChange(fileList) {
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
        this.dataForm.hosHeadImg = temp_str;
        console.log("设置医院门头图片的地址：："+this.dataForm.hosHeadImg)
      },
      //设置医院资质的图片值
      hosZzImgFileChange(fileList) {
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
        this.dataForm.hosZzImg = temp_str;
        console.log("设置医院资质图片的地址：："+this.dataForm.hosZzImg)
      },
      //专家图片
      expertsImgFileChange(fileList) {
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
        this.dataForm.expertsImg = temp_str;
        console.log("设置专家图片的地址：："+this.dataForm.expertsImg)
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
        this.$api.portalmanage.findPageByHospital(this.pageRequest).then((res) => {
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
        this.$api.portalmanage.hospitalBatchDelete(data.params[0]).then(data != null ? data.callback : '')
      },
      // 显示新增界面
      handleAdd: function () {
        for(var obj in this.dataForm){
          this.dataForm[obj] = ""
        }
       this.hosHeadImgFileList=[]
         this.hosZzImgFileList=[]
         this.expertsImgFileList=[]
        this.dialogVisible = true
        this.operation = true

      },
      //查看会诊时间
      // 显示编辑界面
      handleEdit: function (params) {
        this.dialogVisible = true
        this.operation = false
        console.log(params.row);
        //回显图片操作
        let hosHeadImgs=[];//医院门头
        let idArray = (params.row.hosHeadImg+'').split(',')
        for(let i=0; i<idArray.length; i++) {
          hosHeadImgs.push({name: idArray[i], url: 'http://baxitang.com/images/'+idArray[i]})
        }
        this.hosHeadImgFileList  =hosHeadImgs

        let hosZzImgs = [];//医院资历图片
        let idArray2 = (params.row.hosZzImg+'').split(',')
        for(let i=0; i<idArray2.length; i++) {
          hosZzImgs.push({name: idArray2[i], url: 'http://baxitang.com/images/'+idArray2[i]})
        }
        this.hosZzImgFileList  =hosZzImgs


        let expertsImg = [];//专家图片
        let idArray3 = (params.row.expertsImg+'').split(',')
        for(let i=0; i<idArray3.length; i++) {
          expertsImg.push({name: idArray3[i], url: 'http://baxitang.com/images/'+idArray3[i]})
        }
        this.expertsImgFileList  =expertsImg
        // params.row.isFlag
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
              this.$api.portalmanage.addHospital(params).then((res) => {
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
          {prop: "id", label: "ID", minWidth: 50},
          {prop: "hosName", label: "医院名称", minWidth: 50},
          {prop: "isFlag", label: "状态", minWidth: 50,formatter:this.recordStateFormat},
          {prop: "createUser", label: "创建人", minWidth: 50},
          {prop: "createTime", label: "创建时间", minWidth: 50,formatter:this.dateFormat},
        ]
        this.filterColumns = this.columns;
      },
      //初始化二级科室数据
      initDepartTwoData:function(){
        this.$api.portalmanage.selectAllDepartTwo().then((res) => {
          // 初始化二级科室
          this.departTwoData = res.rows
        })
      }
    },
    mounted() {
      //this.findDeptTree()
      this.initColumns()
      this.initDepartTwoData()
    }
  }
</script>

<style scoped>

</style>
