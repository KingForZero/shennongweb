<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.userTel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.userName" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>
			<el-form-item>
				<el-button @click="addNewUser">添加患者</el-button>
			</el-form-item>

		</el-form>
	</div>

	<el-table :data="pageResult.rows" style="width: 100%">
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
					<router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
						{{scope.row.userName}}
					</router-link>
				</template>
			</el-table-column>
		<el-table-column property="userSex" label="性别" :formatter="sexFormatter">
		</el-table-column>
		<el-table-column property="userAge" label="年龄" >
		</el-table-column>
		<el-table-column property="userTel" label="电话">
		</el-table-column>
		<el-table-column label="病例摘要" prop="keywords" ></el-table-column>
		<!-- <el-table-column label="操作">
			<template slot-scope="scope">
				<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,1)" type="text" size="small">标记为对照组</el-button>
				<el-button v-if="scope.row.compare  != '1' && scope.row.compare  != '2'" @click="mark(scope.row,2)" type="text" size="small">标记为实验组</el-button>
			</template>
		</el-table-column> -->
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
      </el-pagination>
    </div>
	<!--用户详情界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="95%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<template>
			<el-tabs v-model="activeName" @tab-click="clickTab" >
				<el-tab-pane label="个人档案" name="first">
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
				</el-tab-pane>
				<el-tab-pane label="远程设备">
                <div>
                  <iframe v-bind:src="frameUrl" id="yuancheng" width=100% height=800px frameborder=0 scrolling=auto></iframe>
                </div>
        </el-tab-pane>
				<!-- <el-tab-pane label="医疗记录" name="second">
					<el-table :data="medicalRecordPage.rows" style="width: 100%" @expand-change="changeExpand">
						<el-table-column type="expand">
							<template slot-scope="props">
								<el-form>
									<el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="姓名：" >
                        <span>{{props.row.userName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="用户电话：" >
                         <span>{{props.row.userTel}}</span>
                      </el-form-item>

                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="状态：">
                        <span>{{props.row.recordState|recordStateFormatter}}</span>
												<el-button type='text' @click="showSheet(props.row.surveyId)">查看问诊单</el-button>
												<el-button type='text' @click="yaofang(props.row.recordId)">查看电子药方</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="创建时间：" >
                        <span>{{props.row.createTime|timeStatus}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="审核时间：">
                        <span>{{props.row.auditTime|timeStatus}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="审核人：">
                        <span>{{props.row.auditName}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="是否初诊：">
                        <span v-if="props.row.first=='0'">否</span>
                        <span v-if="props.row.first=='1'">是</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="医生姓名：">
                        <span>{{props.row.docName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="助理姓名：" >
                        <span>{{props.row.assistantName}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="是否付费：">
                        <span v-if="props.row.feeStatus == '0'">免费</span>
                        <span v-if="props.row.feeStatus == '1'">未付费</span>
                        <span v-if="props.row.feeStatus == '2'">已付费</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="问诊费：">
                        <span>{{props.row.feeAmount}}</span>
                      </el-form-item>
                    </el-col>
										<el-col :span="8">
                      <el-form-item label="是否需要转诊：" >
												<span v-if="props.row.needChangeDoc == '0'">否</span>
												<span v-if="props.row.needChangeDoc == '1'">是</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">

                    <el-col :span="8">
                      <el-form-item label="是否转诊：">
                        <span v-if="props.row.changeDoc == '1'">是</span>
                        <span v-if="props.row.changeDoc == '0'">否</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="会诊时间">
												<span>{{props.row.consultationTime|timeStatus}}</span>
                    </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="补充信息图片:">
                        <span v-for="(item,index) in fileList" :key="index">
                          <img :src="item.url" style="width:190px;height:190px">
                        </span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16">
                      <el-form-item label="补充信息:">
													<span>{{props.row.extraMsg}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="病历图片:">
                          <span v-for="(item,index) in fileList2" :key="index">
                          <img :src="item.url" style="width:190px;height:190px">
                        </span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="16">
                      <el-form-item label="病历说明:">
												<span>{{props.row.caseHistoryMsg}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="电子处方图片:">
                          <span v-for="(item,index) in fileList1" :key="index">
                          <img :src="item.url" style="width:190px;height:190px">
                        </span>
                      </el-form-item>
                    </el-col>
                  </el-row>
								</el-form>
							</template>
						</el-table-column>
						<el-table-column label="ID" prop="recordId"></el-table-column>
						<el-table-column label="患者姓名" prop="userName"></el-table-column>
						<el-table-column label="是否初诊" prop="changeDoc" :formatter="changeDocFormatter"></el-table-column>
						<el-table-column label="状态" prop="recordState" :formatter="recordStateFormatter"></el-table-column>
						<el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
					</el-table>
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalPageRequest"
						:current-page="medicalRecordPage.pageNum" :page-size="medicalRecordPage.pageSize" :total="medicalRecordPage.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="健康指导" name="third">
							<el-form :model="healthGuidanceForm" label-width="80px" :rules="healthGuidanceRules" ref="healthGuidanceForm" :size="size"
							label-position="right">
							<el-form-item label="ID" prop="id" v-if="false">
								<el-input v-model="healthGuidanceForm.id" :disabled="true" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="饮食标准" prop="diet">
								<el-input v-model="healthGuidanceForm.diet" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="运动标准" prop="sport">
								<el-input v-model="healthGuidanceForm.sport" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="休息标准" prop="rest">
								<el-input v-model="healthGuidanceForm.rest" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="不良嗜好" prop="hobby">
								<el-input v-model="healthGuidanceForm.hobby" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="轻体检" prop="physicalExamination">
								<el-input v-model="healthGuidanceForm.physicalExamination" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="中药调理" prop="chineseMedicine">
								<el-input v-model="healthGuidanceForm.chineseMedicine" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="心理" prop="inMind">
								<el-input v-model="healthGuidanceForm.inMind" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="其他" prop="elseOne">
								<el-input v-model="healthGuidanceForm.elseOne" auto-complete="off"></el-input>
							</el-form-item>
							<el-form-item label="管家备注" prop="reason">
								<el-input v-model="healthGuidanceForm.reason" auto-complete="off"></el-input>
							</el-form-item>


						</el-form>

				</el-tab-pane>
				<el-tab-pane label="健康日志" name="fourth">
					<el-table :data="healthLogPage.rows" style="width: 100%">
						<el-table-column type="index" label="序号" >
						</el-table-column>
						<el-table-column property="id" label="id" v-if="false">
						</el-table-column>
						<el-table-column property="diet" label="饮食标准" width="100px">
						</el-table-column>
						<el-table-column property="sport" label="运动标准">
						</el-table-column>
						<el-table-column property="rest" label="休息标准">
						</el-table-column>
						<el-table-column property="hobby" label="不良嗜好">
						</el-table-column>
						<el-table-column property="physicalExamination" label="轻体检">
						</el-table-column>
						<el-table-column property="chineseMedicine" label="中药调理">
						</el-table-column>
						<el-table-column property="inMind" label="心理状况">
						</el-table-column>
						<el-table-column :show-overflow-tooltip="true" property="elseOne" label="其他">
						</el-table-column>
						<el-table-column property="rest" label="休息标准">
						</el-table-column>
						<el-table-column property="createTime" label="添加日期" :formatter="dataFormatter">
						</el-table-column>
					</el-table>
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshHealthLog"
						:current-page="healthLogPage.pageNum" :page-size="healthLogPage.pageSize" :total="healthLogPage.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="健康评估" name="">
					<el-table :data="assessmentResult.rows" style="width: 100%">
						<el-table-column type="index" label="序号" >
						</el-table-column>
						<el-table-column property="id" label="id" >
						</el-table-column>
						<el-table-column property="userName" label="姓名" >
						</el-table-column>
						<el-table-column property="createName" label="创建人" >
						</el-table-column>
						<el-table-column property="healthMsg" label="健康评估" :show-overflow-tooltip='true'>
						</el-table-column>
						<el-table-column property="createDate" label="创建日期"  :formatter="dataFormatter1">
						</el-table-column>
					</el-table>
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshAssessment"
						:current-page="assessmentResult.pageNum" :page-size="assessmentResult.pageSize" :total="assessmentResult.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane> -->

			</el-tabs>
		</template>
	</el-dialog>
	<!--健康指导新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="isHealthGuidance" :close-on-click-modal="false">

	</el-dialog>
	<!-- 健康评估页面 -->
	<el-dialog title="健康评估" width="40%" :visible.sync="isHealthAssessment" :close-on-click-modal="false">
		<el-form :model="healthAssessmentForm" label-width="80px" :rules="healthGuidanceRules" ref="healthAssessmentForm" :size="size"
			label-position="right">
			<el-form-item label="选择方案">
				<el-select v-model="healthAssessmentForm.id" placeholder="请选择" style="margin-left:-423px">
					<el-option
					v-for="item in healthGuidancePage.rows"
					:key="item.id"
					:label="item.name"
					:value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="健康评估" prop="name" >
				<el-input type="textarea" :rows="4" v-model="healthAssessmentForm.healthAssessment"  auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="isHealthAssessment = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitHealthAssessment" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!-- 问诊单页面 -->
	<el-dialog title="问诊单" width="95%" :visible.sync="isShowSheet" :close-on-click-modal="false">
		<InquirySheet :inquirySheet="inquirySheet" @isShowSheetMethod="isShowSheetMethod" ></InquirySheet>
	</el-dialog>
	<!--药方列表-->
    <el-dialog  title="药方列表"  width="95%" :visible.sync="showYaoFang" :close-on-click-modal="false" :before-close="handleClose">
          <el-form label-width="90px" class="demo">
                  <h2 align="left">基本信息</h2>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="姓名：">
                          <span>{{prescribiing.userName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="性别：">
                          <span v-if="prescribiing.userSex == '0'">男</span>
                          <span v-if="prescribiing.userSex == '1'">女</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="年龄：">
                          <span>{{prescribiing.userAge}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                       <el-col :span="8">
                        <el-form-item label="病人ID：" >
                          <span>{{prescribiing.userId}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="审核人：" >
                          <span>{{prescribiing.apothecaryName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="发药人：" >
                          <span>{{prescribiing.dispensingName}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="处方日期：" >
													<el-input v-model="prescribiing.recipeDate"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="主治医生：" >
                          <span>{{prescribiing.doctorName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药费：" >
                          <span>{{prescribiing.amount}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
										 <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="剂数：" >
														<el-input v-model="prescribiing.dosage"></el-input>
                        </el-form-item>
                      </el-col>
											 <el-col :span="8">
                        <el-form-item label="药房：" >
                           <span>{{prescribiing.pharmacy}}</span>
                        </el-form-item>
                      </el-col>
											 <el-col :span="8">
                        <el-form-item label="邮费：" >
													<el-input v-model="prescribiing.postage"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="临床诊断：" >
													<el-input v-model="prescribiing.clinical"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="嘱托：" >
													<el-input v-model="prescribiing.entrust"></el-input>
                        </el-form-item>
                      </el-col>
											 <!-- <el-col :span="8">
                        <el-form-item label="" >
													<el-button v-if="isShowButton()" type="primary" @click="bc">保存</el-button>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                    <h2 align="left">药品信息</h2>
								 <!--工具栏-->
								 	<!-- <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
										<el-form :inline="true" :model="filters" :size="size">
											<el-form-item >
												<kt-button  v-if="isShowButton()" icon="fa fa-plus" label="新增" perms="sys:user:add" type="primary" @click="add" />
											</el-form-item>
										</el-form>
									</div> -->
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
													<!-- <el-table-column label="操作" v-if="isShowButton()">
                            <template slot-scope="scope" >
                                  <el-button  @click="editMedical(scope.row)" type="text" size="small">修改</el-button>
                                  <el-button  @click="deleteMedical(scope.row)" type="text" size="small">删除</el-button>
                                </template>
                          </el-table-column> -->
                      </el-table>
                      <!--分页栏-->
                        <div class="toolbar" style="padding:10px;">
                          <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalPageRequest"
                            :current-page="medicalPage.pageNum" :page-size="medicalPage.pageSize" :total="medicalPage.total" style="float:right;">
                          </el-pagination>
                        </div>
                  </el-form>
        </el-dialog>
				<!--药方列表-->
    <el-dialog  title="药方列表"  width="95%" :visible.sync="showYaoFang_else" :close-on-click-modal="false" :before-close="handleClose">
          <el-form label-width="90px" class="demo">
                  <h2 align="left">基本信息</h2>
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-form-item label="姓名：">
                          <span>{{prescribiing.userName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="性别：">
                          <span v-if="prescribiing.userSex == '0'">男</span>
                          <span v-if="prescribiing.userSex == '1'">女</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="年龄：">
                          <span>{{prescribiing.userAge}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                       <el-col :span="8">
                        <el-form-item label="病人ID：" >
                          <span>{{prescribiing.userId}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="审核人：" >
                          <span>{{prescribiing.apothecaryName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="发药人：" >
                          <span>{{prescribiing.dispensingName}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="处方日期：" >
                           <span>{{prescribiing.recipeDate}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="主治医生：" >
                          <span>{{prescribiing.doctorName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药费：" >
                          <span>{{prescribiing.amount}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="临床诊断：" >
													<span>{{prescribiing.clinical}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药房：" >
                           <span>{{prescribiing.pharmacy}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="剂数：" >
													<span>{{prescribiing.dosage}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="嘱托：" >
													<span>{{prescribiing.entrust}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <h2 align="left">药品信息</h2>
								 <!--工具栏-->
                      <el-table :data="medicalPage.rows" style="width: 100%">
                          <el-table-column type="index" label="序号">
                          </el-table-column>
                          <el-table-column property="id" label="id" v-if="false">
                          </el-table-column>
                          <el-table-column property="name" label="药名">
                          </el-table-column>
                          <el-table-column property="format" label="规格">
                          </el-table-column>
                          <el-table-column property="number" label="数量">
                          </el-table-column>
                          <el-table-column property="entrust" label="嘱托">
                          </el-table-column>
                          <el-table-column property="createUser" label="添加人">
                          </el-table-column>
                          <el-table-column property="createTime" label="添加时间" :formatter="timeFormatter">
                          </el-table-column>
                      </el-table>
                      <!--分页栏-->
                        <div class="toolbar" style="padding:10px;">
                          <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalPageRequest"
                            :current-page="medicalPage.pageNum" :page-size="medicalPage.pageSize" :total="medicalPage.total" style="float:right;">
                          </el-pagination>
                        </div>
                  </el-form>
        </el-dialog>
				<!--新增药方页-->
          <el-dialog  title="药方"  width="95%" :visible.sync="isShow" :close-on-click-modal="false">
            <el-form :model="medicalForm" label-width="80px" :rules="dataFormRules" ref="medicalForm" :size="size" label-position="right">
              <el-form-item label="ID" prop="id" v-if="false">
                <el-input v-model="medicalForm.id"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="药名" prop="name">
				  			<el-autocomplete style="width:100%"
                  v-model="medicalForm.name"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入药名"
                  @select="handleSelect"
                  :trigger-on-focus="false"
                ></el-autocomplete>
              </el-form-item>
              <el-form-item label="数量" prop="number">
                <el-input v-model="medicalForm.number" type="number"  onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )" @change="handlerNumber" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="单价" prop="price">
                <el-input v-model="medicalForm.price" disabled auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="金额" prop="amount">
                <el-input v-model="medicalForm.amount"  disabled></el-input>
              </el-form-item>
              <el-form-item label="嘱托" prop="entrust">
                <el-input v-model="medicalForm.entrust"  auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShow = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitMedicalForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>

					<!--新增健康评估页-->
          <el-dialog  title="健康评估"  width="30%" :visible.sync="isShowAssessment" :close-on-click-modal="false" @close='closeDialog'>
            <el-form :model="assessmentForm" label-width="80px" :rules="assessmentRules" ref="assessmentForm" :size="size" label-position="right">
              <el-form-item label="ID"  v-if="false">
                <el-input v-model="assessmentForm.id"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="健康评估" prop="healthMsg">
				  			<el-input type="textarea" v-model="assessmentForm.healthMsg"  auto-complete="off"></el-input>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowAssessment = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitAssessmentForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
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

		<el-dialog  title="新增患者"  width="50%" :visible.sync="isShowAddPage" :close-on-click-modal="false">
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
                <el-form-item label="请输入手机号" >
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
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtButton from "@/views/Core/KtButton"
import InquirySheet from "@/views/Core/InquirySheet"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { timestampToDate } from "@/utils/datetime"
import { timestampToTime } from "@/utils/datetime"
import { baseUrl } from '@/utils/global'
export default {
	components:{
		PopupTreeInput,
		KtButton,
		TableColumnFilterDialog,
		InquirySheet
	},
	data() {
		return {
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
			frameUrl:"",
			isShow_else:false,
			assessmentForm:{},
			medicalForm:{
				amount:''
			},
			isShow:false,
			guidanceId:'',
			activeNames: ['1'],
			activeName:"first",
			size: 'small',
			userId:'',
			filters: {
				tel: ''
			},
			medicalPage:{
				pageNum:1,pageSize:10
			},
			assessmentResult:{
				pageNum:1,pageSize:10
			},
			chufangPage:{
				pageNum:1,pageSize:10
			},
			isHealthAssessment:false,
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			medicalRecordPage:{pageNum: 1, pageSize: 10},
			healthGuidancePage:{pageNum: 1,pageSize:10},
			healthLogPage:{pageNum:1,pageSize:10},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
			assessmentRules: {
				healthMsg: [
					{ required: true, message: '请输入健康评估', trigger: 'blur' }
				]
			},
			//个人档案
			healthRecord: {
				userId:"",
				userName:"",
				userBirth:"",
				userSex:"",
				userAge:"",
				userAddress:"",
				userEmsAddress:"",
				userTel:"",
				userJob:"",
				isMarry:"",
				idCard:"",
				height:"",
				weight:"",
				eat:"",
				bad:"",
				sports:"",
				rest:"",
				familyHistory:"",
				personalHistory:"",
				medicalRecord:"",
				keeperRemarks:"",
			},
			isHealthGuidance:false,
			healthGuidanceForm:{
				id:'',
				userId:'',
				userName:'',
				keeperId:'',
				diet:'',
				sport:'',
				rest:'',
				hobby:'',
				physicalExamination:'',
				chineseMedicine:'',
				elseOne:'',
				inMind:'',
				startTime:'',
				endTime:'',
				createTime:'',
				active:'',
				reason:'',
				healthAssessment:''
			},
			healthGuidanceRules:{

			},
			healthAssessmentForm:{
				id:'',
				healthAssessment:''
			},
			columnFilters:{},
			isShowSheet:false,
			inquirySheet:{},
			recordId:'',
			chufangId:'',
			showYaoFang:false,
			prescribiing:{},
			filelist:[],
			fileList1:[],
			fileList2:[],
			isShowAssessment:false,
			showYaoFang_else:false,
			restaurants:[],
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
			historyList:[],
			isShowAddPage:false
		}
	},
	methods: {
			// 编辑
      submitRecordlForm: function () {
			this.$refs.recordForm.validate((valid) => {
			if (valid) {
				this.$confirm('确认提交吗？', '提示', {}).then(() => {

				this.$api.user.doctorAddUser(this.recordForm).then((res) => {
					if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
					this.isShowAddPage = false
					} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
					}
					this.findPage()
				})
				})
			}
			})
		},
		addNewUser(){
			this.isShowAddPage = true
		},
		clickTab(targetName){
        if("1"===targetName.paneName){
          document.getElementById('yuancheng').src=this.frameUrl;
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
                this.findPage(null)
              })
      },
		handlerNumber(val){
			 this.medicalForm.amount = (Number.parseInt(val)*Number.parseFloat(this.medicalForm.price)).toFixed(2)
     },
		  //远程搜索中医库
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      handleSelect(item) {
      this.medicalForm.price = item.price
    },
		isShowButton(){
			if(Number.parseInt(this.prescribiing.state)<2){
          return true;
        }else{
          return false;
        }
		},

		closeDialog(){
				this.assessmentForm.id = ''
			this.assessmentForm.healthMsg = ''
		},
		submitAssessmentForm(){
			this.$refs.assessmentForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.$api.healthHouseKeeper.saveAssessment(this.assessmentForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
									this.refreshAssessment(1)
									this.isShowAssessment = false

              })
            })
          }
        })
		},
		edit(row){
			this.isShowAssessment = true
			this.assessmentForm.id = row.id
			this.assessmentForm.healthMsg = row.healthMsg
		},
		addAssessment(){
			this.isShowAssessment = true

		},
		changeExpand(row, expandedRows){
			if(row.extraPic){
                  //回显补充信息图片操作
                let files=[]
                let idArray = (row.extraPic+'').split(',')
                for(var i=0; i<idArray.length; i++) {
                  files.push({name: idArray[i], url: "http://baxitang.com/images/"+idArray[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList  =files
              }
              if(row.docPic){
                  //回显电子处方图片操作
                let files1=[]
                let idArray1 = (row.docPic+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files1.push({name: idArray1[i], url: "http://baxitang.com/images/"+idArray1[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList1  =files1
              }
              if(row.caseHistoryDoc){
                  //回显病历图片操作
                let files2=[]
                let idArray1 = (row.caseHistoryDoc+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files2.push({name: idArray1[i], url: "http://baxitang.com/images/"+idArray1[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList2  =files2
              }
		},

		fasong(id){
			this.$api.healthHouseKeeper.pushYf({id:id}).then((res) => {
            if(res.code == '200'){
						if(res.rows){
							this.recordId = res.rows
						}
              this.$message({ message: '操作成功', type: 'success' })
            }else{
              this.$message({ message: res.msg, type: 'error' })
						}
							this.findChufang(this.chufangPage)
			})

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
		handleClose(done){
			this.recordId = ''
			 done();
		},
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
		add(){
			if(!this.recordId){
				this.$message({message: '请先保存基础信息 ' , type: 'error'})
				return
			}
        for (let k in this.medicalForm) {
          this.medicalForm[k] = ''
					}
					//加载中医库
      this.$api.healthHouseKeeper.selectList().then((res) => {
            if(res.code == '200'){
              this.restaurants = res.rows
              this.restaurants = this.restaurants.map(obj => {
                return{
                  ...obj,
                  value:obj.name
                }
              })

            }
          })
			  this.isShow = true
		  },
		bc(){
			//新增电子处方
			this.prescribiing.state = '1'
			this.prescribiing.userTel = this.healthRecord.userTel
		  this.prescribiing.doctorId = JSON.parse(sessionStorage.getItem("employee")).id
			this.$api.healthHouseKeeper.addPrescribing(this.prescribiing).then((res) => {
            if(res.code == '200'){
				if(res.rows){
					this.recordId = res.rows
				}
              this.$message({ message: '操作成功', type: 'success' })
            }else{
              this.$message({ message: res.msg, type: 'error' })
			}
			this.findChufang(this.chufangPage)
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
		chufangDiag(){

			this.prescribiing = {}
			this.recordId = ''
			this.prescribiing.recordId = this.userId
			this.prescribiing.userId = this.userId
			this.prescribiing.userName = this.healthRecord.userName
			this.prescribiing.userSex = this.healthRecord.userSex
			this.prescribiing.userAge = this.healthRecord.userAge
			this.prescribiing.state = '1'
			this.medicalPage = {pageNum:1,pageSize:10}
			this.showYaoFang = true
		},
		baocun(){
			this.$api.assistant.updateHealthRecord(this.healthRecord).then((res) => {
				if(res.code == '200'){
					this.$message({ message: '操作成功', type: 'success' })
				}
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
		addHealthAssessment(){
			this.isHealthAssessment = true
		},
		searchHealthLog(){
			this.columnFilters.guidanceId={name:'guidanceId', value:this.guidanceId}
			this.healthLogPage.pageNum = 1
			this.healthLogPage.columnFilters=this.columnFilters
			this.$api.healthHouseKeeper.selectLogPage(this.healthLogPage).then((res) => {
				if(res.code == '200'){
					this.healthLogPage = res
					this.healthLogPage.columnFilters = this.columnFilters
				}
			})
		},
		activeEdit(row){
			this.$api.healthHouseKeeper.saveHealthGuidance({"id":row.id,"active":row.active == '0'?"1":"0"}).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.refreshHealthGuidance(1)
			})
		},
			submitHealthGuidance(){
						this.$api.healthHouseKeeper.saveHealthGuidance(this.healthGuidanceForm).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
						})
			},
			submitHealthAssessment(){
				this.$refs.healthAssessmentForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true

						this.$api.healthHouseKeeper.saveHealthGuidance(this.healthAssessmentForm).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.isHealthAssessment = false
								this.$refs['healthAssessmentForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.refreshHealthGuidance(1)
						})
					})
				}
				})
			},
			healthGuidanceEdit(row){
				this.isHealthGuidance = true
				this.healthGuidanceForm = row
			},
			healthGuidanceDialog(){
				this.isHealthGuidance = true
			},
			uploadUrl(){
				return baseUrl+"/system/upload";
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		periodFormatter: function(row){

			return timestampToDate(row.startTime)+"到"+timestampToDate(row.endTime)
		},
		dataFormatter:function(row) {
			return timestampToDate(row.createTime)
		},
		timeFormatter:function(row) {
			return timestampToTime(row.createTime)
		},
		dataFormatter1:function(row) {
			return timestampToTime(row.createDate)
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
		// 获取我的会员分页数据
		findPage: function (data) {
			if(data) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {userName: {name:'userName', value:this.filters.userName},
			userTel: {name:'userTel', value:this.filters.userTel}}
			this.$api.healthHouseKeeper.selectPatient(this.pageRequest).then((res) => {
				this.pageResult = res
			}).then(data!=null?data.callback:'')
		},
		// 获取会员医疗记录分页数据
		findMedicalRecord: function (data) {
			this.$api.healthHouseKeeper.selectByContion(data).then((res) => {
				if(res.code == '200'){
					this.medicalRecordPage = res
					this.medicalRecordPage.columnFilters = data.columnFilters
				}
			})
		},
		// 获取会员健康指导分页数据
		findHealthGuidance: function (data) {
			this.$api.healthHouseKeeper.selectPage({userId:data}).then((res) => {
				if(res.code == '200'){
					this.healthGuidanceForm = res.rows
				}
			})
		},
		//获取健康日志分页数据
		findHealthLog:function(data){
			this.$api.healthHouseKeeper.selectLogPage(data).then((res) => {
				if(res.code == '200'){
					this.healthLogPage = res
					this.healthLogPage.columnFilters = data.columnFilters
				}
			})
		},

		//获取健康评估分页数据
		findAssessment:function(data){
			this.$api.healthHouseKeeper.selectassessmentPage(data).then((res) => {
				if(res.code == '200'){
					this.assessmentResult = res
					this.assessmentResult.columnFilters = data.columnFilters
				}
			})
		},
		//获取保健品分页数据
		findChufang:function(data){
			this.$api.healthHouseKeeper.selectChufang(data).then((res) => {
				if(res.code == '200'){
					this.chufangPage = res
					this.chufangPage.columnFilters = data.columnFilters
				}
			})
		},

		//查看保健品电子处方
		yaofang1:function (value) {
			 //查询电子处方
      		this.$api.healthHouseKeeper.selectPrescribing({id:value}).then((res) => {
            if(res.code == '200'){
              this.prescribiing = res.rows
            }
          })
			this.recordId = value
			this.findMedicalPage(null)
			this.showYaoFang = true
		},
		//查看药方
		yaofang:function (value) {
			 //查询电子处方
      		this.$api.healthHouseKeeper.selectByRecordIdPrescribing({recordId:value}).then((res) => {
            if(res.code == '200'){
              this.prescribiing = res.rows
            }
          })
			this.recordId = value
			this.findMedicalPage(null)
			this.showYaoFang_else = true
		},
		// 获取药方分页数据
      	findMedicalPage: function (data) {
			if(data){
			this.medicalPage = data
			}
			this.medicalPage.columnFilters = {recordId:{name:'recordId',value:this.recordId}}
			this.$api.assistant.selectMedical(this.medicalPage).then((res) => {
			this.medicalPage = res
			})
	  },
	  //药方表换页刷新
    refreshMedicalPageRequest:function(pageNum){
      this.medicalPage.pageNum = pageNum
      this.findMedicalPage(this.medicalPage)
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
						this.$api.user.save(params).then((res) => {
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
		// 我的会员列表换页刷新
		refreshPageRequest: function (pageNum) {

			this.pageRequest.pageNum = pageNum
			this.findPage()
		},
		// 医疗记录列表换页刷新
		refreshMedicalPageRequest: function (pageNum) {
			this.medicalRecordPage.pageNum = pageNum
			this.findMedicalRecord(this.medicalRecordPage)
		},
		//健康指导列表幻夜刷新
		refreshHealthGuidance: function(pageNum){
			this.healthGuidancePage.pageNum  = pageNum
			this.findHealthGuidance(this.healthGuidancePage)
		},
		//健康日志列表换页刷新
		refreshHealthLog: function(pageNum) {
			this.healthLogPage.pageNum = pageNum
			this.findHealthLog(this.healthLogPage)
		},
		//健康评估列表换页刷新
		refreshAssessment: function(pageNum) {
			this.assessmentResult.pageNum = pageNum
			this.findAssessment(this.assessmentResult)
		},

		//保健品电子处方换页刷新
		refreshChufang: function(pageNum) {
			this.chufangPage.pageNum = pageNum
			this.findChufang(this.chufangPage)
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
		//点击会员id触发的事件
		xiangqing:function(index,row){
			this.assessmentForm.userId = row.id
			this.assessmentForm.userName = row.userName
			this.userId = row.id
			this.healthGuidanceForm.userId = row.id
			this.healthGuidanceForm.userName = row.userName
			this.frameUrl = "https://dkaimed.com/dkang/user.do/queryReportNoPower?phone="+row.userTel
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
			this.dialogVisible = true;
			// //查询医疗记录
			// this.medicalRecordPage.columnFilters = {userId: {name:'userId', value:row.id}}
			// this.findMedicalRecord(this.medicalRecordPage)
			// this.dialogVisible = true;
			// //查询健康指导
			// this.findHealthGuidance(row.id)
			// //查询健康日志
			// this.healthLogPage.columnFilters = {userId: {name:'userId', value:row.id}}
			// this.findHealthLog(this.healthLogPage)
			// this.assessmentResult.columnFilters = {userId: {name:'userId', value:row.id}}
			// this.findAssessment(this.assessmentResult)

			// //查询保健品电子药单
			// this.chufangPage.columnFilters = {recordId: {name:'recordId', value:row.id}}
			// this.findChufang(this.chufangPage)
		},
		imgUtil(value){
			if(value){
				let files2=[]
				let idArray1 = value.split(',')
				for(var i=0; i<idArray1.length; i++) {
					files2.push("http://baxitang.com/images/"+idArray1[i])
				}
				return files2
			}
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
		//保健品状态
		stateFormatter:function(row){
			switch (row.state){
				case '1':
					return "新增";
				case '2':
					return "待划价";
				case '3':
					return "待付费";
				case '4':
					return "代发货";
				case '5':
					return "已完成";
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
					return "待发货";
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
		this.findPage(null);
	},
	filters:{
		timeStatus:function(value){
			if(value){
				return timestampToTime(value)
			}
		},
		dateStatus:function (value) {
			if(value){
				return timestampToDate(value)
			}
		},
		recordStateFormatter:function(value){
          switch (value){
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
              return "待发货";
            case '10':
              return "已发货";
            case '11':
              return "已完成";
            case '12':
              return "已取消";
          }
        },
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
