<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.userName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.recordState" placeholder="请选择">
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findMedicalRecord(null)"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      
    </div>
    <!--表格内容栏-->
    <el-table :data="medicalRecordPage.rows" style="width: 100%">
						
            <el-table-column type="index" label="序号"></el-table-column>
						<!-- <el-table-column label="ID" prop="recordId"></el-table-column> -->
						<el-table-column label="患者姓名" prop="userName"></el-table-column>
             <el-table-column label="患者电话" prop="userTel"></el-table-column>
            <el-table-column label="主治医生" prop="docName"></el-table-column>
						<el-table-column label="是否初诊" prop="changeDoc" :formatter="changeDocFormatter"></el-table-column>
						<el-table-column label="状态" prop="recordState" :formatter="recordStateFormatter">
						</el-table-column>
			      <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
            <el-table-column label="审核时间" prop="auditTime" :formatter="auditTimeFormatter"></el-table-column>
			      <el-table-column label="审核人" prop="auditName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
				    <el-button  @click="yaofang(scope.row.recordId)" type="text" size="small">查看药方</el-button>
                  <el-button v-if="scope.row.recordState == '6'" @click="audit(scope.row,1)" type="text" size="small">审核通过</el-button>
                  <el-button v-if="scope.row.recordState == '6'" @click="audit(scope.row,0)" type="text" size="small">驳回</el-button>
				          <el-button v-if="scope.row.recordState == '5'" @click="reject(scope.row)" type="text" size="small">查看驳回原因</el-button>
              </template>
            </el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalRecord" 
						:current-page="medicalRecordPage.pageNum" :page-size="medicalRecordPage.pageSize" :total="medicalRecordPage.total" style="float:right;">
					</el-pagination>
					</div>
          <el-dialog  title="电子处方"  width="80%" :visible.sync="showYaoFang" :close-on-click-modal="false">
            <div  v-for="(item,index) in chufang" :key="index">

            
            <el-form label-width="90px" class="demo"  v-if="item.pharmacy!='5' && item.pharmacy!='6'">
                  <h2 align="left">第{{index+1}}张处方</h2>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="处方日期：" >
                          <el-input v-model="item.recipeDate" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      
                      <el-col :span="8">
                        <el-form-item label="药房：" >
                           <span v-if="item.pharmacy == '1'">桐君堂</span>
                           <span v-if="item.pharmacy == '2'">康仁堂</span>
                           <span v-if="item.pharmacy == '3'">天江药业</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="处方类型：">
                          <el-select v-model="item.chufangType" disabled>
                            <el-option label="康复调理" value="1"></el-option>
                            <el-option label="一般处方" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="中药种类：">
                          <el-select v-model="item.medicalType" disabled>
                            <el-option label="饮片类" value="1"></el-option>
                            <el-option label="颗粒类" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="加工方式：">
                          <el-select v-model="item.madeType" disabled>
                            <el-option label="大蜜丸" value="1"></el-option>
                            <el-option label="浓缩丸" value="2"></el-option>
                            <el-option label="水丸" value="3"></el-option>
                            <el-option label="水蜜丸" value="4"></el-option>
                            <el-option label="打粉" value="5"></el-option>
                            <el-option label="膏方" value="6"></el-option>
                            <el-option label="汤剂" value="7"></el-option>
                            <el-option label="饮片" value="8"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                     <el-col :span="8">
                        <el-form-item label="剂数：">
                          <el-input-number v-model="item.dosage" disabled>
                            <template slot="append">剂</template>
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="总重量：" >
                          <el-input :disabled="true" v-model="item.weight">
                            <template slot="append">克</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药费：" >
                          <el-input :disabled="true" v-model="item.amount">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                       <el-col :span="8">
                        <el-form-item label="加工费：">
                          <el-input :disabled="true" v-model="item.processCost">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="服务费：">
                          <el-input  v-model="item.serviceFee" disabled>
                            <template slot="append">%</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="邮费：" >
													<el-input v-model="item.postage" disabled>
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="临床诊断：" >
                           <span>{{item.clinical}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="嘱托：" >
                           <span>{{item.entrust}}</span>
                        </el-form-item>
                      </el-col>
                       <el-col :span="8">
                        <el-button @click="chakan(item)" type="primary">查看药品</el-button>
                      </el-col>
                    </el-row>
                   
                      
                  </el-form>
              <el-form label-width="90px" class="demo" v-else>
                <h2 align="left">第{{index+1}}张处方</h2>

                <el-row :gutter="15">
                  <el-col :span="8">
                    <el-form-item label="处方类型：">
                      <el-select v-model="item.pharmacy" disabled>
                        <el-option label="国内营养素" value="5"></el-option>
                        <el-option label="国际营养素" value="6"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="药费：" >
                      <el-input :disabled="true" v-model="item.amount">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="服务费：">
                      <el-input  v-model="item.serviceFee" disabled>
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮费：" >
                      <el-input v-model="item.postage" disabled>
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="16">
                    <el-form-item label="临床诊断：" >
                      <span>{{item.clinical}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="16">
                    <el-form-item label="嘱托：" >
                      <span>{{item.entrust}}</span>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="" >
                      <!-- <el-button type="primary" @click="getPdf">生出电子处方</el-button> -->
                      <el-button @click="chakan(item)" type="primary" plain>查看药品</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
                  </div>
          </el-dialog>
          <el-dialog  title="药品详情"  width="60%" :visible.sync="isShowYaoping" :close-on-click-modal="false">
            <el-table :data="medicalPage.rows" style="width: 100%">
              <el-table-column type="index" label="序号">
              </el-table-column>
              <el-table-column property="id" label="id" v-if="false">
              </el-table-column>
              <el-table-column property="name" label="药名">
              </el-table-column>
              <el-table-column property="price" label="单价">
              </el-table-column>
              <el-table-column property="number" label="数量">
              </el-table-column>
              <el-table-column property="amount" label="金额">
              </el-table-column>
              <el-table-column property="entrust" label="嘱托">
              </el-table-column>
              <el-table-column property="createUser" label="添加人">
              </el-table-column>
              <el-table-column property="createTime" label="添加时间" :formatter="timeFormatter">
              </el-table-column>
          </el-table>
          </el-dialog>
          <!--审核驳回-->
          <el-dialog  title="驳回"  width="60%" :visible.sync="isShowBohui" :close-on-click-modal="false">
            <el-form :model="bohuiForm" label-width="80px" :rules="dataFormRules" ref="medicalForm" :size="size" label-position="right">
              <el-form-item label="驳回原因：" prop="msg">
                <el-input type="text" v-model="bohuiForm.msg"  auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowBohui = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitBohuiForm">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
          <el-dialog  title="选择药房"  width="20%" :visible.sync="isShow" :close-on-click-modal="false">
            <el-form :model="yaofangForm" label-width="100px" :rules="yaofangFormRules" ref="yaofangForm" :size="size" label-position="right">
              
              <el-form-item label="请输入折扣" prop="discount">
                  
                   <el-input-number v-model="yaofangForm.discount" :precision="2" :step="0.1" :max="1"></el-input-number>
                </el-form-item>
                 <el-form-item label="请预估邮费" prop="postage">
                   <el-input type="text" v-model="yaofangForm.postage"  auto-complete="off">
                     <template slot="append">元</template>
                   </el-input>
                </el-form-item>
               
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShow = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitTongguo" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
  </div>
</template>
<script>
  import PopupTreeInput from "@/components/PopupTreeInput"
  import KtTable from "@/views/Core/KtTable"
  import KtButton from "@/views/Core/KtButton"
  import Medical from "@/views/Core/Medical"
  import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
  import { format } from "@/utils/datetime"
  import UEditor from '@/components/ueditor/ueditor.vue'
import { timestampToDate } from "@/utils/datetime"
import { timestampToTime } from "@/utils/datetime"
import { baseUrl } from '@/utils/global'
import { imageUrl } from '@/utils/global'
import InquirySheet from "@/views/Core/InquirySheet"
  export default {
    components:{
      PopupTreeInput,
      KtTable,
      KtButton,
      TableColumnFilterDialog,
      UEditor,
      Medical,
      InquirySheet
    },
    data() {
      return {
        isShowYaoping:false,
        chufang:[],
        yaofangForm:{
          recordId:'',
          discount:1
        },
        bohuiForm:{
          recordId:'',
          type:'',
          msg:''
        },
        isShow:false,
        states:[
			{
            value: '5,6,7,8,9,91,10,11,12',
            label: '全部'
          },
          {
            value: '5',
            label: '药师审核驳回'
          },
          {
            value:'6',
            label:'待药师审核'
          },
          {
            value: '8',
            label: '待付费'
          },
          {
            value: '9',
            label: '待下单'
          },
          {
            value: '91',
            label: '已下单'
          },
          {
            value:'10',
            label:'已发货'
          },
          {
            value: '11',
            label: '已完成'
          },
          {
            value: '12',
            label: '已取消'
          }
        ],
        isShowSheet:false,
        row:{},
        showYaoFang:false,
        inquirySheet:{},
        size: 'small',
        medicalRecordPage:{pageNum:1,pageSize:10},
        filters: {
          userName: '',
          recordState:'5,6,7,8,9,91,10,11,12'
        }, 
        columnFilters:{
          
        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        currentUserId:{},
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
        dataFormRules: {
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        },
        yaofangFormRules: {
          pharmacyId: [
            { required: true, message: '请选择药房', trigger: 'blur' }
          ],
          postage: [
            { required: true, message: '请填写邮费', trigger: 'blur' }
          ]
        },
        
        // 新增编辑界面数据
        medicalForm: {
          id: '',
          name: '',
          medicalRecordId: '',
          number: '',
          unit:'',
          amount:''
        },
        deptData: [],
        roles: [],
        departMentOneList:[],
        departMentTwoList:[],
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
        addFormVisible: false,
        medicalPage:{pageNum:1,pageSize:10},
        recordId:'',
        isShowBohui:false,
        isShowHealthRecord:false,
        healthRecord:{},
        prescribiing:{},
        yaofangList:[]
      }
    },
    methods: {
      selectYaofang(){
        this.$api.assistant.selectYaofang().then((res) => {
				if(res.code == '200'){
					this.yaofangList = res.rows
				}	
			})
      },
      showHealthRecord(userId){
        this.isShowHealthRecord = true
			this.$api.assistant.selectHealthRecord({userId:userId}).then((res) => {
				if(res.code == '200'){
					this.healthRecord = res.rows
				}	
			})
      },
		reject(row){
			this.$alert(row.reject, '审核不通过原因', {
				confirmButtonText: '确定'
				});
		},
		submitBohuiForm(){
				this.bohuiForm.type = '0'
				this.$api.assistant.audit(this.bohuiForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
                this.isShowBohui = false
              })
    },
    submitTongguo(){
      this.$refs.yaofangForm.validate((valid) => {
        if (valid) {
				this.$api.assistant.auditTongGuo(this.yaofangForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
                this.isShow = false
              })
          }
      })
    },
    
    auditTimeFormatter:function(row) {
      if(row.auditTime){
        return timestampToTime(row.createTime)
      }else{
        
      }
		},
		audit(row,value){
      this.bohuiForm.recordId = row.recordId
      this.yaofangForm.recordId = row.recordId
			if(value == '1'){
        this.selectYaofang()
        this.isShow = true
			}else{
				this.isShowBohui = true
			}
		},
      mark(row,value){
          row.compare = value
        this.$api.assistant.updateCompare(row).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
      },
      sendDoctor(row){
        this.$api.assistant.pushDoctor(row).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
      },
      tijiao(row){
         this.$api.assistant.pushYs(row).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
      },
      isShowSheetMethod(value){
			this.isShowSheet = value
        },
        showSheet(id){
          this.$api.healthHouseKeeper.selectInquirySheetById({id:id}).then((res) => {
            if(res.code == '200'){
              this.inquirySheet = res.rows
            }	
          })
          this.isShowSheet = true
        },
      bzShow(status){
        if(Number.parseInt(status)<7){
          return true;
        }else{
          return false;
        }
      },
      changeRow(row, expandedRows){
        this.row = row;
      },
      baocun(row){
        row.extraPic = this.row.extraPic
        row.docPic = this.row.docPic
        this.$confirm('确认保存吗？', '提示', {}).then(() => {
              this.$api.assistant.doctorCommit(row).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
            })

      },
      handleDocSuccess(res,file){
        this.row.docPic = imageUrl+res.rows;
      },
      handleExtraSuccess(res, file) {
				this.row.extraPic = imageUrl+res.rows;
			},
			beforeAvatarUpload(file) {
				const isJPG = (file.type === 'image/jpeg'||file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
      uploadUrl(){
        //return baseUrl+"/system/upload";
        return "http://39.106.123.28/sh/system/upload"
			},
      editMedical:function (row) {
        this.medicalForm = Object.assign(this.medicalForm,row)
        this.isShow = true
      },
      deleteMedical:function(row){
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
              this.$api.assistant.deleteById({id:row.id}).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShow = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalPage(null)
              })
            })
      },
      add(){
        for (let k in this.medicalForm) {
          this.medicalForm[k] = ''
      }
			  this.isShow = true	
      },
      chakan(item){
        this.prescribiing = item
        this.findMedicalPage(null)
        this.isShowYaoping = true
      },
      //查看药方
      yaofang:function (value) {
        //查询电子处方
      this.$api.healthHouseKeeper.selectByRecordIdPrescribing({recordId:value}).then((res) => {
            if(res.code == '200'){
              this.chufang = res.rows
              
              this.showYaoFang = true
            }	
          })
        this.recordId = value
       
      },
      //获取文档内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        console.log(content);
        alert(content);
      },
      // 获取会员医疗记录分页数据
      findMedicalRecord: function (data) {
        if(data){
          this.medicalRecordPage = data
        }
        this.columnFilters.userName = {name:'userName',value:this.filters.userName}
        this.columnFilters.compare = {name:'compare',value:this.filters.compare}
        this.columnFilters.recordState = {name:'recordState',value:this.filters.recordState}
        this.medicalRecordPage.columnFilters = this.columnFilters
        this.$api.healthHouseKeeper.selectByContion(this.medicalRecordPage).then((res) => {
          if(res.code == '200'){
            this.medicalRecordPage = res
          }	
        })
      },
      // 获取药方分页数据
      findMedicalPage: function (data) {
     
        this.$api.assistant.selectMedicalAll({recordId:this.prescribiing.id}).then((res) => {
          this.medicalPage = res
        })
      },
      //会员医疗记录列表幻夜刷新
		refreshMedicalRecord: function(pageNum){
			this.medicalRecordPage.pageNum  = pageNum
			this.findMedicalRecord(this.medicalRecordPage)
    },
    //药方表换页刷新
    refreshMedicalPageRequest:function(pageNum){
      this.medicalPage.pageNum = pageNum
      this.findMedicalPage(this.medicalPage)
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
      submitMedicalForm: function () {
        this.medicalForm.medicalRecordId = this.recordId
        this.$refs.medicalForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              let params = Object.assign({}, this.medicalForm)
              this.$api.assistant.add(params).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShow = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalPage(null)
              })
            })
          }
        })
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index){
        return format(row[column.property])
      },
      periodFormatter: function(row){

			return timestampToDate(row.startTime)+"到"+timestampToDate(row.endTime)
		},
		dataFormatter:function(row) {
      if(row.createTime){
        return timestampToDate(row.createTime)
      }else{

      }
		},
		timeFormatter:function(row) {
      if(row.createTime){
        return timestampToTime(row.createTime)
      }else{
        
      }
		},
		activeFormatter:function(row){
			switch (row.active){
				case "0":
					return "禁用";
				break;
				case "1":
					return "启用";
				break;
			}
    },
    	sexFormatter: function (row, column, cellValue, index){
			switch(row.userSex){
				case "1":
						return '男'
					break;
				case "0":
						return '女'
					break;
				default :
						return '未知'
				
			}
          	return format(row[column.property])
      	},
