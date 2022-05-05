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
          <!-- <kt-button icon="fa fa-search" :label="$t('action.add')" perms="sys:role:view" type="primary" @click="lalala()"/> -->
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-add" label="新增医案" type="primary" @click="addMedicalRecord()"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">

    </div>
    <!--表格内容栏-->
        <el-table :data="medicalRecordPage.rows" style="width: 100%">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column label="患者姓名" prop="userName" >
              <template slot-scope="scope">
                <router-link tag="span" to="#" @click.native="xiangqing(scope.$index, scope.row)" style="color:blue">
                  {{scope.row.userName}}

                </router-link>
                <span v-if="scope.row.photo=='1'">
                  <icon name="paizhao" width="17" height="19"></icon>
                </span>
              </template>

            </el-table-column>
              <!-- <el-table-column label="患者姓名" prop="userName" width="100px"></el-table-column> -->
              <el-table-column label="患者电话" prop="userTel"></el-table-column>
              <el-table-column label="主治医生" prop="docName" width="100px"></el-table-column>
              <el-table-column label="是否初诊" prop="first" width="100px" :formatter="firstFormatter"></el-table-column>
              <el-table-column label="是否转诊" prop="changeDoc" width="100px" :formatter="changeDocFormatter"></el-table-column>
              <el-table-column label="转诊状态" prop="needChangeDoc" width="100px" :formatter="isChangeFormatter"></el-table-column>
              <el-table-column label="折扣" prop="discount"></el-table-column>
              <el-table-column label="状态" prop="recordState" :formatter="recordStateFormatter"></el-table-column>
              <el-table-column label="创建时间" prop="createTime" :formatter="timeFormatter"></el-table-column>
              <el-table-column label="审核时间" prop="auditTime" :formatter="auditTimeFormatter"></el-table-column>
              <el-table-column label="审核人" prop="auditName"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.recordState == '1'" @click="sendDoctor(scope.row)" type="text" size="small">发送给医生</el-button>
                    <el-button v-if="scope.row.recordState == '3'" @click="tijiao(scope.row)" type="text" size="small">处理完成提交药师</el-button>
                    <el-button v-if="scope.row.recordState == '5'" @click="tijiao(scope.row)" type="text" size="small">重新提交给药师</el-button>
                    <el-button v-if="scope.row.recordState == '5'" @click="reject(scope.row)" type="text" size="small">查看驳回原因</el-button>
                    <el-button v-if="scope.row.needChangeDoc == '1'" @click="change(scope.row)" type="text" size="small">转诊</el-button>
                    <el-button v-if="scope.row.needChangeDoc == '1'" @click="unChange(scope.row)" type="text" size="small">取消转诊</el-button>
                </template>
              </el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalRecord"
              :current-page="medicalRecordPage.pageNum" :page-size="medicalRecordPage.pageSize" :total="medicalRecordPage.total" style="float:right;">
            </el-pagination>
					</div>
        <!--新增药方页-->
          <el-dialog  title="药方"  width="90%" :visible.sync="isShow" :close-on-click-modal="false" @close='closeDialog'>
            <el-form :model="medicalForm" label-width="80px" ref="medicalForm" :size="size" label-position="right">
              <el-row v-for="(item,index) in medicalForm.medicalList" :key="index">
                <el-col :span="4">
                  <el-form-item label="药名" :prop="'medicalList.' + index + '.name'" :rules="{
                      required: true, message: '药名不能为空', trigger: 'blur'
                    }">
                    <el-autocomplete style="width:100%"
                      v-model="item.name"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入药名"
                      @select="((item)=>{handleSelect(item, index)})"
                      :trigger-on-focus="false"
                    ></el-autocomplete>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="数量" :prop="'medicalList.' + index + '.number'" :rules="{
                      required: true, message: '药名不能为空', trigger: 'blur'
                    }">
                      <el-input type="number" v-model="item.number" v-on:input="((val)=>{handlerNumber(val, index)})">
                      </el-input>
                   </el-form-item>
                </el-col>
                <el-col :span="4">
                     <el-form-item label="单位" prop="unit">
                        <el-input v-model="item.unit" disabled auto-complete="off">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="金额" prop="amount">
                      <el-input v-model="item.amount"  disabled auto-complete="off">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="特殊用法" prop="entrust">
                    <el-input v-model="item.entrust"  auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="" prop="price">
                    <el-button @click="addMedical" type="primary">新增</el-button>
                    <el-button @click.prevent="removeMedical(item.id,index)">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShow = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" v-if="bzShow(medicalRecord.recordState)" @click.native="submitMedicalForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
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
          <el-dialog  title="医案详情"  width="90%" :visible.sync="isShowDetail" :close-on-click-modal="false">
            <el-tabs v-model="activeName" @tab-click="clickTab">
              <el-tab-pane label="健康档案" name="first">
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
                      <el-form-item label="关键字：" >
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
              <el-tab-pane label="进程记录" name="second">
                  <el-form label-width="110px" class="demo">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-form-item label="姓名：" >
                        <span>{{medicalRecord.userName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="用户电话：" >
                         <span>{{medicalRecord.userTel}}</span>
                      </el-form-item>

                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="状态：">
                        <span>{{medicalRecord.recordState|recordStateFormatter}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="创建时间：" >
                        <span>{{medicalRecord.createTime|timeStatus}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="审核时间：">
                        <span>{{medicalRecord.auditTime|timeStatus}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="审核人：">
                        <span>{{medicalRecord.auditName}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="是否初诊：">
                        <span v-if="medicalRecord.first=='0'">否</span>
                        <span v-if="medicalRecord.first=='1'">是</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="医生姓名：">
                        <span>{{medicalRecord.docName}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="助理姓名：" >
                        <span>{{medicalRecord.assistantName}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="是否付费：">
                        <span v-if="medicalRecord.feeStatus == '0'">免费</span>
                        <span v-if="medicalRecord.feeStatus == '1'">未付费</span>
                        <span v-if="medicalRecord.feeStatus == '2'">已付费</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="问诊费：">
                        <span>{{medicalRecord.feeAmount}}</span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="15">
                    <el-col :span="8">
                      <el-form-item label="转诊状态：" >
                        <el-radio-group v-model="medicalRecord.needChangeDoc">
                          <el-radio label="0">不需要</el-radio>
                          <el-radio label="1">需要</el-radio>
                           <el-radio label="2">已转诊</el-radio>
                            <el-radio label="3">取消转诊</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否转诊：">
                        <el-radio-group v-model="medicalRecord.changeDoc">
                          <el-radio label="0">否</el-radio>
                          <el-radio label="1">是</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="会诊时间">
                      <el-date-picker
                        v-model="medicalRecord.consultationTime"
                        type="date" value-format="timestamp"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                      <el-col :span="8">
                        <el-form-item label="处方类型：" >
                          <el-select v-model="medicalRecord.chufangType" placeholder="请选择处方类型" >
                            <el-option label="康复调理" value="1"></el-option>
                            <el-option label="一般处方" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药房类型：" >
                          <el-select v-model="medicalRecord.pharmacyType" placeholder="请选择药房" >
                            <el-option label="合作药房" value="1"></el-option>
                            <el-option label="个人药房" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="药房：" >
                          <el-select v-model="medicalRecord.pharmacy" placeholder="请选择药房" >
                            <el-option
                            v-for="item in pharmacyList"
                            :key="item.id"
                            :label="item.remark"
                            :value="item.id">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>


                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="中药种类：" >
                          <el-select v-model="medicalRecord.medicalType" placeholder="请选择中药种类" @change="handleChangeMedicalType1">
                            <el-option label="饮片" value="1" :disabled="isYP1"></el-option>
                            <el-option label="颗粒" value="2" :disabled="isKL1"></el-option>
                            <el-option label="中成药" value="3" :disabled="isZCY1"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                        <el-col :span="8">
                        <el-form-item label="加工方式：" v-if="isShowMadeType1" >
                          <el-select v-model="medicalRecord.madeType" placeholder="请选择加工方式" >
                            <el-option label="饮片" value="8"></el-option>
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
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          v-model="medicalRecord.extraMsg">
                        </el-input>
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
                        <el-input
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          v-model="medicalRecord.caseHistoryMsg">
                        </el-input>
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
                  <el-form-item label="">
                  <el-button size="mini" type="primary" v-if="bzShow(medicalRecord.recordState)" @click="baocun">保存</el-button>
								</el-form-item>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="问诊单" name="third">
                <InquirySheet :inquirySheet="inquirySheet" @isShowSheetMethod="isShowSheetMethod" ></InquirySheet>
              </el-tab-pane>
              <el-tab-pane label="电子处方" name="fourth">

                  <div  v-for="(item,index) in chufang" :key="index">
                    <el-form label-width="100px" class="demo" :model="item"  ref="prescribiing">
                  <h2 align="left">第{{index+1}}张处方</h2>

                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="处方类型：" prop="medicalType" :rules="{
      required: true, message: '处方类型必选', trigger: 'blur'
    }">
                          <el-select v-model="item.chufangType" placeholder="请选择处方类型" >
                            <el-option label="康复调理" value="1"></el-option>
                            <el-option label="一般处方" value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="药房：" prop="pharmacy" :rules="{
      required: true, message: '药房必选', trigger: 'blur'
    }">
                          <el-select v-model="item.pharmacy" placeholder="请选择药房" @change="handleChangePharmacylType($event,item)">
                            <el-option label="桐君堂" value="1"></el-option>
<!--                            <el-option label="康仁堂" value="2"></el-option>-->
                            <el-option label="天江药业" value="3"></el-option>
                          </el-select>
                        </el-form-item>

                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="中药种类：" prop="medicalType" :rules="{
      required: true, message: '中药种类必选', trigger: 'blur'
    }">
                          <el-select v-model="item.medicalType" placeholder="请选择中药种类" @change="handleChangeMedicalType($event,item)">
                            <el-option label="饮片" value="1" :disabled="item.isYP"></el-option>
                            <el-option label="颗粒" value="2" :disabled="item.isKL"></el-option>
<!--                            <el-option label="中成药" value="3" :disabled="item.isZCY"></el-option>-->
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">

                      <el-col :span="8">
                        <el-form-item label="加工方式：" v-if="item.isShowMadeType" prop="madeType" >
                          <el-select v-model="item.madeType" placeholder="请选择加工方式"  @change="handleChangeMadeType($event,item)">
                            <el-option label="饮片" value="8"></el-option>
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
                          <el-input-number style="width:100%" v-model="item.dosage" @change="handleChangeDosage($event,item)" :min="1"  label="描述文字">
                            <template slot="append">剂</template>
                          </el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="总重量：" >
                          <el-input :disabled="true" @change="handleChangeWeight" v-model="item.weight">
                            <template slot="append">克</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">

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
                       <el-col :span="8">
                        <el-form-item label="服务费比例：">
                          <el-input v-model="item.serviceFee">
                            <template slot="append">%</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="临床诊断：" >
                          <el-input v-model="item.clinical"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="15">
                      <el-col :span="16">
                        <el-form-item label="嘱托：" >
                          <el-input type="textarea" v-model="item.entrust"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-button @click="bc(item,index)" v-if="bzShow(medicalRecord.recordState)" type="primary" plain>保存</el-button>
                        <el-button @click="addChuFang" v-if="bzShow(medicalRecord.recordState)"  type="primary" plain>新增处方</el-button>
                        <el-button @click="deleteChuFang(item,index)" v-if="bzShow(medicalRecord.recordState)"  type="primary" plain>删除处方</el-button>


                        <el-button @click="add(item)" type="primary">查看药品</el-button>
                      </el-col>
                    </el-row>

                    <!-- <h2 align="left">药品信息</h2> -->
                        <!--工具栏-->
                      <!-- <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
                        <el-form :inline="true"  size="small">
                          <el-form-item>
                            <el-button @click="add" v-if="bzShow(medicalRecord.recordState)" type="primary">添加</el-button>
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
                          <el-table-column property="entrust" label="特殊用法">
                          </el-table-column>
                          <el-table-column property="createUser" label="添加人">
                          </el-table-column>
                          <el-table-column property="createTime" label="添加时间" :formatter="timeFormatter">
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope" v-if="bzShow(medicalRecord.recordState)">
                                  <el-button @click="deleteMedical(scope.row)" type="text" size="small">删除</el-button>
                                </template>
                          </el-table-column>
                      </el-table>

                        <div class="toolbar" style="padding:10px;">
                          <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalPageRequest"
                            :current-page="medicalPage.pageNum" :page-size="medicalPage.pageSize" :total="medicalPage.total" style="float:right;">
                          </el-pagination>
                        </div>  -->
                        </el-form>
                    </div>
                    <el-button @click="sendToYao(medicalRecord)" v-if="bzShow(medicalRecord.recordState)" type="primary" plain>发送给审核人</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-dialog>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!--转诊页面-->
          <el-dialog title="转诊" width="40%" :visible.sync="isChangeShow" :close-on-click-modal="false">
            <el-form :model="changeForm" :rules="changeRule" ref="changeForm" label-width="80px">
              <el-form-item  label="选择医生" prop="docId">
                <el-select v-model="changeForm.docId" placeholder="请选择" style="margin-left:-431px">
                  <el-option
                  v-for="item in docList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button size="small" @click.native="isChangeShow = false">{{$t('action.cancel')}}</el-button>
              <el-button size="small" type="primary" @click.native="submitChangeForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
          <el-dialog  title="新建医案"  width="80%" :visible.sync="isShowRecord" :close-on-click-modal="false">
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
                <el-form-item label="请选择性别" prop="userSex" style="margin-right:84%">
                    <el-radio v-model="recordForm.userSex" label="0">男</el-radio>
                    <el-radio v-model="recordForm.userSex" label="1">女</el-radio>
                </el-form-item>
                <el-form-item label="请输入年龄" prop="userAge">
                  <el-input v-model="recordForm.userAge"></el-input>
                </el-form-item>
               <el-form-item label="请选择医生" prop="docId">
                  <el-select v-model="recordForm.docId">
                  <el-option
                  v-for="item in docList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :size="size" @click.native="isShowRecord = false">{{$t('action.cancel')}}</el-button>
              <el-button :size="size" type="primary" @click.native="submitRecordlForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
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
          ],
          docId:[
             { required: true, message: '请选择医生', trigger: 'blur' }
          ]
        },
        chufang:[],
        isShowRecord:false,
        pharmacyList:[],
        isShowMadeType1:false,
        isYP:false,
        isKL:false,
        isZCY:false,
        isYP1:false,
        isKL1:false,
        isZCY1:false,
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
        isShowPic:false,
        isShowAddHistory:false,
        historyForm:{},
        changeForm:{
          recordsId:'',
          docId:''
        },
        docList:[],
        isChangeShow:false,
        activeName:"first",
        isShowDetail:false,
        isShowHealthRecord:false,
        states:[
			    {
            value: '1,2,3,4,5,6,7,8,9,91,10,11,12',
            label: '全部'
          },
          {
            value: '1',
            label: '新增'
          },
          {
            value: '2',
            label: '待医生处理'
          },
          {
            value:'3',
            label:'医生处理完成'
          },
          {
            value: '4',
            label: '已预约面诊'
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
          recordState:'1,2,3,4,5,6,7,8,9,91,10,11,12'
        },
        columnFilters:{
          employeeId:{
            name:'employeeId',
            value:JSON.parse(sessionStorage.getItem("employee")).id
          }
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
            { required: true, message: '请输入药名', trigger: 'blur' }
          ],
	  number:[
	  { required: true, message: '请输入数量', trigger: 'blur' }
	  ]
	  },
        changeRule:{
          docId: [
            { required: true, message: '请选择医生', trigger: 'blur' }
          ]
        },
        // 新增编辑界面数据
        medicalForm: {
          id: '',
          name: '',
          medicalRecordId: '',
          number: '',
          unit:'',
          amount:'',
          medicalList:[]
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
        medicalPage:{pageNum:1,pageSize:10},
        recordId:'',
        isShow:false,
        healthRecord:{},
        medicalRecord:{},
        uploadComplete: true, // 图片上传完成状态
        fileList:[],
        fileList1:[],
        fileList2:[],
        recordForm:{

        },
        dialogVisible2:false,
        dialogImageUrl: '',
        amount:'',
        weight:'',
        //电子处方
        prescribiing:{},
        //我的医生
        myDoctor:[],
        //
        restaurants:[],
        recordStatus:'',
        isShowMadeType:false,
        isShowHistory:false,
        historyList:[]
      }
    },
    methods: {
       deleteChuFang(item,index){
       if(this.chufang.length == 1){
         this.$message({message: '至少保留一项', type: 'error'})
         return
       }else{
         this.$confirm('确认删除吗？', '提示', {}).then(() => {
						if(item.id){
         this.$api.healthHouseKeeper.deletePrescribiing({id:item.id}).then((res) => {
              if(res.code == '200'){
                this.chufang.splice(index,1)
                this.$message({ message: '操作成功', type: 'success' })
              }else{
                this.$message({ message: res.msg, type: 'error' })
              }
            })
       }else{
         this.chufang.splice(index,1)
       }
					})
       }

     },
     clickTab(targetName){

        if("fourth"===targetName.paneName){
          if(this.chufang.length==0){
            this.chufang = [{
                  recordId:this.medicalRecord.recordId,
                  doctorId:this.medicalRecord.docId,
                  doctorName:this.medicalRecord.docName,
                  type:'1',
                  userId:this.healthRecord.userId,
                  pharmacy:'',
                  medicalType:'',
                  madeType:'',
                }]
          }
        }
      },
        telChange(val){
         this.$api.user.selectClientUserByTel({userTel:val}).then((res) => {
							if(res.code == 200 && "{}"!=JSON.stringify(res.rows)) {
               this.recordForm = res.rows
							} else {

							}

						})
      },
       // 编辑
      submitRecordlForm: function () {
        this.$refs.recordForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.$api.user.doctorAdd(this.recordForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShowRecord = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                 this.findMedicalRecord(null)
              })
            })
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
      detailHistory(row){
        this.isShowPic = true
        this.isShowAddHistory = true
        this.historyForm = Object.assign(this.historyForm,row)
      },
      //发送给审核人
      sendToYao(row){
         if(!this.prescribiing.id){
          this.$message({message: '请先保存基本信息 ', type: 'error'})
          return
        }
        this.$api.assistant.pushYs(row).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
      },
       closeDialog(){
        this.medicalForm.medicalList = [{
              id:'',
              name:'',
              number:'',
              unit:'',
              price:'',
              amount:'',
              entrust:''
            }]
      },
      removeMedical(id,index){
        if(this.medicalForm.medicalList.length==1){
          	this.$message({message: '至少保留一项', type: 'error'})
        }else{
          this.medicalForm.medicalList.splice(index,1)
        }
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
      addMedical(){
        console.log(this.medicalForm.medicalList)
        this.medicalForm.medicalList.push(
          {
              id:'',
              name:'',
              number:'',
              unit:'',
              price:'',
              amount:'',
              entrust:''
            }
        )
      },
       addMedicalRecord:function (row) {
        this.recordForm = {}
        this.isShowRecord = true
        this.selectDocList()
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
        this.isShowHistory = true

      },

       handleChangePharmacylType(val,item){
        item.medicalType = ''
        item.madeType = ''
        if(val == '1'){
          item.isYP = false
          item.isKL = true
          item.isZCY = true
        }else if(val == '2'||val == '3'){
          item.isYP = true
          item.isKL = false
          item.isZCY = true
        }
        this.zhongyi(val)

      },
      handleChangeMadeType(val,item){
        if(val){
          this.compute(item)
        }
      },
      handleChangeMedicalType(val,item){
        item.madeType = ''
        if(val == '1'){
          item.isShowMadeType = true
        }else if(val == '2'){
          item.isShowMadeType = false
          this.compute(item)
        }
      },
      handleChangeMedicalType1(val){
        this.medicalRecord.madeType = ''
        if(val == '1'){
          this.isShowMadeType1 = true
        }else if(val == '2'){
          this.isShowMadeType1 = false
        }
      },
      //计算加工费的方法
      compute(item){
        if(item.weight){
          if(item.medicalType == '2'){
              item.processCost = 0
            }else if(item.medicalType == '1'){
              if(item.madeType == '1'){
                if(Number(item.weight)>1000){
                  if((Number(item.weight)-1000)%100 != 0){
                    item.processCost = (parseInt((Number(item.weight)-1000)/100)+1)*10+125
                  }else{
                    item.processCost = parseInt((Number(item.weight)-1000)/100)*10+125
                  }
                }else{
                  item.processCost = 125
                }
              }else if(item.madeType == '2'){
                if(Number(item.weight)>1000){
                  if((Number(item.weight)-1000)%100 != 0){
                    item.processCost = (parseInt((Number(item.weight)-1000)/100)+1)*15+180
                  }else{
                    item.processCost = parseInt((Number(item.weight)-1000)/100)*15+180
                  }
                }else{
                  item.processCost = 180
                }
              }else if(item.madeType == '3'){
                if(Number(item.weight)>1000){
                  if((Number(item.weight)-1000)%100 != 0){
                    item.processCost = (parseInt((Number(item.weight)-1000)/100)+1)*10+100
                  }else{
                    item.processCost = parseInt((Number(item.weight)-1000)/100)*10+100
                  }
                }else{
                  item.processCost = 100
                }
              }else if(item.madeType == '4'){
                if(Number(item.weight)>1000){
                  if((Number(item.weight)-1000)%100 != 0){
                    item.processCost = (parseInt((Number(item.weight)-1000)/100)+1)*15+180
                  }else{
                    item.processCost = parseInt((Number(item.weight)-1000)/100)*15+180
                  }
                }else{
                  item.processCost = 180
                }
              }else if(item.madeType == '5'){
                if(Number(item.weight)>1000){
                  if(Number(item.weight)%1000 != 0){
                    item.processCost = (parseInt(Number(item.weight)/1000)+1)*10
                  }else{
                    item.processCost = parseInt(Number(item.weight)/1000)*10
                  }

                }else{
                  item.processCost = 10
                }
              }else if(item.madeType == '6'){
                if(Number(item.weight)>6000){
                  if((Number(item.weight)-6000)%500 != 0){
                    item.processCost = (parseInt((Number(item.weight)-6000)/500)+1)*25+300
                  }else{
                    item.processCost = parseInt((Number(item.weight)-6000)/500)*25+300
                  }
                }else{
                  item.processCost = 300
                }
              }else if(item.madeType == '7'){
                  item.processCost = Number(item.dosage)*2
              }else if(item.madeType == '8'){
                  item.processCost = 0
              }
            }
        }
      },
      handleChangeWeight(val){
        if(val){
          this.compute()
        }
      },
      handleChangeDosage(val,item){
        if(val){
          if(item.weight){
            item.weight = this.roundFun(Number(item.weightAvg)*Number(val),2)
            item.amount = this.roundFun(Number(item.amountAvg)*Number(val),2)
            this.compute(item)
          }
        }
      },
     handlerNumber(val,index){
       if(this.medicalForm.medicalList[index].price&&val){
         this.medicalForm.medicalList[index].amount = (Number.parseFloat(val)*Number.parseFloat(this.medicalForm.medicalList[index].price)).toFixed(2)
       }
     },
    roundFun(numberRound,roundDigit) { //四舍五入，保留位数为roundDigit
          if (numberRound>=0){
          var tempNumber = parseInt((numberRound * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
          return tempNumber;
          } else{
          numberRound1=-numberRound;
          var tempNumber = parseInt((numberRound1 * Math.pow(10,roundDigit)+0.5))/Math.pow(10,roundDigit);
          return -tempNumber;
          }
        },
      // 转诊提交
		submitChangeForm: function () {
			this.$refs.changeForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.$api.user.change(this.changeForm).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.isChangeShow = false
                this.$refs['changeForm'].resetFields()
                this.findMedicalRecord(null)
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}

						})
					})
				}
			})
		},
      //查询所有的医生
      selectDocList(){
        this.$api.user.selectDocListWeb().then((res) => {
          if(res.code == 200){
            this.docList = res.rows
          }
        })
      },
      //取消转诊
      unChange(row){
        this.$api.user.unChange({recordId:row.recordId}).then((res) => {
          if(res.code == 200){
            this.$message({ message: '操作成功', type: 'success' })
            this.findMedicalRecord(null)
          }
        })
      },
      //转诊
      change(row){
        this.selectDocList()
        this.changeForm.recordsId = row.recordId
        this.isChangeShow = true

      },
      addChuFang(){

        this.chufang.push({
            recordId:this.medicalRecord.recordId,
            doctorId:this.medicalRecord.docId,
            doctorName:this.medicalRecord.docName,
            type:'1',
            userId:this.healthRecord.userId,
            pharmacy:'',
            medicalType:'',
            madeType:'',

        })
      },
      bc(item,index){

        this.$refs["prescribiing"][index].validate((valid) => {
          if (valid) {
            //新增电子处方
            item.type = '1'
            this.$api.healthHouseKeeper.addPrescribing(item).then((res) => {
              if(res.code == '200'){
                if(res.rows){
                  item.id = res.rows
                }
                this.$message({ message: '操作成功', type: 'success' })
              }else{
                this.$message({ message: res.msg, type: 'error' })
              }
            })
          } else {
            return false;
          }
        });

      },
      //      验证只能输入正整数
      handleClick(){
        this.medicalForm.number=this.medicalForm.number.replace(/[^\d]/g,'');
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
      handleSelect(item,index) {
        this.medicalForm.medicalList[index].tcmId = item.id
        this.medicalForm.medicalList[index].unit = item.unit
        this.medicalForm.medicalList[index].price = item.price
    },
      isShowSheetMethod(value){
			this.isShowSheet = value
    },
    //加载中医库
    zhongyi(type){

      if(type == 3){
        type = 4
      }
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

      //点击会员id触发的事件
		xiangqing:function(index,row){
      this.recordStatus = row.recordState
      this.isShowDetail = true
       //查询电子处方
      this.$api.healthHouseKeeper.selectByRecordIdPrescribing({recordId:row.recordId}).then((res) => {
            if(res.code == '200'){
                this.chufang = res.rows
                for(var i = 0; i<this.chufang.length;i++){
                  if(this.chufang[i].medicalType == '1'){
                      this.chufang[i].isShowMadeType = true
                    }else if(this.chufang[i].medicalType == '2'){
                      this.chufang[i].isShowMadeType = false
                    }
                    if(this.chufang[i].pharmacy){
                      this.zhongyi(this.chufang[i].pharmacy)
                    }
                    //查看药方
                    if(this.chufang[i].id){
                      this.countAmonut(this.chufang[i])
                      //this.findMedicalPage(null)
                    }
                }
            }
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

            }),
			    //查询医疗记录
          this.$api.healthHouseKeeper.selectById({recordsId:row.recordId}).then((res) => {
            if(res.code == '200'){


              if(res.rows.pharmacyType == '1'){
                    this.pharmacyList = [
                        {
                          id:'1',
                          remark:'桐君堂'
                        },
                        {
                          id:'2',
                          remark:'康仁堂'
                        },
                        {
                          id:'3',
                          remark:'天江药业'
                        }
                      ]
                }else if(res.rows.pharmacyType == '2'){
                      let docId = res.rows.docId
                        this.$api.user.selectYaoFang({docId:docId}).then((res) => {
                        if(res.code == 200) {
                        this.pharmacyList = res.rows
                        console.log(this.pharmacyList)
                        } else {
                          this.$message({message: '个人药房查询失败, ' + res.msg, type: 'error'})
                        }

                      })
                }
                if(res.rows.medicalType == '1' ){
                  this.isShowMadeType1 = true
                }
            this.medicalRecord = res.rows


              if(res.rows.extraPic){
                  //回显补充信息图片操作
                let files=[]
                let idArray = (res.rows.extraPic+'').split(',')
                for(var i=0; i<idArray.length; i++) {
                  files.push({name: idArray[i], url: "http://baxitang.com/images/"+idArray[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList  =files
              }
              if(res.rows.docPic){
                  //回显电子处方图片操作
                let files1=[]
                let idArray1 = (res.rows.docPic+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files1.push({name: idArray1[i], url: "http://baxitang.com/images/"+idArray1[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList1  =files1
              }
              if(res.rows.caseHistoryDoc){
                  //回显病历图片操作
                let files2=[]
                let idArray1 = (res.rows.caseHistoryDoc+'').split(',')
                for(var i=0; i<idArray1.length; i++) {
                  files2.push({name: idArray1[i], url: "http://baxitang.com/images/"+idArray1[i]})
                }
                //  [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                this.fileList2  =files2
              }

            }
			     })
          })



			//查询问诊单
			 this.$api.healthHouseKeeper.selectInquirySheetById({id:row.surveyId}).then((res) => {
            if(res.code == '200'){
              this.inquirySheet = res.rows
            }
          })
          // //查询我的医生
          // this.$api.healthHouseKeeper.selectMyDoctor().then((res) => {
          //   if(res.code == '200'){
          //     this.myDoctor = res.rows
          //   }
          // })


        this.recordId = row.recordId



		},
		reject(row){
		this.$alert(row.reject, '审核不通过原因', {
		confirmButtonText: '确定'
		});
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
      bzShow(status){
        if(Number.parseInt(status)<6){
          return true;
        }else{
          return false;
        }
      },
      changeRow(row, expandedRows){
        this.row = row;
      },
      baocun(){
        this.$confirm('确认保存吗？', '提示', {}).then(() => {
              this.$api.assistant.update(this.medicalRecord).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalRecord(null)
              })
            })

      },
      uploadUrl(){
        // return baseUrl+"/system/upload";
        return "http://baxitang.com/sh/system/upload";
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
                this.countAmonut(this.prescribiing.id)
              })
            })
      },
  add(item){
        this.prescribiing = item
        if(!item.id){
          this.$message({message: '请先保存基本信息 ', type: 'error'})
          return
        }
         this.$api.assistant.selectMedicalAll({recordId:item.id}).then((res) => {
           if(res.rows.length>0){
             this.medicalForm.medicalList = res.rows
           }else if(res.rows.length==0 && this.medicalForm.medicalList.length == 0){
              this.medicalForm.medicalList.push({
                id:'',
                name:'',
                number:'',
                unit:'',
                price:'',
                amount:'',
                entrust:''
             })
           }
 	      })
			  this.isShow = true
		  },

      //查看药方
      yaofang:function (value) {
        this.recordId = value
        this.findMedicalPage(null)
        this.showYaoFang = true
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
        this.medicalRecordPage.columnFilters = this.columnFilters
        this.medicalRecordPage.columnFilters.userName = {name:'userName', value:this.filters.userName}
        this.medicalRecordPage.columnFilters.recordState = {name:'recordState',value:this.filters.recordState}

        this.$api.healthHouseKeeper.selectByContion(this.medicalRecordPage).then((res) => {
          if(res.code == '200'){
            this.medicalRecordPage = res
          }
        })
      },

      // 获取药方分页数据
      findMedicalPage: function (data) {
        if(data){
          this.medicalPage = data
        }
        this.medicalPage.columnFilters = {recordId:{name:'recordId',value:this.prescribiing.id}}
        this.$api.assistant.selectMedical(this.medicalPage).then((res) => {
          this.medicalPage = res
        })
      },
      countAmonut:function(item){
         this.$api.assistant.countAmonut({prescribingId:item.id}).then((res) => {
          item.amountAvg = res.rows.amount
          item.weightAvg = res.rows.weight
          item.medicalType = res.rows.medicalType
          item.madeType = res.rows.madeType
          item.dosage = res.rows.dosage
          item.amount = res.rows.amountTotal
          item.weight = res.rows.weightTotal
          item.processCost = res.rows.processCost
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
        for(let a of this.medicalForm.medicalList){
          a.medicalRecordId = this.prescribiing.id
        }
        this.$refs.medicalForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.$api.assistant.add(this.medicalForm.medicalList).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.isShow = false
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.findMedicalPage(null)
                this.countAmonut(this.prescribiing)
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
    auditTimeFormatter:function(row) {
      if(row.auditTime){
        return timestampToTime(row.createTime)
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
				case '91':
			          return "已下单";
				case '10':
					return "已发货";
				case '11':
          				return "已完成";
        			case '12':
					return "已取消";
			}
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
        this.medicalRecord.extraPic = temp_str;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
      },
      // 上传图片前调用方法
      beforeUploadPicture1(file) {
        if(file.size > 10*1024*1024){
          this.$message.error("上传图片不能大于10M");
          return false;
        }
      },
      // 上传图片时调用
      uploadProgress1(event,file, fileList){
        this.uploadComplete = false;
      },
      // 上传图片成功
      uploadSuccess1(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange1(fileList);
      },
      // 上传图片出错
      uploadError1(err, file, fileList) {
        this.$message.error("上传出错");
      },
      // 移除图片
      handleRemove1(file, fileList) {
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
            }
          }
        }
        this.medicalRecord.docPic = temp_str;
      },
      handlePictureCardPreview1(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
      },
      // 上传图片前调用方法
      beforeUploadPicture2(file) {
        if(file.size > 10*1024*1024){
          this.$message.error("上传图片不能大于10M");
          return false;
        }
      },
      // 上传图片时调用
      uploadProgress2(event,file, fileList){
        this.uploadComplete = false;
      },
      // 上传图片成功
      uploadSuccess2(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange2(fileList);
      },
      // 上传图片出错
      uploadError2(err, file, fileList) {
        this.$message.error("上传出错");
      },
      // 移除图片
      handleRemove2(file, fileList) {
        this.fileChange2(fileList);
      },
      // 设置photo值
      fileChange2(fileList) {
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
        this.medicalRecord.caseHistoryDoc = temp_str;
      },
      handlePictureCardPreview2(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible2 = true;
      },
      //判断是否是转诊
        changeDocFormatter:function(row){
          switch (row.changeDoc){
            case '1':
              return "是";
            break;
            case '0':
              return '否';
            break;

          }
        },
        //判断是否需要转诊
        isChangeFormatter:function(row){
          switch (row.needChangeDoc){
            case '1':
              return "需要";
            break;
            case '0':
              return '不需要';
            break;
            case '2':
              return '已转诊';
            break;
            case '3':
              return '取消转诊';
            break;

          }
        },

        //判断是否是初诊
        firstFormatter:function(row){
          switch (row.first){
            case '1':
              return "是";
            break;
            case '0':
              return '否';
            break;
          }
        },

    },
    mounted() {
      this.findMedicalRecord(null)
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
        },
        //判断是否是转诊
        changeDocFormatter:function(value){
          switch (value){
            case '1':
              return "是";
            break;
            case '0':
              return '否';
            break;
          }
        },

        //判断是否是初诊
        firstFormatter:function(value){
          switch (value){
            case '1':
              return "是";
            break;
            case '0':
              return '否';
            break;
          }
        },
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
