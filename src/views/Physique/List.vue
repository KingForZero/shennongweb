<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
<!--			<el-form-item>-->
<!--				<el-input v-model="filters.tel" placeholder="电话"></el-input>-->
<!--			</el-form-item>-->
<!--			<el-form-item>-->
<!--				<el-input v-model="filters.name" placeholder="姓名"></el-input>-->
<!--			</el-form-item>-->
<!--			<el-form-item>-->
<!--				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>-->
<!--			</el-form-item>-->
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
		<el-table-column property="physiqueName" label="体质类型" width="200px">
		</el-table-column>
		<el-table-column property="introduce" label="描述" show-overflow-tooltip>
		</el-table-column>
		<el-table-column property="reason" label="成因" show-overflow-tooltip>
		</el-table-column>
		<el-table-column property="status" label="操作">
			<template slot-scope="scope">
				<el-button  @click="detail(scope.row)" type="text" size="small">详情</el-button>
				<el-button  @click="bohui(scope.row)" type="text" size="small">保健方案</el-button>
        <el-button  @click="openMedical(scope.row)" type="text" size="small">中药调理</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--分页栏-->
<!--    <div class="toolbar" style="padding:10px;">-->
<!--      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"-->
<!--        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">-->
<!--      </el-pagination>-->
<!--    </div>-->
	<!--用户详情界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.physiqueId" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
      <el-form-item label="体质类型" prop="physiqueName">
        <el-input v-model="dataForm.physiqueName" auto-complete="off"></el-input>
      </el-form-item>
			<el-form-item label="描述" prop="introduce">
				<el-input type="textarea" autosize v-model="dataForm.introduce" auto-complete="off"></el-input>
			</el-form-item>
      <el-form-item label="成因" prop="reason">
        <el-input type="textarea" autosize v-model="dataForm.reason" auto-complete="off"></el-input>
      </el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!--养生方案-->
	<el-dialog title="养生方案" width="50%" :visible.sync="isBohui" :close-on-click-modal="false">
		<el-form :model="regimenForm" label-width="80px"  ref="regimenForm" :size="size"
			label-position="right" style="text-align: center">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="regimenForm.regimenId" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="饮食健康" prop="foodHealth">
				<el-input type="textarea" autosize v-model="regimenForm.foodHealth" auto-complete="off"></el-input>
			</el-form-item>
      <el-form-item label="运动锻炼" prop="sport">
        <el-input type="textarea" autosize v-model="regimenForm.sport" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="情绪调养" prop="feeling">
        <el-input type="textarea" autosize v-model="regimenForm.feeling" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="起居调理" autosize prop="dailyLife">
        <el-input type="textarea" v-model="regimenForm.dailyLife" auto-complete="off"></el-input>
      </el-form-item>
		<!-- <div slot="footer" class="dialog-footer"> -->
			<el-button :size="size" @click.native="isBohui = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitRegimen" :loading="editLoading">{{$t('action.submit')
        }}</el-button>
		<!-- </div> -->
		</el-form>
	</el-dialog>
    <!--中药调理-->
    <el-dialog title="中药调理" width="50%" :visible.sync="isMedical" :close-on-click-modal="false">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="药膳方案" name="1">
          <el-form :model="medicalConditionForm" label-width="80px"  ref="regimenForm" :size="size"
                   label-position="right" style="text-align: center">
            <el-form-item label="图片">
              <el-upload
                :action="uploadUrl()"
                multiple
                accept="image/png, image/jpeg"
                :file-list="fileList"
                list-type="picture-card"
                :before-upload="beforeUploadPicture"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :show-file-list="true">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="名称" prop="foodHealth">
              <el-input type="textarea" v-model="medicalConditionForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="清单"  prop="sport">
              <el-input type="textarea" autosize v-model="medicalConditionForm.repertoire" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="烹煮方法" prop="feeling">
              <el-input type="textarea" autosize v-model="medicalConditionForm.cookingMethod" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="功效" prop="dailyLife">
              <el-input type="textarea" autosize v-model="medicalConditionForm.effect" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="dailyLife">
              <el-input type="textarea" autosize v-model="medicalConditionForm.explain" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <div slot="footer" class="dialog-footer"> -->
            <el-button :size="size" @click.native="isMedical = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitMedical" :loading="editLoading">{{$t('action.submit')
              }}</el-button>
            <!-- </div> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="养生茶饮" name="2">
          <el-form :model="medicalConditionForm" label-width="80px"  ref="regimenForm" :size="size"
                   label-position="right" style="text-align: center">
            <el-form-item label="图片">
              <el-upload
                :action="uploadUrl()"
                multiple
                accept="image/png, image/jpeg"
                :file-list="fileList"
                list-type="picture-card"
                :before-upload="beforeUploadPicture"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :show-file-list="true">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="名称" prop="foodHealth">
              <el-input type="textarea" v-model="medicalConditionForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="清单" prop="sport">
              <el-input type="textarea" autosize v-model="medicalConditionForm.repertoire" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="烹煮方法" prop="feeling">
              <el-input type="textarea" autosize v-model="medicalConditionForm.cookingMethod" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="功效" prop="dailyLife">
              <el-input type="textarea" autosize v-model="medicalConditionForm.effect" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="说明" autosize prop="dailyLife">
              <el-input type="textarea" v-model="medicalConditionForm.explain" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <div slot="footer" class="dialog-footer"> -->
            <el-button :size="size" @click.native="isMedical = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitMedical" :loading="editLoading">{{$t('action.submit')
              }}</el-button>
            <!-- </div> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="穴位调理" name="3">
          <el-form :model="medicalConditionForm" label-width="80px"  ref="regimenForm" :size="size"
                   label-position="right" style="text-align: center">
            <el-form-item label="图片">
              <el-upload
                :action="uploadUrl()"
                multiple
                accept="image/png, image/jpeg"
                :file-list="fileList"
                list-type="picture-card"
                :before-upload="beforeUploadPicture"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :show-file-list="true">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="定位方法" prop="foodHealth">
              <el-input type="textarea" autosize v-model="medicalConditionForm.positioningMethod"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="操作方法" prop="sport">
              <el-input type="textarea" autosize v-model="medicalConditionForm.operationMethod" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="功效" prop="feeling">
              <el-input type="textarea" autosize v-model="medicalConditionForm.effect" auto-complete="off"></el-input>
            </el-form-item>
            <!-- <div slot="footer" class="dialog-footer"> -->
            <el-button :size="size" @click.native="isMedical = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitMedical" :loading="editLoading">{{$t('action.submit')
              }}</el-button>
            <!-- </div> -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="常用中药" name="4">
          <el-form :model="medicalConditionForm" label-width="80px"  ref="regimenForm" :size="size"
                   label-position="right" style="text-align: center">

            <el-form-item label="图片">
              <el-upload
                :action="uploadUrl()"
                multiple
                accept="image/png, image/jpeg"
                :file-list="fileList"
                list-type="picture-card"
                :before-upload="beforeUploadPicture"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :show-file-list="true">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="名称" prop="foodHealth">
              <el-input type="textarea" v-model="medicalConditionForm.name" auto-complete="ofactiveNamef"></el-input>
            </el-form-item>
            <el-form-item label="药物组成" prop="sport">
              <el-input type="textarea" autosize v-model="medicalConditionForm.repertoire" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="功效"  prop="feeling">
              <el-input type="textarea" autosize v-model="medicalConditionForm.effect" auto-complete="off"></el-input>
            </el-form-item>

            <!-- <div slot="footer" class="dialog-footer"> -->
            <el-button :size="size" @click.native="isMedical = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitMedical"
                       :loading="editLoading">{{$t('action.submit')
              }}</el-button>
            <!-- </div> -->
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </el-dialog>
    <el-dialog :visible.sync="isShowImage">
      <img width="100%" :src="dialogImageUrl" alt="">
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
      isShowImage:false,
      dialogImageUrl:"",
			isBohui:false,
      isMedical:false,
      activeName:"1",
      regimenForm:{
        regimenId:'',
        physiqueId:'',
        foodHealth:'',
        sport:'',
        feeling:'',
        dailyLife:'',
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
        physiqueId:'',
        physiqueName:'',
        introduce:'',
        reason:''
			},
      medicalConditionForm:{
        conditionId:"",
        physiqueId:"",
        type:"",
        image:"",
        name:"",
        repertoire:"",
        cookingMethod:"",
        effect:"",
        explain:"",
        operationMethod:"",
        positioningMethod:"",
      },
      physiqueId:"",
      fileList:[],
			dataFormRules: {
				title: [
					{ required: true, message: '请输入主题', trigger: 'blur' }
				]
			},

		}
	},
	methods: {
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
      this.medicalConditionForm.image = temp_str;
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
      return "http://39.106.123.28/sh/system/upload"
    },
	  selectMecicalCondition(physiqueId,type){
      this.$api.physique.selectMedicalConditionById({id:physiqueId,type:type}).then((res) => {
        if(res.code == 200) {
          this.medicalConditionForm = res.rows
          this.medicalConditionForm.type = this.activeName
          this.medicalConditionForm.physiqueId = this.physiqueId
          if(res.rows.image){
            let files=[]
            let idArray = (res.rows.image+'').split(',')
            for(var i=0; i<idArray.length; i++) {
              files.push({name: idArray[i], url: "http://39.106.123.28/images/"+idArray[i]})
            }
            //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
            this.fileList  =files
          }else{
            this.fileList = []
          }

        } else {
          this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        }
      })
    },
    handleClick(tab, event) {
      this.selectMecicalCondition(this.physiqueId,this.activeName)
    },
		dateFormat: function (row, column, cellValue, index){
			if(row[column.property]){
				return timestampToTime(row[column.property])
			}else{

			}
          
      	},
    detail(row){
			this.$api.physique.selectById({id:row.physiqueId}).then((res) => {
				if(res.code == 200) {
					this.dataForm = res.rows
          this.dialogVisible = true
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.findPage(null)
			})
		},
		bohui(row){
      this.regimenForm.physiqueId = row.physiqueId
      this.$api.physique.selectReginmenById({id:row.physiqueId}).then((res) => {
        if(res.code == 200) {
          this.regimenForm = res.rows
          this.regimenForm.physiqueId = row.physiqueId
          this.isBohui = true
        } else {
          this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        }
      })
		},
    openMedical(row){
	    this.activeName = "1"
	    this.physiqueId = row.physiqueId
      this.selectMecicalCondition(this.physiqueId,this.activeName)
      this.isMedical = true
    },
    submitRegimen(){
			this.$api.physique.editReginmenById(this.regimenForm).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.isBohui = false
			})
		},
    submitMedical(){
      this.$api.physique.editMedicalCondition(this.medicalConditionForm).then((res) => {
        if(res.code == 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        }
      })
    },
		handleAdd(){
      this.dataForm = {
        physiqueId:'',
        physiqueName:'',
        introduce:'',
        reason:''
      }
			this.dialogVisible = true
		},
			submitHealthGuidance(){
				this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true

						this.$api.healthHouseKeeper.saveHealthGuidance(this.healthGuidanceForm).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.isHealthGuidance = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.refreshHealthGuidance(1)
						})
					})
				}
			})
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
			this.$api.physique.selectList().then((res) => {
				this.pageResult = res
			}).then(data!=null?data.callback:'')
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						this.$api.physique.edit(this.dataForm).then((res) => {
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
