<template>
  <div>
		<el-form :model="dataForm" :rules="dataFormRules" ref="dataForm" size="small" label-position="right" label-width="80px" class="demo-ruleForm login-container">
      <!-- <span class="tool-bar">
      <!-- 主题切换
      <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
      <!-- 语言切换
      <lang-selector class="lang-selector"></lang-selector>
    </span> -->
			<img style="width:135px" :src="logoUrl"/>
      <h2 class="title">注册账号</h2>
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="name">
				<el-input v-model="dataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机" prop="tel" required>
				<el-input v-model="dataForm.tel" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="验证码" prop="code">
				<el-input v-model="dataForm.code" auto-complete="off" style="width:64%"></el-input>
				<el-button v-show="sendAuthCode"  @click="getAuthCode" style="width:30%">获取验证码</el-button>
    		<el-button v-show="!sendAuthCode"  style="width:30%">{{auth_time}} 秒</el-button>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input v-model="dataForm.password" type="password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="checkPass" required>
				<el-input v-model="dataForm.checkPass" type="password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色" prop="employeeRoles">
				<el-select v-model="dataForm.employeeRoles" multiple placeholder="请选择"
					 style="width: 100%;" @change="isDocFun">
					<el-option v-for="item in roles" :key="item.id"
						:label="item.remark" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<template v-if="isDoc">

				<el-form-item label="选择助理" prop="assisantId" :rules="[
      { required: true, message: '请选择助理', trigger: 'blur' }
    ]">
					<el-select v-model="dataForm.assisantId"   placeholder="请选择"
					 style="width: 100%;" >
					<el-option v-for="item in assisantList" :key="item.id"
						:label="item.name" :value="item.id">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="选择类别" prop="docType" :rules="[
      { required: true, message: '请选择类别', trigger: 'blur' }
    ]">
					<el-radio-group v-model="dataForm.docType" @change="typeFun">
						<el-radio label="1">康复调理</el-radio>
						<el-radio label="2">专科医生</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="一级科室" prop="docDepartment" v-if="isType" :rules="[
      { required: true, message: '请选择科室', trigger: 'blur' }
    ]">
					<el-select v-model="dataForm.docDepartment"  placeholder="请选择"
					 style="width: 100%;">
					<el-option v-for="item in departMentOneList" :key="item.departmentOneId"
						:label="item.departmentOneName" :value="item.departmentOneId">
					</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否收费" prop="docLevel" :rules="[
      { required: true, message: '请选择是否收费', trigger: 'blur' }
    ]">
					<el-radio-group v-model="dataForm.docLevel" @change="isFeeFun">
						<el-radio label="0">免费</el-radio>
						<el-radio label="1">收费</el-radio>
					</el-radio-group>
				</el-form-item>
				<template v-if="isFee">
					<el-form-item label="挂号费" prop="registrationFee" :rules="[
      { required: true, message: '请输入挂号费', trigger: 'blur' }
    ]">
						<el-input v-model="dataForm.registrationFee" auto-complete="off"></el-input>
					</el-form-item>
				</template>
					<el-form-item label="简介" prop="docMark">
					<el-input type="textarea" autosize v-model="dataForm.docMark" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="执业证号码" prop="docJobId">
				<el-input v-model="dataForm.docJobId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="身份证号码" prop="docCardId">
				<el-input v-model="dataForm.docCardId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="职称" prop="docPosition">
				<el-input v-model="dataForm.docPosition" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="毕业院校" prop="graduateSchool">
				<el-input v-model="dataForm.graduateSchool" auto-complete="off"></el-input>
			</el-form-item>
				<el-form-item label="所在医院" prop="docHospital">
					<el-input v-model="dataForm.docHospital" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="医生资质证明" prop="graduateSchool">

				</el-form-item> -->

			</template>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="dataForm.age" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="头像">
				<el-upload
				accept="image/*"
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload">
				<img v-if="dataForm.docHeadImg" :src="headSrc(dataForm.docHeadImg)" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
			<el-form-item label="签名图" v-if="isSign">
				<el-upload
				accept="image/*"
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess1"
				:before-upload="beforeAvatarUpload1" style="width:100%">
				<img v-if="dataForm.sign" :src="headSrc(dataForm.sign)" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button :size="size" @click.native="fanhui">返回</el-button>
				<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
			</el-form-item>
		</el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from "js-cookie"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
