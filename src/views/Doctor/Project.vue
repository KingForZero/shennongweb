<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<!-- <el-form-item>
				<el-input v-model="filters.tel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.name" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item> -->
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
			
		</el-form>
	</div>
	<!-- <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
		<el-form :inline="true" :size="size">
			<el-form-item>
				<el-button-group>
				<el-tooltip content="刷新" placement="top">
					<el-button icon="fa fa-refresh" @click="findPage(null)"></el-button>
				</el-tooltip>
				<el-tooltip content="列显示" placement="top">
					<el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
				</el-tooltip>
				<el-tooltip content="导出" placement="top">
					<el-button icon="fa fa-file-excel-o"></el-button>
				</el-tooltip>
				</el-button-group>
			</el-form-item>
		</el-form>
	</div> -->
	<el-table :data="pageResult.rows" style="width: 100%">
		<el-table-column type="index" label="序号" >
		</el-table-column>
		<el-table-column property="id" label="id" >
		</el-table-column>
		<el-table-column property="title" label="科研主题" >
		</el-table-column>
		<el-table-column property="fileUrl" label="课题文件" >
			<template slot-scope="scope">
				
				<a class='download' :href='down(scope.row)' download=""  title="下载">下载</a>
			</template>
		</el-table-column>
		<el-table-column property="addUserName" label="添加人" >
		</el-table-column>
		<el-table-column property="addDate" label="添加日期" :formatter="dateFormat">
		</el-table-column>
		<el-table-column property="auditUserName" label="审核人" >
		</el-table-column>
		<el-table-column property="auditDate" label="审核日期" :formatter="dateFormat">
		</el-table-column>
		<el-table-column property="status" label="状态" :formatter="statusFormatter">
		</el-table-column>
		<el-table-column property="rejectReason" label="驳回原因">
		</el-table-column>
		<el-table-column property="status" label="操作">
			<template slot-scope="scope">
				<el-button v-if="scope.row.status == '1'" @click="tijiao(scope.row)" type="text" size="small">提交</el-button>
				<el-button v-if="scope.row.status == '3'" @click="caozuo(scope.row)" type="text" size="small">操作</el-button>
			</template>
		</el-table-column>
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
      </el-pagination>
    </div>
	<!--课题详情界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="主题" prop="title">
				<el-input v-model="dataForm.title" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="课题文件" prop="name">
				<el-upload
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess"
				:before-upload="beforeAvatarUpload" style="width:20%">
				<el-button size="small" type="primary">点击上传</el-button>
				<!-- <a class='download' :href='dataForm.fileUrl' download=""  title="下载">下载</a> -->
			</el-upload>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<el-dialog title="上传" width="50%" :visible.sync="isShowGuanCha" :close-on-click-modal="false">
		<el-form :model="guanChaForm" label-width="80px" ref="guanChaForm"   :size="size"
			label-position="right">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="guanChaForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="观察表" prop="name">
				<el-upload
				class="avatar-uploader"
				:action="uploadUrl()"
				:show-file-list="false"
				:on-success="handleAvatarSuccess1"
				:before-upload="beforeAvatarUpload" style="width:20%">
				<el-button size="small" type="primary">点击上传</el-button>
				<!-- <a class='download' :href='dataForm.fileUrl' download=""  title="下载">下载</a> -->
			</el-upload>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="isShowGuanCha = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitGuanChaForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!--课题操作界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="90%" :visible.sync="isShow" :close-on-click-modal="false">
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="实验组" name="1">
				<!--工具栏-->
				<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
					<el-form :inline="true"  :size="size">
						<el-form-item>
							<el-button @click="addUser">添加患者</el-button>
						</el-form-item>
					</el-form>
				</div>
				<el-table :data="userResult.rows" style="width: 100%">
					<el-table-column type="index" label="序号" >
					</el-table-column>
					<el-table-column property="userName" label="姓名" >
						<template slot-scope="scope">
							<router-link tag="span" to="#" @click.native="xiangqing(scope.row)" style="color:blue">
								{{scope.row.userName}}
							</router-link>
						</template>
					</el-table-column>
					<el-table-column property="userSex" label="性别" :formatter="sexFormatter" >
					</el-table-column>
					<el-table-column property="userAge" label="年龄" >
					</el-table-column>
					<el-table-column property="keywords" label="病例摘要" >
					</el-table-column>
					<el-table-column property="fileUrl" label="观察表" >
						<template slot-scope="scope">
							<a v-if="scope.row.fileUrl" class='download' :href='down(scope.row)' download=""  title="下载">下载</a>
						</template>
					</el-table-column>
					<el-table-column property="updateTime" label="上次上传时间" :formatter="dateFormat">
					</el-table-column>
					<el-table-column property="status" label="操作">
						<template slot-scope="scope">
							<el-button @click="shanchu(scope.row)" type="text" size="small">删除</el-button>
							<el-button @click="uploadGuanCha(scope.row)" type="text" size="small">上传观察表</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--分页栏-->
				<div class="toolbar" style="padding:10px;">
				<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshUserPageRequest" 
					:current-page="userPageRequest.pageNum" :page-size="userPageRequest.pageSize" :total="userResult.total" style="float:right;">
				</el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="对照组" name="2">
					<!--工具栏-->
				<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
					<el-form :inline="true"  :size="size">
						<el-form-item>
							<el-button @click="addAllUser">添加患者</el-button>
						</el-form-item>
						
					</el-form>
				</div>
				<el-table :data="userResult.rows" style="width: 100%">
					<el-table-column type="index" label="序号" >
					</el-table-column>
					<el-table-column property="userName" label="姓名" >
						<template slot-scope="scope">
							<router-link tag="span" to="#" @click.native="xiangqing(scope.row)" style="color:blue">
								{{scope.row.userName}}
							</router-link>
						</template>
					</el-table-column>
					<el-table-column property="userSex" label="性别" :formatter="sexFormatter" >
					</el-table-column>
					<el-table-column property="userAge" label="年龄" >
					</el-table-column>
					<el-table-column property="keywords" label="病例摘要" >
					</el-table-column>
					<el-table-column property="fileUrl" label="观察表" >
						<template slot-scope="scope">
							<a v-if="scope.row.fileUrl" class='download' :href='down(scope.row)' download=""  title="下载">下载</a>
						</template>
					</el-table-column>
					<el-table-column property="updateTime" label="上次上传时间" :formatter="dateFormat">
					</el-table-column>
					<el-table-column property="status" label="操作">
						<template slot-scope="scope">
							<el-button @click="shanchu(scope.row)" type="text" size="small">删除</el-button>
							<el-button @click="uploadGuanCha(scope.row)" type="text" size="small">上传观察表</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--分页栏-->
				<div class="toolbar" style="padding:10px;">
				<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshUserPageRequest" 
					:current-page="userPageRequest.pageNum" :page-size="userPageRequest.pageSize" :total="userResult.total" style="float:right;">
				</el-pagination>
				</div>
			</el-tab-pane>
			<!-- <el-tab-pane label="观察指标" name="3">

			</el-tab-pane> -->
		</el-tabs>
		
	</el-dialog>
	<!--选择患者界面/在我的患者中选择-->
	<el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="isShowUser" :close-on-click-modal="false">
		<!--工具栏-->
			<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
				<el-form :inline="true" :model="userfilters" :size="size">
					<!-- <el-form-item>
						<el-input v-model="userfilters.tel" placeholder="电话"></el-input>
					</el-form-item> -->
					<el-form-item>
						<el-input v-model="userfilters.userName" placeholder="姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findCliengPage(null)"/>
					</el-form-item>
					<el-form-item>
						<el-button @click="xuanzhong">选中</el-button>
					</el-form-item>
					
				</el-form>
			</div>

			<el-table :data="clientPageResult.rows" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column
				type="selection"
				width="55">
				</el-table-column>
				<el-table-column type="index" label="序号">
				</el-table-column>
				<!-- <el-table-column property="id" label="id" >
					<template slot-scope="scope">
						<router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
							{{scope.row.id}}
						</router-link>
					</template>
				</el-table-column> -->
				<el-table-column label="患者姓名" prop="userName">
						<template slot-scope="scope">
							<router-link tag="span" to="#" @click.native="xiangqing(scope.row)" style="color:blue">
								{{scope.row.userName}}
							</router-link>
						</template>
					</el-table-column>
				<el-table-column property="userSex" label="性别" :formatter="sexFormatter">
				</el-table-column>
				<el-table-column property="userTel" label="电话">
				</el-table-column>
				<el-table-column label="病例摘要" prop="keywords" ></el-table-column>
				<!-- <el-table-column label="对照状态" prop="compare" :formatter="compareFormatter"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,1)" type="text" size="small">标记为对照组</el-button>
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,2)" type="text" size="small">标记为实验组</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!--分页栏-->
			<div class="toolbar" style="padding:10px;">
			<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshClientPageRequest" 
				:current-page="clientPageRequest.pageNum" :page-size="clientPageRequest.pageSize" :total="clientPageResult.total" style="float:right;">
			</el-pagination>
			</div>
	</el-dialog>
	<!--选择患者界面/在所有患者中选择-->
	<el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="isShowAllUser" :close-on-click-modal="false">
		<!--工具栏-->
			<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
				<el-form :inline="true" :model="allUserFilters" :size="size">
					<el-form-item>
						<el-input v-model="allUserFilters.userName" placeholder="姓名搜索"></el-input>
					</el-form-item>
					<!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
					</el-form-item> -->
					<el-form-item>
						<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findAllCliengPage(null)"/>
					</el-form-item>
					<el-form-item>
						<el-button @click="xuanzhong">选中</el-button>
					</el-form-item>
					<el-form-item>
						<el-button @click="showKun">在病历库中搜索</el-button>
					</el-form-item>
					
				</el-form>
			</div>

			<el-table :data="clientAllPageResult.rows" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column
				type="selection"
				width="55">
				</el-table-column>
				<el-table-column type="index" label="序号">
				</el-table-column>
				<!-- <el-table-column property="id" label="id" >
					<template slot-scope="scope">
						<router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
							{{scope.row.id}}
						</router-link>
					</template>
				</el-table-column> -->
				<el-table-column label="患者姓名" prop="userName">
						<template slot-scope="scope">
							<router-link tag="span" to="#" @click.native="xiangqing(scope.row)" style="color:blue">
								{{scope.row.userName}}
							</router-link>
						</template>
					</el-table-column>
				<el-table-column property="userSex" label="性别" :formatter="sexFormatter">
				</el-table-column>
				<el-table-column property="userTel" label="电话">
				</el-table-column>
				<el-table-column label="病例摘要" prop="keywords" ></el-table-column>
				<!-- <el-table-column label="对照状态" prop="compare" :formatter="compareFormatter"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,1)" type="text" size="small">标记为对照组</el-button>
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,2)" type="text" size="small">标记为实验组</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!--分页栏-->
			<div class="toolbar" style="padding:10px;">
			<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshClientAllPageRequest" 
				:current-page="clientAllPageRequest.pageNum" :page-size="clientAllPageRequest.pageSize" :total="clientAllPageResult.total" style="float:right;">
			</el-pagination>
			</div>
	</el-dialog>
	<!--选择患者界面/在病历库中选择-->
	<el-dialog :title="operation?'新增':'编辑'" width="80%" :visible.sync="isShowKun" :close-on-click-modal="false">
		<!--工具栏-->
			<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
				<el-form :inline="true" :model="kunFilters" :size="size">
					<el-form-item>
						<el-input v-model="kunFilters.keywords" placeholder="关键字搜索"></el-input>
					</el-form-item>
					<!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
					</el-form-item> -->
					<el-form-item>
						<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findKunPage(null)"/>
					</el-form-item>
					<el-form-item>
						<el-button @click="xuanzhong">选中</el-button>
					</el-form-item>
					
					
				</el-form>
			</div>

			<el-table :data="kunPageResult.rows" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column
				type="selection"
				width="55">
				</el-table-column>
				<el-table-column type="index" label="序号">
				</el-table-column>
				<!-- <el-table-column property="id" label="id" >
					<template slot-scope="scope">
						<router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
							{{scope.row.id}}
						</router-link>
					</template>
				</el-table-column> -->
				<el-table-column label="患者姓名" prop="userName">
						<template slot-scope="scope">
							<router-link tag="span" to="#" @click.native="xiangqing(scope.row)" style="color:blue">
								{{scope.row.userName}}
							</router-link>
						</template>
					</el-table-column>
				<el-table-column property="userSex" label="性别" :formatter="sexFormatter">
				</el-table-column>
				<el-table-column property="userTel" label="电话">
				</el-table-column>
				<el-table-column label="病例摘要" prop="keywords" ></el-table-column>
				<!-- <el-table-column label="对照状态" prop="compare" :formatter="compareFormatter"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,1)" type="text" size="small">标记为对照组</el-button>
						<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,2)" type="text" size="small">标记为实验组</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!--分页栏-->
			<div class="toolbar" style="padding:10px;">
			<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshKunPageRequest" 
				:current-page="kunPageRequest.pageNum" :page-size="kunPageRequest.pageSize" :total="kunPageResult.total" style="float:right;">
			</el-pagination>
			</div>
	</el-dialog>
	<el-dialog  title="新增患者"  width="80%" :visible.sync="isShowAddPage" :close-on-click-modal="false">
            <el-form :model="recordForm" label-width="120px" :rules="recordFormRules" ref="recordForm" :size="size" label-position="right">
                <!-- <el-form-item label="请选择用户" prop="userId">
                  <el-select
                  v-model="recordForm.userId"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入手机号"
                  :remote-method="remoteMethod"
                  :loading="loading">
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                </el-form-item> -->
                <el-form-item label="请输入手机号" prop="userTel">
                  <el-input @change="telChange" v-model="recordForm.userTel"></el-input>
                </el-form-item>
                <el-form-item label="请输入姓名" prop="userName">
                  <el-input v-model="recordForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="请选择性别" prop="userSex" >
                    <el-radio v-model="recordForm.userSex" label="0">男</el-radio>
                    <el-radio v-model="recordForm.userSex" label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="请输入年龄" prop="userAge">
                  <el-input v-model="recordForm.userAge"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowAddPage = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitRecordlForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
		  <el-dialog  title="健康档案"  width="90%" :visible.sync="isShowDetail" :close-on-click-modal="false">
			  <el-form label-width="90px" class="demo">
                  <h2 align="left">基本信息</h2>
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="姓名：" >
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.userName"
                          :disabled="isName">
                        </el-input>
                        <!-- <span>{{healthRecord.userName}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="性别：">
                       <el-radio v-model="healthRecord.userSex" :disabled="isSex" label="0">男</el-radio>
                        <el-radio v-model="healthRecord.userSex" :disabled="isSex" label="1">女</el-radio>
                        <!-- <span v-if="healthRecord.userSex=='0'">男</span>
                        <span v-if="healthRecord.userSex=='1'">女</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="出生日期：">
                        <el-date-picker
                          v-model="healthRecord.userBirth"
                          type="date"
                          value-format="timestamp"
                          :disabledDate="isBirth"
                          placeholder="选择日期">
                        </el-date-picker>
                        <!-- <span>{{healthRecord.userBirth|dateStatus}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">   
                    <el-col :span="8">
                      <el-form-item label="年龄：" >
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.userAge"
                          :disabled="isAge">
                        </el-input>
                        <!-- <span>{{healthRecord.userAge}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="职业：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.userJob"
                          :disabled="isJob">
                        </el-input>
                        <!-- <span>{{healthRecord.userJob}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="家庭地址：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.userAddress"
                          :disabled="isAddress">
                        </el-input>
                        <!-- <span>{{healthRecord.userAddress}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="婚育状况：" >
                        <el-radio v-model="healthRecord.isMarry" :disabled="isMarry" label="0">未婚</el-radio>
                        <el-radio v-model="healthRecord.isMarry" :disabled="isMarry" label="1">已婚</el-radio>
                        <!-- <span v-if="healthRecord.isMarry=='0'">未婚</span>
                        <span v-if="healthRecord.isMarry=='1'">已婚</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="身份证号：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.idCard"
                          :disabled="isCard">
                        </el-input>
                        <!-- <span>{{healthRecord.idCard}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="联系电话：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.userTel"
                          :disabled="isTel">
                        </el-input>
                        <!-- <span>{{healthRecord.userTel}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="身高：" >
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.height"
                          :disabled="isHeight">
                        </el-input>
                        <!-- <span>{{healthRecord.height}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="体重：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.weight"
                          :disabled="isWeight">
                        </el-input>
                        <!-- <span>{{healthRecord.weight}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="不良嗜好 ：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.bad"
                          :disabled="isBad">
                        </el-input>
                        <!-- <span>{{healthRecord.bad}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="饮食习惯：" >
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.eat"
                          :disabled="isEat">
                        </el-input>
                        <!-- <span>{{healthRecord.eat}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="作息习惯：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.rest"
                          :disabled="isRest">
                        </el-input>
                        <!-- <span>{{healthRecord.rest}}</span> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="运动习惯：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.sports"
                          :disabled="isSport">
                        </el-input>
                        <!-- <span>{{healthRecord.sports}}</span> -->
                      </el-form-item>
                    </el-col>
                  </el-row>
                   <el-row :gutter="15">
                    <el-col>
                      <el-form-item label="病例摘要：" >
                        <el-input
                          placeholder="请输入内容(多个关键字用英文逗号隔开)"
                          v-model="healthRecord.keywords"
                          >
                        </el-input>
                        <!-- <span>{{healthRecord.eat}}</span> -->
                      </el-form-item>
                    </el-col>
                    
                  </el-row>

                  <h2 align="left">病史</h2>
                  <el-row>
                    <el-col :span="20">
                      <el-form-item label="家族病史：">
                        <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.familyHistory"
                          :disabled="isFamilyHistory">
                        </el-input>
                        <!-- <span>{{healthRecord.familyHistory}}</span> -->
                      </el-form-item>
                    </el-col>
                    	<el-col :span="20">
                        <el-form-item label="过敏史：">
                          <el-input
                          placeholder="请输入内容"
                          v-model="healthRecord.allergicHistory"
                          :disabled="isAllergicHistory">
                        </el-input>
                          <!-- <span>{{healthRecord.allergicHistory}}</span> -->
                        </el-form-item>
                      </el-col>
                    <el-col :span="20">
                      <el-form-item label="个人病史：">
                        <el-button type="primary" @click="medicalHistory(healthRecord.userId)" >查看既往病史</el-button>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="20">
                      <el-form-item label="就医记录：">
                        <span>{{healthRecord.medicalRecord}}</span>
                      </el-form-item>
                    </el-col> -->
                  </el-row>
                  <h2 align="left">管家备注</h2>
                  <el-row :gutter="10">
                    <el-col :span="20">
                      <el-form-item label="">
                        <el-input type="textarea" :rows="4" :disabled="true" v-model="healthRecord.keeperRemarks"></el-input>
                      </el-form-item>
                      
                    </el-col>
                  </el-row>
                  <el-button type="primary" @click="saveHealthRecord">保存</el-button>
                  <el-button type="primary" @click.native="isShowDetail = false">返回</el-button>
                  </el-form>
		  </el-dialog>
		  <el-dialog  title="既往病史"  width="40%" :visible.sync="isShowHistory" :close-on-click-modal="false">
              <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                <el-button icon="fa fa-add" label="新增" type="primary" @click="addHistory()">新增</el-button>
              </div>
              <el-table :data="historyList" style="width: 100%">
                <el-table-column type="index" label="序号"></el-table-column>
                <!-- <el-table-column label="病史描述" prop="description" width="100px"></el-table-column>
                <el-table-column label="补充图片" prop="pic" width="100px"></el-table-column> -->
                <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
                <el-table-column label="添加人" prop="createUserId"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button @click="detailHistory(scope.row)" type="text" size="small">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              
          </el-dialog>
          <el-dialog  title="新增既往病史"  width="40%" :visible.sync="isShowAddHistory" :close-on-click-modal="false">
            <el-form :model="historyForm" label-width="80px"  ref="historyForm" :size="size" label-position="right">
              <el-input v-model="historyForm.id" style="display:none"></el-input>
              <el-form-item label="病史图片：" v-if="isShowPic">
									<img  v-for="item in imgUtil(historyForm.pic)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
              <el-form-item label="描述" prop="description">
                <el-input type="textarea" v-model="historyForm.description">
                </el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowAddHistory = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitHistoryForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
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
			isShowKun:false,
			guanChaForm:{},
			isShowGuanCha:false,
			isShowDetail:false,
			healthRecord:{},
			recordForm:{},
			recordFormRules:{
				userTel: [
					{ required: true, message: '请输入电话', trigger: 'blur' }
				],
				userName:[
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				],
				userSex:[
					{ required: true, message: '请选择性别', trigger: 'blur' }
				],
				userAge:[
					{ required: true, message: '请输入年龄', trigger: 'blur' }
				]
			},
			isShowAddPage:false,
			isShowAllUser:false,
			isShowUser:false,
			activeName:"1",
			status:'1',
			projectId:'',
			isShow:false,
			size: 'small',
			employeeId:'',
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			userPageRequest:{ pageNum: 1, pageSize: 10 },
			userResult:{},
			clientPageResult:{},
			clientPageRequest:{pageNum: 1, pageSize: 10 },
			clientAllPageResult:{},
			clientAllPageRequest:{pageNum: 1, pageSize: 10 },
			kunPageResult:{},
			kunPageRequest:{pageNum: 1, pageSize: 10 },
			kunFilters:{},
			allUserFilters:{
				keywords:''
			},
			userfilters:{

			},
			filters:{

			},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataForm:{
				id:'',
				title:'',
				fileUrl:'',
				addUserId:'',
				addUserName:'',
				status:''
			},
			dataFormRules: {
				title: [
					{ required: true, message: '请输入主题', trigger: 'blur' }
				]
			},
			multipleSelection:[],
			isName:false,
			isSex:false,
			isBirth:false,
			isAge:false,
			isJob:false,
			isAddress:false,
			isMarry:false,
			isCard:false,
			isTel:false,
			isHeight:false,
			isWeight:false,
			isBad:false,
			isEat:false,
			isRest:false,
			isSport:false,
			isFamilyHistory:false,
			isAllergicHistory:false,
			isShowAddHistory:false,
			isShowPic:false,
			isShowHistory:false,
			historyForm:{},
			historyList:[]
			
		}
	},
	methods: {
		showKun(){
			this.isShowKun = true
		},
		uploadGuanCha(row){
			this.guanChaForm.id = row.projectUserId
			this.isShowGuanCha = true
		},
		detailHistory(row){
        this.isShowPic = true
        this.isShowAddHistory = true
        this.historyForm = Object.assign(this.historyForm,row)
      },
		submitHistoryForm(){
         this.$api.user.addHistory(this.historyForm).then((res) => {
							if(res.code == 200) {
                this.medicalHistory(this.historyForm.userId)
               this.isShowAddHistory = false
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							
						})
        this.isShowAddHistory = false
      },
      //新增既往病史页面
      addHistory(){
        this.historyForm = {userId:this.historyForm.userId}
        this.isShowAddHistory = true
        this.isShowPic = false
      },
      //查看既往病史
      medicalHistory(val){
        this.historyForm.userId = val
        this.$api.user.selectHistory({userId:val}).then((res) => {
			if(res.code == 200) {
				this.isShowHistory = true
				this.historyList = res.rows
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
			
			})        
      },
		saveHealthRecord(){
         //查询个人档案
            this.$api.assistant.addHealthRecord(this.healthRecord).then((res) => {
              if(res.code == '200'){
                this.$message({message: '保存成功 ', type: 'success'})
              } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
            })
      },
		xiangqing(row){
			this.isShowDetail = true
			//查询个人档案
            this.$api.assistant.selectHealthRecord({userId:row.userId}).then((res) => {
              if(res.code == '200'){
                this.healthRecord = res.rows
                //判断是否需要助理修改患者的个人档案
                if(this.healthRecord.userName){
                  this.isName=true
                }else{
                  this.isName=false
                }
                if(this.healthRecord.userSex){
                  this.isSex = true
                }else{
                  this.isSex=false
                }
                if(this.healthRecord.userBirth){
                  this.isBirth = true
                }else{
                  this.isBirth=false
                }
                if(this.healthRecord.userAge){
                  this.isAge = true
                }else{
                  this.isAge=false
                }
                if(this.healthRecord.userJob){
                  this.isJob = true
                }else{
                  this.isJob=false
                }
                if(this.healthRecord.userAddress){
                  this.isAddress = true
                }else{
                  this.isAddress=false
                }
                if(this.healthRecord.isMarry){
                  this.isMarry = true
                }else{
                  this.isMarry=false
                }
                if(this.healthRecord.idCard){
                  this.isCard = true
                }else{
                  this.isCard=false
                }
                if(this.healthRecord.userTel){
                  this.isTel = true
                }else{
                  this.isTel=false
                }
                if(this.healthRecord.height){
                  this.isHeight = true
                }else{
                  this.isHeight=false
                }
                if(this.healthRecord.weight){
                  this.isWeight = true
                }else{
                  this.isWeight=false
                }
                if(this.healthRecord.bad){
                  this.isBad = true
                }else{
                  this.isBad=false
                }
                if(this.healthRecord.eat){
                  this.isEat = true
                }else{
                  this.isEat=false
                }
                if(this.healthRecord.rest){
                  this.isRest = true
                }else{
                  this.isRest=false
                }
                if(this.healthRecord.sports){
                  this.isSport = true
                }else{
                  this.isSport=false
                }
                if(this.healthRecord.familyHistory){
                  this.isFamilyHistory = true
                }else{
                  this.isFamilyHistory=false
                }
                if(this.healthRecord.allergicHistory){
                  this.isAllergicHistory = true
                }else{
                  this.isAllergicHistory=false
                }
              }	
              
            })
		},
		telChange(val){
         this.$api.user.selectClientUserByTel({userTel:val}).then((res) => {
			if(res.code == 200) {
				if(JSON.stringify(res.rows) == "{}"){

				}else{
					this.$message({message: '该用户已注册，无需再次添加', type: 'error'})
				}
			} else {
				this.$message({message: '查询用户信息失败, ' + res.msg, type: 'error'})
			}
			
		})
      },
		// 编辑
      submitRecordlForm: function () {
			this.$refs.recordForm.validate((valid) => {
			if (valid) {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
				this.recordForm.projectId = this.projectId
				this.recordForm.status = this.status
				this.$api.user.doctorAddUser(this.recordForm).then((res) => {
					if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
					this.isShowAddPage = false
					} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
					}
					this.findUserPage()
				})
				})
			}
			})
		},
		addNewUser(){
			this.isShowAddPage = true
		},
		shanchu(row){
			this.$api.project.deleteById({projectUserId:row.projectUserId}).then((res) => {
				if(res.code == 200) {
					this.findUserPage()
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
			})
		},
		xuanzhong(){
			if(this.multipleSelection.length==0){
				this.$message({message: '操作失败,请先选择', type: 'error'})
			}else{
				var list = []
				let projectId = this.projectId
				let status = this.status
				debugger
				this.multipleSelection.forEach(row=>{
					let map = {}
					map.projectId = projectId
					map.userId = row.userId
					map.status = status
					list.push(map)
				})
				this.$api.project.projectAdd(list).then((res) => {
					if(res.code == 200) {
						this.$message({ message: '操作成功', type: 'success' })
						this.findUserPage()
					} else {
						this.$message({message: '操作失败, ' + res.msg, type: 'error'})
					}
				})
			}
			
		},
		handleSelectionChange(val) {
        	this.multipleSelection = val;
		  },
		  addAllUser(){
			this.isShowAllUser = true
			this.findAllCliengPage(null)
		},
		addUser(){
			this.isShowUser = true
			this.findCliengPage(null)
		},
		handleClick(tab, event) {
			this.status = tab.name
			this.userPageRequest = { pageNum: 1, pageSize: 10 }
			this.findUserPage()
      	},
		down(row){
			return "http://39.106.123.28/images/"+row.fileUrl
		},
		dateFormat: function (row, column, cellValue, index){
			if(row[column.property]){
				return timestampToTime(row[column.property])
			}else{

			}
          
      	},
		timeFormatter:function(row) {
			if(row.createTime){
				return timestampToTime(row.createTime)
			}else{
				
			}
		},
		imgUtil(value){
			if(value){
				let files2=[]
				let idArray1 = value.split(',')
				for(var i=0; i<idArray1.length; i++) {
					files2.push("http://39.106.123.28/images/"+idArray1[i])
				}
				return files2
			}
		},
		caozuo(row){
			this.projectId = row.id
			this.findUserPage(null)
			

			this.isShow = true
		},
		tijiao(row){
			this.$api.project.save({id:row.id,status:'2'}).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.findPage(null)
			})

		},
		handleAdd(){
			this.dialogVisible = true
		},
			uploadUrl(){
				// return baseUrl+"/system/upload";
				return "http://39.106.123.28/sh/system/upload";
			},
			handleAvatarSuccess(res, file) {
				this.dataForm.fileUrl = res.rows;
				this.$message.success('上传成功')
			},
			handleAvatarSuccess1(res, file) {
				this.guanChaForm.fileUrl = res.rows;
				this.$message.success('上传成功')
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
		//获取所有患者的分页数据
		
		findKunPage: function (data) {
			if(this.kunFilters.keywords){
				if(data) {
					this.kunPageRequest = data
				}
		
				this.kunPageRequest.columnFilters = {keywords: {name:'keywords', value:this.kunFilters.keywords}}
				this.$api.user.selectKun(this.kunPageRequest).then((res) => {
					this.kunPageResult = res

				}).then(data!=null?data.callback:'')
			}else{
				this.$message({message: '请输入关键字！' , type: 'error'})
			}
			
		},
		
		refreshKunPageRequest: function(pageNum){
			this.kunPageRequest.pageNum  = pageNum
			this.findKunPage()
		},
		//获取所有患者的分页数据
		
		findAllCliengPage: function (data) {
			if(data) {
				this.clientAllPageRequest = data
			}
			this.clientAllPageRequest.columnFilters = {userName: {name:'userName', value:this.allUserFilters.userName}}
			this.$api.healthHouseKeeper.selectPatient(this.clientAllPageRequest).then((res) => {
				this.clientAllPageResult = res
			}).then(data!=null?data.callback:'')
			// this.clientAllPageRequest.columnFilters = {keywords: {name:'keywords', value:this.allUserFilters.keywords}}
			// this.$api.user.selectClientUser(this.clientAllPageRequest).then((res) => {
			// 	this.clientAllPageResult = res

			// }).then(data!=null?data.callback:'')
		},
		
		refreshClientAllPageRequest: function(pageNum){
			this.clientAllPageRequest.pageNum  = pageNum
			this.findAllCliengPage()
		},
		// 获取我的会员分页数据
		findCliengPage: function (data) {
			if(data) {
				this.clientPageRequest = data.clientPageRequest
			}
			this.clientPageRequest.columnFilters = {userName: {name:'userName', value:this.userfilters.userName}}
			this.$api.healthHouseKeeper.selectPatient(this.clientPageRequest).then((res) => {
				this.clientPageResult = res
			}).then(data!=null?data.callback:'')
		},
		refreshClientPageRequest: function(pageNum){
			this.clientPageRequest.pageNum  = pageNum
			this.findCliengPage()
		},

		findUserPage: function (data) {
			if(data) {
				this.userPageRequest = data.userPageRequest
			}
			this.userPageRequest.columnFilters = {projectId: {name:'projectId', value:this.projectId},
			status:{name:'status', value:this.status}}
			this.$api.project.selectUserPage(this.userPageRequest).then((res) => {
				this.userResult = res
			}).then(data!=null?data.callback:'')
		},
		findPage: function (data) {
			if(data) {
				this.pageRequest = data.pageRequest
			}
			this.employeeId = JSON.parse(sessionStorage.getItem("employee")).id
			this.pageRequest.columnFilters = {addUserId: {name:'addUserId', value:this.employeeId}}
			this.$api.project.selectPage(this.pageRequest).then((res) => {
				this.pageResult = res
			}).then(data!=null?data.callback:'')
		},
		
		submitGuanChaForm: function () {
			this.$confirm('确认提交吗？', '提示', {}).then(() => {
				this.$api.project.update(this.guanChaForm).then((res) => {
					this.editLoading = false
					if(res.code == 200) {
						this.$message({ message: '操作成功', type: 'success' })
						this.isShowGuanCha = false
						this.$refs['guanChaForm'].resetFields()
					} else {
						this.$message({message: '操作失败, ' + res.msg, type: 'error'})
					}
					this.findUserPage(null)
				})
			})
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						this.$api.project.save(this.dataForm).then((res) => {
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
		
		refreshUserPageRequest: function(pageNum){
			this.userPageRequest.pageNum  = pageNum
			this.findUserPage()
		},
		refreshPageRequest: function(pageNum){
			this.pageRequest.pageNum  = pageNum
			this.findPage(this.pageRequest)
		},
		// 时间格式化
      	sexFormatter: function (row, column, cellValue, index){
							switch(row.userSex){
								case "0":
										return '男'
									break;
								case "1":
										return '女'
									break;
							}
      	},
		
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
