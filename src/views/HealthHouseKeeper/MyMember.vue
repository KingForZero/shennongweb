<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-form-item>
				<el-input v-model="filters.tel" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="filters.name" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
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
		<el-table-column property="userName" label="姓名" >
			<template slot-scope="scope">
				<router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
					{{scope.row.userName}}
				</router-link>
			</template>
		</el-table-column>
		<el-table-column property="userSex" label="性别" :formatter="sexFormatter">
		</el-table-column>
		<el-table-column property="userTel" label="电话">
		</el-table-column>
		<!-- <el-table-column label="对照状态" prop="compare" :formatter="compareFormatter"></el-table-column>
		<el-table-column label="标记人" prop="compareUserName" ></el-table-column> -->
	</el-table>
	<!--分页栏-->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
        :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageResult.total" style="float:right;">
      </el-pagination>
    </div>
	<el-dialog  title="既往病史"  width="80%" :visible.sync="isShowHistory" :close-on-click-modal="false">
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
          <el-dialog  title="新增既往病史"  width="80%" :visible.sync="isShowAddHistory" :close-on-click-modal="false">
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
	<!--用户详情界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<template>
			<el-tabs v-model="activeName" >
				<el-tab-pane label="个人档案" name="first">
					<el-form label-width="90px" class="demo">
						<h2 align="left">基本信息</h2>
						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="姓名：" >
									<span>{{healthRecord.userName}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="性别：">
									<span v-if="healthRecord.userSex=='0'">男</span>
									<span v-if="healthRecord.userSex=='1'">女</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="出生日期：">
									<span>{{healthRecord.userBirth|dateStatus}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="年龄：" >
									<span>{{healthRecord.userAge}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="职业：">
									<span>{{healthRecord.userJob}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="家庭地址：">
									<span>{{healthRecord.userAddress}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="婚育状况：" >
									<span v-if="healthRecord.isMarry=='0'">未婚</span>
									<span v-if="healthRecord.isMarry=='1'">已婚</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="身份证号：">
									<span>{{healthRecord.idCard}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="联系电话：">
									<span>{{healthRecord.userTel}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="身高：" >
									<span>{{healthRecord.height}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="体重：">
									<span>{{healthRecord.weight}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="不良嗜好 ：">
									<span>{{healthRecord.bad}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="饮食习惯：" >
									<span>{{healthRecord.eat}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="作息习惯：">
									<span>{{healthRecord.rest}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="运动习惯：">
									<span>{{healthRecord.sports}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">病史</h2>
						<el-row>
							<el-col :span="20">
								<el-form-item label="家族病史：">
									<span>{{healthRecord.familyHistory}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="20">
								<el-form-item label="过敏史：">
									<span>{{healthRecord.allergicHistory}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="20">
								<el-form-item label="个人病史：">
									<el-button type="primary" @click="medicalHistory(healthRecord.userId)" >查看既往病史</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="20">
								<el-form-item label="就医记录：">
									<span>{{healthRecord.medicalRecord}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">管家备注</h2>
						<el-row :gutter="10">
							<el-col :span="20">
								<el-form-item label="">
									<el-input type="textarea" :rows="4" v-model="healthRecord.keeperRemarks"></el-input>
								</el-form-item>
								
							</el-col>
						</el-row>
						<el-button type="primary" @click="baocun">保存</el-button>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="医疗记录" name="second">
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
						<!-- <el-table-column label="ID" prop="recordId"></el-table-column> -->
						<el-table-column label="患者姓名" prop="userName"></el-table-column>
						<el-table-column label="是否初诊" prop="changeDoc" :formatter="changeDocFormatter"></el-table-column>
						<el-table-column label="状态" prop="recordState" :formatter="recordStateFormatter"></el-table-column>
						<el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" 
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
							<!-- <el-form-item label="起始日期" prop="startTime">
								<el-date-picker
								v-model="healthGuidanceForm.startTime"
								type="date"
								placeholder="选择日期"
								format="yyyy 年 MM 月 dd 日"
								value-format="timestamp" style="margin-left:-424px">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="结束日期" prop="endTime">
								<el-date-picker
								v-model="healthGuidanceForm.endTime"
								type="date"
								placeholder="选择日期"
								format="yyyy 年 MM 月 dd 日"
								value-format="timestamp" style="margin-left:-424px">
								</el-date-picker>
							</el-form-item> -->
							<el-form-item label="管家备注" prop="reason">
								<el-input v-model="healthGuidanceForm.reason" auto-complete="off"></el-input>
							</el-form-item>
							<!-- <el-form-item label="是否收费" prop="active" >
								<el-radio-group v-model="healthGuidanceForm.active">
									<el-radio label="0">禁用</el-radio>
									<el-radio label="1">启用</el-radio>
								</el-radio-group>
							</el-form-item> -->
							<div >
								<el-button :size="size" type="primary" @click.native="submitHealthGuidance" :loading="editLoading">{{$t('action.submit')}}</el-button>
							</div>
						</el-form>
					
				</el-tab-pane>
				<el-tab-pane label="健康日志" name="fourth">
					<!--工具栏-->
					<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
						<el-form :inline="true" :model="filters" :size="size">
							<el-form-item>
								<el-select v-model="guidanceId" placeholder="请选择">
									<el-option
									v-for="item in healthGuidancePage.rows"
									:key="item.id"
									:label="item.name"
									:value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<kt-button icon="fa fa-plus" :label="$t('action.search')" perms="sys:user:add" type="primary" @click="searchHealthLog" />
							</el-form-item>
						</el-form>
					</div>
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
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshHealthLog" 
						:current-page="healthLogPage.pageNum" :page-size="healthLogPage.pageSize" :total="healthLogPage.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="健康评估" name="">
						<!--工具栏-->
					<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
						<el-form :inline="true"  :size="size">
							<el-form-item>
								<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="addAssessment" />
							</el-form-item>
						</el-form>
					</div>
					<el-table :data="assessmentResult.rows" style="width: 100%">
						<el-table-column type="index" label="序号" >
						</el-table-column>
						<!-- <el-table-column property="id" label="id" >
						</el-table-column> -->
						<el-table-column property="userName" label="姓名" >
						</el-table-column>
						<el-table-column property="createName" label="创建人" >
						</el-table-column>
						<el-table-column property="healthMsg" label="健康评估" :show-overflow-tooltip='true'>
						</el-table-column>
						<el-table-column property="createDate" label="创建日期"  :formatter="dataFormatter1">
						</el-table-column>
						<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click="edit(scope.row)">修改</el-button>
						</template>
						</el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshAssessment" 
						:current-page="assessmentResult.pageNum" :page-size="assessmentResult.pageSize" :total="assessmentResult.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane>
				<!-- <el-tab-pane label="开药记录" name="">
					<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
						<el-form :inline="true" :model="filters" :size="size">
							<el-form-item>
								<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="chufangDiag" />
							</el-form-item>
						</el-form>
					</div>
					<el-table :data="chufangPage.rows" style="width: 100%">
						<el-table-column type="index" label="序号" >
						</el-table-column>
						<el-table-column property="id" label="id" >
						</el-table-column>
						<el-table-column property="userName" label="姓名">
						</el-table-column>
						<el-table-column property="state" label="状态" :formatter="stateFormatter">
						</el-table-column>
						<el-table-column property="createDate" label="创建日期"  :formatter="dataFormatter1">
						</el-table-column>
						<el-table-column fixed="right" label="操作" align="center">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click="yaofang1(scope.row.id)">查看药方</el-button>
							<el-button size="small" type="text" v-if="scope.row.state == '1'" @click="fasong(scope.row.id)">发送给药房</el-button>
						</template>
						</el-table-column>
					</el-table>
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshChufang" 
						:current-page="chufangPage.pageNum" :page-size="chufangPage.pageSize" :total="chufangPage.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane> -->
				<el-tab-pane label="健康方案" name="">
						<!--工具栏-->
					<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
						<el-form :inline="true"  :size="size">
							<el-form-item>
								<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="addProgramme" />
							</el-form-item>
						</el-form>
					</div>
					<el-table :data="programmeResult.rows" style="width: 100%">
						<el-table-column type="index" label="序号" >
						</el-table-column>
						<!-- <el-table-column property="id" label="id" >
						</el-table-column> -->
						<el-table-column property="userName" label="姓名" >
						</el-table-column>
						<el-table-column property="createName" label="创建人" >
						</el-table-column>
						<el-table-column property="createTime" label="创建日期"  :formatter="dataFormatter2">
						</el-table-column>
						<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click="editProgramme(scope.row)">修改</el-button>
						</template>
						</el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshProgramme" 
						:current-page="programmeResult.pageNum" :page-size="programmeResult.pageSize" :total="programmeResult.total" style="float:right;">
					</el-pagination>
					</div>
				</el-tab-pane>
				
			</el-tabs>
		</template>
	</el-dialog>
	<!--健康指导新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="isHealthGuidance" :close-on-click-modal="false">
		
	</el-dialog>
	<!-- 健康评估页面 -->
	<el-dialog title="健康评估" width="80%" :visible.sync="isHealthAssessment" :close-on-click-modal="false">
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
	<el-dialog title="问诊单" width="60%" :visible.sync="isShowSheet" :close-on-click-modal="false">
		<InquirySheet :inquirySheet="inquirySheet" @isShowSheetMethod="isShowSheetMethod" ></InquirySheet>
	</el-dialog>
	<!--药方列表-->
    <el-dialog  title="药方列表"  width="60%" :visible.sync="showYaoFang" :close-on-click-modal="false" :before-close="handleClose">
          <el-form label-width="120px" class="demo" :model="prescribiing" ref="prescribiing">
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
                        <el-form-item label="药房：" >
                           <span>{{prescribiing.pharmacy}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="中药种类：" prop="medicalType" :rules="{
      required: true, message: '中药种类必选', trigger: 'blur'
    }">
                          <el-select v-model="prescribiing.medicalType" placeholder="请选择中药种类" @change="handleChangeMedicalType">
                            <el-option label="饮片类" value="1"></el-option>
                            <el-option label="颗粒类" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="加工方式：" v-if="isShowMadeType" prop="madeType" :rules="{
                                        required: true, message: '加工方式必选', trigger: 'blur'
                                      }">
                          <el-select v-model="prescribiing.madeType" placeholder="请选择加工方式"  @change="handleChangeMadeType">
                            <el-option label="大蜜丸" value="1"></el-option>
                            <el-option label="浓缩丸" value="2"></el-option>
                            <el-option label="水丸" value="3"></el-option>
                            <el-option label="水蜜丸" value="4"></el-option>
                            <el-option label="打粉" value="5"></el-option>
                            <el-option label="膏方" value="6"></el-option>
                            <el-option label="汤剂" value="7"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                     <el-col :span="8">
                        <el-form-item label="剂数：">
                          <el-input-number v-model="prescribiing.dosage" @change="handleChangeDosage" :min="1"  label="描述文字">
                            <template slot="append">剂</template>
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="总重量：" >
                          <el-input :disabled="true" @change="handleChangeWeight" v-model="prescribiing.weight">
                            <template slot="append">克</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药费：" >
                          <el-input :disabled="true" v-model="prescribiing.amount">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                       <el-col :span="8">
                        <el-form-item label="加工费：">
                          <el-input :disabled="true" v-model="prescribiing.processCost">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
										<el-row :gutter="15">
                      <el-col :span="16">
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
											 <el-col :span="8">
                        <el-form-item label="" >
													<el-button v-if="isShowButton()" type="primary" @click="bc">保存</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <h2 align="left">药品信息</h2>
								 <!--工具栏-->
								 	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
										<el-form :inline="true" :model="filters" :size="size">
											<el-form-item >
												<kt-button  v-if="isShowButton()" icon="fa fa-plus" label="新增" perms="sys:user:add" type="primary" @click="add" />
											</el-form-item>
										</el-form>
									</div>
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
													<el-table-column label="操作" v-if="isShowButton()">
                            <template slot-scope="scope" >
                                  <el-button  @click="editMedical(scope.row)" type="text" size="small">修改</el-button>
                                  <el-button  @click="deleteMedical(scope.row)" type="text" size="small">删除</el-button>
                                </template>
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
				<!--药方列表-->
    <el-dialog  title="药方列表"  width="60%" :visible.sync="showYaoFang_else" :close-on-click-modal="false" :before-close="handleClose">
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
                          <el-input v-model="prescribiing.recipeDate" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="主治医生：" >
                          <span>{{prescribiing.doctorName}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药房：" >
                           <span>{{prescribiing.pharmacy}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="中药种类：">
                          <el-select v-model="prescribiing.medicalType" disabled>
                            <el-option label="饮片类" value="1"></el-option>
                            <el-option label="颗粒类" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="加工方式：">
                          <el-select v-model="prescribiing.madeType" disabled>
                            <el-option label="大蜜丸" value="1"></el-option>
                            <el-option label="浓缩丸" value="2"></el-option>
                            <el-option label="水丸" value="3"></el-option>
                            <el-option label="水蜜丸" value="4"></el-option>
                            <el-option label="打粉" value="5"></el-option>
                            <el-option label="膏方" value="6"></el-option>
                            <el-option label="汤剂" value="7"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                     <el-col :span="8">
                        <el-form-item label="剂数：">
                          <el-input-number v-model="prescribiing.dosage" disabled>
                            <template slot="append">剂</template>
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="总重量：" >
                          <el-input :disabled="true" v-model="prescribiing.weight">
                            <template slot="append">克</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药费：" >
                          <el-input :disabled="true" v-model="prescribiing.amount">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                       <el-col :span="8">
                        <el-form-item label="加工费：">
                          <el-input :disabled="true" v-model="prescribiing.processCost">
                            <template slot="append">元</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="邮费：" >
													<el-input v-model="prescribiing.postage" disabled>
                            <template slot="append">元</template>
                          </el-input>
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
													<el-table-column property="price" label="单价">
                          </el-table-column>
                          <el-table-column property="number" label="数量">
                          </el-table-column>
													<el-table-column property="amount" label="价格">
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
          <el-dialog  title="药方"  width="60%" :visible.sync="isShow" :close-on-click-modal="false">
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
                <el-input type="number" v-model="medicalForm.number" v-on:input="handlerNumber">
                </el-input>
              </el-form-item>
              <el-form-item label="单位" prop="unit">
                <el-input v-model="medicalForm.unit" disabled auto-complete="off">
                </el-input>
              </el-form-item>
              <el-form-item label="单价" prop="price">
                <el-input v-model="medicalForm.price" disabled auto-complete="off">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="金额" prop="amount">
                <el-input v-model="medicalForm.amount"  disabled auto-complete="off">
                  <template slot="append">元</template>
                </el-input>
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
          <el-dialog  title="健康评估"  width="80%" :visible.sync="isShowAssessment" :close-on-click-modal="false" @close='closeDialog'>
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
		  <!--新增健康健康方案页-->
          <el-dialog  title="健康方案"  width="90%" :visible.sync="isShowProgramme" :close-on-click-modal="false" @close='closeProgrammeDialog'>

            <el-form :model="programmeForm" label-width="80px"  :size="size" label-position="right">
              <el-form-item label="ID"  v-if="false">
                <el-input v-model="programmeForm.id"  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="健康方案" prop="healthMsg">
				  	<UEditor :defaultMsg=this.config.initialContent :config=config ref="ueditor" v-if="dialogFormDiviable"></UEditor>
              </el-form-item>
             
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowProgramme = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitProgrammeForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
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
import UEditor from '@/components/ueditor/ueditor.vue'
export default {
	components:{
		PopupTreeInput,
		KtButton,
		TableColumnFilterDialog,
		InquirySheet,
		UEditor
	},
	data() {
		return {
			dialogFormDiviable:false,
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
			isShow_else:false,
			assessmentForm:{},
			programmeForm:{},
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

			programmeResult:{
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
					{ required: true, message: '请输入药名', trigger: 'blur' }
				],
				number: [
					{ required: true, message: '请输入数量', trigger: 'blur' }
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
			isShowProgramme:false,
			showYaoFang_else:false,
			restaurants:[],
			isShowMadeType:false,
			weight:'',
			amount:'',
			historyList:[],
			isShowAddHistory:false,
			historyForm:{},
			isShowPic:false,
			isShowHistory:false,
		}
	},
	methods: {
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
		 detailHistory(row){
        this.isShowPic = true
        this.isShowAddHistory = true
        this.historyForm = Object.assign(this.historyForm,row)
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
        this.isShowHistory = true
        
      },
		//获取富文本编辑器内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        // console.log(content);
        // alert(content);
        return content;
      },
		handleChangeMadeType(val){
        if(val){
          this.compute()
        }
      },
      handleChangeMedicalType(val){
        this.prescribiing.madeType = ''
        if(val == '1'){
          this.isShowMadeType = true
        }else if(val == '2'){
          this.isShowMadeType = false
          this.compute()
        }
         this.zhongyi(val)
      },
      //计算加工费的方法
      compute(){
        if(this.prescribiing.weight){
          if(this.prescribiing.medicalType == '2'){
            this.prescribiing.processCost = 0
          }else if(this.prescribiing.medicalType == '1'){
            if(this.prescribiing.madeType == '1'){
              if(Number(this.prescribiing.weight)<1100){
                this.prescribiing.processCost = 125
              }else{
                this.prescribiing.processCost = (parseInt((Number(this.prescribiing.weight)-1000)/100))*10+125
              }
            }else if(this.prescribiing.madeType == '2'){
              if(Number(this.prescribiing.weight)<1100){
                this.prescribiing.processCost = 180
              }else{
                this.prescribiing.processCost = (parseInt((Number(this.prescribiing.weight)-1000)/100))*15+180
              }
            }else if(this.prescribiing.madeType == '3'){
              if(Number(this.prescribiing.weight)<1100){
                this.prescribiing.processCost = 100
              }else{
                this.prescribiing.processCost = (parseInt((Number(this.prescribiing.weight)-1000)/100))*10+100
              }
            }else if(this.prescribiing.madeType == '4'){
              if(Number(this.prescribiing.weight)<1100){
                this.prescribiing.processCost = 180
              }else{
                this.prescribiing.processCost = (parseInt((Number(this.prescribiing.weight)-1000)/100))*15+180
              }
            }else if(this.prescribiing.madeType == '5'){
              if(Number(this.prescribiing.weight)<1000){
                this.prescribiing.processCost = 10
              }else{
                this.prescribiing.processCost = parseInt(Number(this.prescribiing.weight)/1000)*10
              }
            }else if(this.prescribiing.madeType == '6'){
              if(Number(this.prescribiing.weight)>6000){
                if((Number(this.prescribiing.weight)-6000)%500 != 0){
                  this.prescribiing.processCost = (parseInt((Number(this.prescribiing.weight)-6000)/500)+1)*25+300
                }else{
                  this.prescribiing.processCost = parseInt((Number(this.prescribiing.weight)-6000)/500)*25+300
                }
              }else{
                this.prescribiing.processCost = 300
              }
            }else if(this.prescribiing.madeType == '7'){
                this.prescribiing.processCost = Number(this.prescribiing.dosage)*2
            }
          }
        }
      },
      handleChangeWeight(val){
        if(val){
          this.compute()
        }
      },
      handleChangeDosage(val){
        if(val){
					if(this.prescribiing.weight){
						this.prescribiing.weight = this.roundFun(Number(this.weight)*Number(val),2)
						this.prescribiing.amount = this.roundFun(Number(this.amount)*Number(val),2)
						this.compute()

					}
        }
      },
     handlerNumber(val){
       if(this.medicalForm.price){
         this.medicalForm.amount = (Number.parseFloat(val)*Number.parseFloat(this.medicalForm.price)).toFixed(2)
       }
     },
    roundFun(numberRound,roundDigit) { //四舍五入，保留位数为roundDigit
          if (numberRound>=0){
          var tempNumber = parseInt((numberRound * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
          return tempNumber;
          } else{
          numberRound=-numberRound;
          var tempNumber = parseInt((numberRound * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
          return -tempNumber;
          }
				},
				//加载中医库
    zhongyi(type){
      this.$api.healthHouseKeeper.selectList({type:type}).then((res) => {
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
		closeProgrammeDialog(){
				this.programmeForm.id = ''
			this.programmeForm.detail = ''
			this.dialogFormDiviable = false;//清空数据
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
		submitProgrammeForm(){
			 this.programmeForm.detail=this.getContent()
       
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.$api.healthHouseKeeper.saveProgramme(this.programmeForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
				this.refreshProgramme(1)
				this.isShowProgramme = false
										
              })
            })
          
       
		},
		editProgramme(row){
			this.isShowProgramme = true
			 this.dialogFormDiviable=true
			this.programmeForm.id = row.id
			this.config.initialContent =  row.detail
		},
		addProgramme(){
			this.isShowProgramme = true
			 this.dialogFormDiviable=true
		},
		changeExpand(row, expandedRows){
			if(row.extraPic){
                  //回显补充信息图片操作
                let files=[]
                let idArray = (row.extraPic+'').split(',')
                for(var i=0; i<idArray.length; i++) {
                  files.push({name: idArray[i], url: "http://39.106.123.28/images/"+idArray[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList  =files
              }
              if(row.docPic){
                  //回显电子处方图片操作
                let files1=[]
                let idArray1 = (row.docPic+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files1.push({name: idArray1[i], url: "http://39.106.123.28/images/"+idArray1[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList1  =files1
              }
              if(row.caseHistoryDoc){
                  //回显病历图片操作
                let files2=[]
                let idArray1 = (row.caseHistoryDoc+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files2.push({name: idArray1[i], url: "http://39.106.123.28/images/"+idArray1[i]})
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
              this.$api.assistant.deleteById(row).then((res) => {
                if(res.code == 200) {

                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShow = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
								this.findMedicalPage(null)
								this.countAmonut(this.recordId)
              })
            })
      },
		handleClose(done){
			this.recordId = ''
			 done();
		},
		countAmonut:function(data){
         this.$api.assistant.countAmonut({recordId:data}).then((res) => {
          this.amount = res.rows.amount
          this.weight = res.rows.weight
          this.prescribiing.medicalType = res.rows.medicalType
          this.prescribiing.madeType = res.rows.madeType
          this.prescribiing.dosage = res.rows.dosage
          this.prescribiing.amount = res.rows.amountTotal
          this.prescribiing.weight = res.rows.weightTotal
          this.prescribiing.processCost = res.rows.processCost
        })
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
									this.countAmonut(this.recordId)
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
			  this.isShow = true	
		  },
		bc(){
			//新增电子处方
			this.$refs["prescribiing"].validate((valid) => {
          if (valid) {
							this.prescribiing.state = '1'
							this.prescribiing.type = '2'
							this.prescribiing.userTel = this.healthRecord.userTel
							this.prescribiing.doctorId = JSON.parse(sessionStorage.getItem("employee")).id
							this.$api.healthHouseKeeper.addPrescribing(this.prescribiing).then((res) => {
										if(res.code == '200'){
								if(res.rows){
									this.recordId = res.rows
								}
									this.zhongyi(this.prescribiing.medicalType)
											this.$message({ message: '操作成功', type: 'success' })
										}else{
											this.$message({ message: res.msg, type: 'error' })
							}
							this.findChufang(this.chufangPage)
         		 })
						} else {
            return false;
          }
        });
			
      },
		chufangDiag(){
			
			this.prescribiing = {
				medicalType : '',
				madeType : ''
			}
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
		dataFormatter2:function(row) {
			return timestampToTime(row.createTime)
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
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			let id = JSON.parse(sessionStorage.getItem("employee")).id;
			this.pageRequest.columnFilters = {keeperId: {name:'keeperId', value:id}}
			this.$api.healthHouseKeeper.selectClientUserByKeeper(this.pageRequest).then((res) => {
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
		//获取健康方案分页数据
		findProgramme:function(data){
			this.$api.healthHouseKeeper.selectProgramme(data).then((res) => {
				if(res.code == '200'){
					this.programmeResult = res
					this.programmeResult.columnFilters = data.columnFilters
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
							this.zhongyi(this.prescribiing.medicalType)
							this.countAmonut(value)
							if(this.prescribiing.medicalType == '1'){
								this.isShowMadeType  = true
							}else if(this.prescribiing.medicalType == '2'){
								this.isShowMadeType = false
							}
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
		refreshPageRequest: function (pageNum) {
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
		//健康方案列表换页刷新
		refreshProgramme: function(pageNum) {
			this.programmeResult.pageNum = pageNum
			this.findProgramme(this.programmeResult)
		},
		//保健品电子处方换页刷新
		refreshChufang: function(pageNum) {
			this.chufangPage.pageNum = pageNum
			this.findChufang(this.chufangPage)
		},
		//点击会员id触发的事件
		xiangqing:function(index,row){
			this.assessmentForm.userId = row.id
			this.assessmentForm.userName = row.userName
			this.programmeForm.userId = row.id
			this.programmeForm.userName = row.userName
			this.userId = row.id
			this.healthGuidanceForm.userId = row.id
			this.healthGuidanceForm.userName = row.userName
			//查询个人档案
			this.$api.assistant.selectHealthRecord({userId:row.id}).then((res) => {
				if(res.code == '200'){
					this.healthRecord = res.rows
				}	
			})
			//查询医疗记录
			this.medicalRecordPage.columnFilters = {userId: {name:'userId', value:row.id}}
			this.findMedicalRecord(this.medicalRecordPage)
			this.dialogVisible = true;
			//查询健康指导
			this.findHealthGuidance(row.id)
			//查询健康日志
			this.healthLogPage.columnFilters = {userId: {name:'userId', value:row.id}}
			this.findHealthLog(this.healthLogPage)
			//查询健康评估
			this.assessmentResult.columnFilters = {userId: {name:'userId', value:row.id}}
			this.findAssessment(this.assessmentResult)
			//查询健康方案
			this.programmeResult.columnFilters = {userId: {name:'userId', value:row.id}}
			this.findProgramme(this.programmeResult)

			//查询保健品电子药单
			this.chufangPage.columnFilters = {recordId: {name:'recordId', value:row.id}}
			this.findChufang(this.chufangPage)
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