import { baseUrl } from '@/utils/global'
import { imageUrl } from '@/utils/global'
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
    TableColumnFilterDialog,
    ThemePicker,
    LangSelector
	},
	data() {
		var validateMobilePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不可为空'));
        } else {
          if (value !== '') {
            var reg=/^1[3456789]\d{9}$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的手机号码'));
            }
          }
          callback();
        }
			};
			var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dataForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
		return {
			logoUrl:require("../assets/logo_kitty_blue.png"),
			isSign:false,
			sendAuthCode:true,
      auth_time: 0,
			size: 'small',
			isDoc:false,
			isAssistant:false,
			isKeeper:false,
			isCustomer:false,
			isFee:true,
			currentIndex:0,
			remarkArr:[],
			filters: {
				tel: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
				tel: [
					{validator: validateMobilePhone, trigger: 'blur' }
				],
				code:[
					{required: true, message: '请填写验证码', trigger: 'blur'}
				],
				employeeRoles:[
					{required: true, message: '请选择角色', trigger: 'blur'}
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: '',
				name: '',
				docHeadImg:'',
				password: '',
				tel: '',
				code:'',
				age:'',
				sex:'',
				sign:'',
				address:'',
				workAddress:'',
				graduateSchool:'',
				docType:'',
				docIntegral:'',
				docMark:'',
				docHospital:'',
				docDepartmentOne:'',
				docDepartment:'',
				docLevel:"1",
				registrationFee:'',
				employeeRoles:[],
				assisantId:'',
			},
			deptData: [],
			roles: [],
			departMentOneList:[],
			departMentTwoList:[],
			assisantList:[],
			isType:false
		}
	},
	methods: {
		typeFun:function(data){

			if(data==1){
				this.isType = false
			}else if(data == 2){
				this.isType = true
			}
		},
		handleAvatarSuccess1(res, file) {
				this.dataForm.sign = res.rows;

			},
			beforeAvatarUpload1(file) {
				const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		headSrc(url){
				return imageUrl+url
			},
		getAuthCode:function () {
						this.$api.user.sendSmsCode({tel:this.dataForm.tel}).then((res) => {
						this.$message({ message: '发送成功', type: 'success' })
					})
            this.sendAuthCode = false;
            this.auth_time = 60;
            var auth_timetimer =  setInterval(()=>{
                this.auth_time--;
                if(this.auth_time<=0){
                    this.sendAuthCode = true;
                    clearInterval(auth_timetimer);
                }
            }, 1000);
        },
			uploadUrl(){
				// return baseUrl+"/system/upload";
				return "http://baxitang.com/sh/system/upload";
			},
			handleAvatarSuccess(res, file) {
				this.dataForm.docHeadImg = res.rows;
			},
			beforeAvatarUpload(file) {
				const isJPG = (file.type === 'image/jpeg'|| file.type === 'image/png');
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		changeDepartmentTwo: function(data){

			this.$api.department.findDepartmentTwoByid({"departmentOneId":data}).then((res) => {
				// 加载角色集合
				this.departMentTwoList = res.rows

			})
		},
		isFeeFun:function(data){

			if(data==0){
				this.isFee = false
			}else if(data == 1){
				this.isFee = true
			}
		},
		isDocFun:function(data){
			if(this.currentIndex==data.length){
				this.currentIndex = 0

				if(this.remarkArr.indexOf("医生")>-1){
					this.isDoc = true
				}else{
					this.isDoc = false
				}
				if(this.remarkArr.indexOf("助理")>-1 || this.remarkArr.indexOf("健康管家")>-1 || this.remarkArr.indexOf("医生")>-1){
					this.isSign = true
				}else{
					this.isSign = false
				}
				this.remarkArr = []
				return
			}
			let id = data[this.currentIndex]

			this.$api.role.findById({"roleId":id}).then((res) => {
				this.remarkArr.push(res.rows.remark)
				this.currentIndex++
				//console.log(res.rows.remark)
				this.isDocFun(data)
			}).then(data!=null?data.callback:'')

			;

		},
		//加载一级科室
		findDepartmentOneList:function(){
			this.$api.department.findAll().then((res) => {

				// 加载角色集合
				this.departMentOneList = res.rows
        console.log(this.departMentOneList)
			})
		},
		//加载所有助理
		selectAssisant:function(){
			this.$api.user.selectAssisant().then((res) => {
				// 加载所有助理
				this.assisantList = res.rows
				console.log("助理："+this.assisantList)
			})
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				let arr = res.rows;
				arr.splice(arr.findIndex(v => v.id === '1'),1)
				// 加载角色集合
				this.roles = arr
			})
		},
    fanhui:function(){
      this.$router.push("/login")
    },
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let employeeRoles = []
						for(let i=0,len=params.employeeRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.employeeRoles[i]
							}
							employeeRoles.push(userRole)
						}
						params.employeeRoles = employeeRoles
						this.$api.user.add(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$confirm('您已经注册成功，请等待审核')
								this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
                this.$router.push("/login")
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
						})
					})
				}
			})
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  },

  mounted() {
    this.findUserRoles()
		this.findDepartmentOneList()
		this.selectAssisant()

  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor
    })
  }
}
</script>


<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 484px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
	.avatar-uploader {
		text-align: left
	}
  .avatar-uploader .el-upload {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;

    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;

  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 271px;
    height: 226px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 271px;
    height: 226px;
    display: block;
  }
</style>
