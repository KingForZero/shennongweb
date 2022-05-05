<template>
  <div class="page-container">
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio" size="medium" @change="change">
        <el-radio-button label="营养方案" ></el-radio-button>
        <el-radio-button label="产品介绍"></el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="type == '1'">
      <!--工具栏-->
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.diseaseCause" placeholder="病因"></el-input>
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
        <el-table-column property="name" label="方案名称" width="200px">
        </el-table-column>
        <el-table-column property="diseaseCause" label="病因病机" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="form" label="产品组成" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="note" label="注意事项" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="detail(scope.row)" type="text" size="small">编辑</el-button>
            <el-button  @click="del(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页栏-->
      <div class="toolbar" style="padding:10px;">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                       :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
        </el-pagination>
      </div>
    </div>
    <div v-if="type == '2'">
      <!--工具栏-->
      <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
        <el-form :inline="true" :model="filters" :size="size">
          <el-form-item>
            <el-input v-model="chanPinFilters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="chanPinFilters.effect" placeholder="功效"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary"
                       @click="findChanPinPage(null)"/>
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary"
                       @click="handleChanPinAdd" />
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="chanPinPageResult.rows" style="width: 100%">
        <el-table-column type="index" label="序号" >
        </el-table-column>
        <!--		<el-table-column property="id" label="id" >-->
        <!--		</el-table-column>-->
        <el-table-column property="name" label="名称" width="200px">
        </el-table-column>
        <el-table-column property="form" label="成分" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="effect" label="功效" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="price" label="价格" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button  @click="chanpinDetail(scope.row)" type="text" size="small">编辑</el-button>
            <el-button  @click="chanpinDel(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页栏-->
      <div class="toolbar" style="padding:10px;">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshChanPinPageRequest"
                       :current-page="chanPinPageRequest.pageNum" :page-size="chanPinPageRequest.pageSize"
                       :total="chanPinPageRequest.total" style="float:right;">
        </el-pagination>
      </div>
    </div>

    <!--详情界面-->
    <el-dialog title="编辑" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="方案名称" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :action="uploadUrl()"
            multiple
            accept="image/png, image/jpeg"
            :file-list="fileList"
            list-type="picture-card"
            :before-upload="beforeUploadPicture"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove1"
            :on-success="uploadSuccess"
            :show-file-list="true">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="病因病机" prop="diseaseCause">
          <el-input type="textarea" autosize v-model="dataForm.diseaseCause" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品组成" prop="form">
          <el-input type="textarea" autosize v-model="dataForm.form" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="注意事项" prop="note">
          <el-input type="textarea" autosize v-model="dataForm.note" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div  style="text-align: center" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" width="50%" :visible.sync="chanPinDialogVisible" :close-on-click-modal="false">
      <el-form :model="chanPinForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="chanPinForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="chanPinForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :action="uploadUrl()"
            multiple
            accept="image/png, image/jpeg"
            :file-list="fileList"
            list-type="picture-card"
            :before-upload="beforeUploadPicture"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove1"
            :on-success="uploadSuccess1"
            :show-file-list="true">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="组成" prop="diseaseCause">
          <el-input type="textarea" autosize v-model="chanPinForm.form" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="功效" prop="form">
          <el-input type="textarea" autosize v-model="chanPinForm.effect" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="note">
          <el-input  v-model="chanPinForm.price" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div  style="text-align: center" class="dialog-footer">
        <el-button :size="size" @click.native="chanPinDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="chanPinSubmitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
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
          return "http://baxitang.com/images/"+row.fileUrl
        },
        isShow:false,
        radio:'经典处方',
        activeName:"1",
        size: 'small',
        type:'1',
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        chanPinPageRequest: { pageNum: 1, pageSize: 10 },
        chanPinPageResult: {},
        filters:{

        },
        chanPinFilters:{

        },
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        chanPinDialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataForm:{
          id:'',
          name:'',
          image:'',
          diseaseCause:'',
          form:'',
          note:''
        },
        chanPinForm:{
          id:'',
          name:'',
          image:'',
          form:'',
          effect:'',
          price:''
        },
        medicalForm:{
          medicalList:[],
        },
        fileList:[],
        dataFormRules: {
          title: [
            { required: true, message: '请输入主题', trigger: 'blur' }
          ]
        },
        restaurants:[]

      }
    },
    methods: {
      handleRemove1(file, fileList){
        this.fileChange1(fileList);
      },
      // 设置photo值
      fileChange1(fileList) {
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
            }else{
              if(i===0){
                temp_str += fileList[i].name;
              } else {
                // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开）
                temp_str += ',' + fileList[i].name;
              }
            }
          }
        }
        this.chanPinForm.image = temp_str;
      },
      // 上传图片成功
      uploadSuccess1(res, file, fileList) {
        this.fileChange1(fileList);
      },
      // 移除图片
      handleRemove(file, fileList) {
        this.fileChange(fileList);
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
            }else{
              if(i===0){
                temp_str += fileList[i].name;
              } else {
                // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开）
                temp_str += ',' + fileList[i].name;
              }
            }
          }
        }
        this.dataForm.image = temp_str;
      },
      // 上传图片成功
      uploadSuccess(res, file, fileList) {
        this.fileChange(fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.isShowImage = true;
      },
      // 上传图片前调用方法
      beforeUploadPicture(file) {
        if(file.size > 10*1024*1024){
          this.$message.error("上传图片不能大于10M");
          return false;
        }
      },
      uploadUrl(){
        //return baseUrl+"/system/upload";
        return "http://baxitang.com/sh/system/upload"
      },
      detail(row){

        this.$api.yingyang.selectById({id:row.id}).then((res) => {
          this.dialogVisible = true
          this.dataForm = res.rows
          if(res.rows.image){
            let files=[]
            let idArray = (res.rows.image+'').split(',')
            for(var i=0; i<idArray.length; i++) {
              files.push({name: idArray[i], url: "http://baxitang.com/images/"+idArray[i]})
            }
            //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            this.fileList  =files
            console.log(this.fileList);
          }else{
            this.fileList = []
          }
          // this.zhongyi(res.rows.pharmacy)
        }).then()

      },
      chanpinDetail(row){

        this.$api.chanpin.selectById({id:row.id}).then((res) => {
          this.chanPinDialogVisible = true
          this.chanPinForm = res.rows
          if(res.rows.image){
            let files=[]
            let idArray = (res.rows.image+'').split(',')
            for(var i=0; i<idArray.length; i++) {
              files.push({name: idArray[i], url: "http://baxitang.com/images/"+idArray[i]})
            }
            //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            this.fileList  =files
            console.log(this.fileList);
          }else{
            this.fileList = []
          }
          // this.zhongyi(res.rows.pharmacy)
        }).then()

      },
      submitForm(){
        this.$api.yingyang.save(this.dataForm).then((res) => {
          if(res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.dialogVisible = false
            this.findPage(null)
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        }).then()

      },
      chanPinSubmitForm(){
        this.$api.chanpin.save(this.chanPinForm).then((res) => {
          if(res.code == 200) {
            this.$message({ message: '操作成功', type: 'success' })
            this.chanPinDialogVisible = false
            this.findChanPinPage(null)
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
        }).then()
      },
      handleChanPinAdd(){
        this.chanPinDialogVisible = true
        this.fileList = []
        this.chanPinForm = {
          id:'',
          name:'',
          image:'',
          form:'',
          effect:'',
          price:''
        }
      },
      handleAdd(){
        this.dialogVisible = true
        this.fileList = []
        this.dataForm = {
          id:'',
          name:'',
          image:'',
          diseaseCause:'',
          form:'',
          note:''
        }
      },
      del(row){
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.$api.yingyang.deleteById({id:row.id}).then((res) => {
            if(res.code == 200) {
              this.$message({ message: '操作成功', type: 'success' })
              this.findPage(null)
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
          })
        })
      },
      chanpinDel(row){
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.$api.chanpin.deleteById({id:row.id}).then((res) => {
            if(res.code == 200) {
              this.$message({ message: '操作成功', type: 'success' })
              this.findChanPinPage(null)
            } else {
              this.$message({message: '操作失败, ' + res.msg, type: 'error'})
            }
          })
        })
      },

      handlerNumber(val,index){
        if(this.medicalForm.medicalList[index].price&&val){
          this.medicalForm.medicalList[index].amount =
            (Number.parseFloat(val)*Number.parseFloat(this.medicalForm.medicalList[index].price)).toFixed(2)
        }
      },
      change(value){
        console.log(value)
        if('营养方案'==value){
          this.type = '1'
          this.findPage(null)
        }else if('产品介绍' == value){
          this.type = '2'
          this.findChanPinPage(null)
        }
      },

      findPage: function (data) {
        if(data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.columnFilters = {}
        if(this.filters.name){
          this.pageRequest.columnFilters.name = {name:'name',value:this.filters.name}
        }
        if(this.filters.diseaseCause){
          this.pageRequest.columnFilters.diseaseCause = {name:'diseaseCause',value:this.filters.diseaseCause}
        }
        this.$api.yingyang.selectList(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data!=null?data.callback:'')
      },
      findChanPinPage: function(data){
        if(data !== null) {
          this.chanPinPageRequest = data.chanPinPageRequest
        }
        if(this.chanPinFilters.name){
          this.chanPinPageRequest.columnFilters.name = {name:'name',value:this.chanPinFilters.name}
        }
        this.$api.chanpin.selectList(this.chanPinPageRequest).then((res) => {
          this.chanPinPageResult = res
        }).then(data!=null?data.callback:'')
      },
      refreshChanPinPageRequest:function(pageNum){
        this.chanPinPageRequest.pageNum  = pageNum
        this.findChanPinPage(null)
      },
      refreshPageRequest: function(pageNum){
        this.pageRequest.pageNum  = pageNum
        this.findPage(null)
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