//判断是否是初诊
		changeDocFormatter:function(row){
			switch (row.changeDoc){
				case '0':
					return "是";
				break;
				case '1':
					return '否';
				break;
			}
    },
    //对照状态格式化
    compareFormatter:function(row){
      switch (row.compare){
				case '1':
					return "对照组";
				break;
				case '2':
					return '实验组';
				break;
			}
    },
		//医疗记录状态格式化
		recordStateFormatter:function(row){
			switch (row.recordState){
			  case '1':
          return "新增";
        case '2':
          return "待医生处理";
        case '3':
          return "医生已处理";
        case '4':
          return "已预约面诊";
        case '5':
          return "药师审核驳回";
        case '6':
          return "待药师审核";
        case '7':
          return "待划价";
        case '8':
          return "待付费";
        case '9':
          return "待下单";
        case '91':
          return "已下单";
        case '10':
          return "已发货";
        case '11':
          return "已完成";
        case '12':
          return "已取消";
			}
		}
		
    },
    mounted() {
      this.findMedicalRecord(null)
    },
    filters:{
		timeStatus:function(value){
			return timestampToTime(value)
		},
		dateStatus:function (value) {
			return timestampToDate(value)
		}
	}
  }
</script>

<style>

  .el-row {
    margin-bottom: 20px;
     margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    text-align: left;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #2e151515;
	width: 100%;
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
