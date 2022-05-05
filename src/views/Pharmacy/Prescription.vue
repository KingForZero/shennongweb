<template>
  <div class="page-container">
    <el-tabs v-model="activeName" >
				<el-tab-pane label="医疗记录药方" name="first">
          <!--工具栏-->
          <div class="toolbar" style="float:left;">
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
                <el-date-picker
                value-format="timestamp"
                  v-model="filters.startTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                value-format="timestamp"
                  v-model="filters.endTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findMedicalRecord(null)"/>
              </el-form-item>
              <!--<el-form-item label="总药费：">-->
                <!--<span>{{drugTotal}}</span>元-->
              <!--</el-form-item>-->
              <!--<el-form-item label="总加工费：">-->
                <!--<span>{{processTotal}}</span>元-->
              <!--</el-form-item>-->
              <!--<el-form-item label="总邮费：">-->
                <!--<span>{{postageTotal}}</span>元-->
              <!--</el-form-item>-->
            </el-form>
          </div>
          <!--表格内容栏-->
          <el-table :data="medicalRecordPage.rows" style="width: 100%" >
            <el-table-column type="index" label="序号"></el-table-column>
						<!-- <el-table-column label="ID" prop="recordId"></el-table-column> -->
						<el-table-column label="患者姓名" prop="userName" ></el-table-column>
            <el-table-column label="患者电话" prop="userTel" ></el-table-column>
            <el-table-column label="药费" prop="drugAmount" ></el-table-column>
            <el-table-column label="邮寄姓名" prop="emailName" ></el-table-column>
            <el-table-column label="邮寄电话" prop="emailTel" ></el-table-column>
            <el-table-column label="邮寄地址" prop="emailAddress"  show-overflow-tooltip></el-table-column>
            <!--<el-table-column label="剂型" prop="dosageType"  :formatter="dosageTypeFormatter"></el-table-column>-->
						<!-- <el-table-column label="快递单号" prop="orderId"></el-table-column> -->
            <!--<el-table-column label="处方编号" prop="recordId"></el-table-column>-->
						<el-table-column label="运单号" prop="mailNo"></el-table-column>
						<el-table-column label="状态" prop="recordState" :formatter="recordStateFormatter"></el-table-column>
            <el-table-column label="发货时间" prop="sendTime"  :formatter="timeFormatter1"></el-table-column>
			      <!-- <el-table-column label="审核人" prop="auditName" width="80px"></el-table-column> -->
            <el-table-column label="操作">
            <template slot-scope="scope">
				          <el-button  @click="yaofang(scope.row)" type="text" size="small">查看药方</el-button>
                  <!--<el-button v-if="scope.row.recordState == '9' && scope.row.pharmacyType == '1'" @click="xiadan(scope.row,1)" type="text" size="small">下单</el-button>-->
                  <el-button v-if="scope.row.recordState == '9' && scope.row.pharmacyType == '1'" @click="order(scope.row,1)" type="text" size="small">下单</el-button>
                  <el-button v-if="scope.row.recordState == '9' && scope.row.pharmacyType == '1'" @click="bohui(scope.row)" type="text" size="small">驳回</el-button>
                  <a v-if="scope.row.recordState == '91' && scope.row.pharmacyType == '1'" class='download' :href=printUrl(scope.row,1) download=""  title="下载">打印运单</a>
                  <el-button v-if="scope.row.recordState == '91'" @click="fahuo(scope.row,1)" type="text" size="small">已发货</el-button>
                  <el-button v-if="scope.row.recordState == '9' && scope.row.pharmacyType == '2'" @click="fahuo(scope.row,1)" type="text" size="small">已发货</el-button>
                  <el-button v-if="scope.row.recordState == '91' && scope.row.pharmacyType == '1' " @click="quxiao(scope.row,1)" type="text" size="small">取消订单</el-button>
                  <el-button v-if="scope.row.recordState == '10'  && scope.row.pharmacyType == '1'" @click="wuliu(scope.row,1)" type="text" size="small">查看物流信息</el-button>
                  <el-button v-if="scope.row.recordState == '7'" @click="huajia(scope.row,1)" type="text" size="small">划价</el-button>
              </template>
            </el-table-column>
					</el-table>
					<!--分页栏-->
					<div class="toolbar" style="padding:10px;">
					<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshMedicalRecord"
						:current-page="medicalRecordPage.pageNum" :page-size="medicalRecordPage.pageSize" :total="medicalRecordPage.total" style="float:right;">
					</el-pagination>
					</div>
        </el-tab-pane>
        <!--<el-tab-pane label="健康管理师药方" name="second">-->
          <!--<div class="toolbar" style="float:left;">-->
            <!--<el-form :inline="true" :model="filtersHealth" :size="size">-->
              <!--<el-form-item>-->
                <!--<el-input v-model="filtersHealth.userName" placeholder="姓名"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<el-select v-model="filtersHealth.state" placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in statesHealth"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<el-date-picker-->
                <!--value-format="timestamp"-->
                  <!--v-model="filtersHealth.startTime"-->
                  <!--type="date"-->
                  <!--placeholder="选择日期">-->
                <!--</el-date-picker>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<el-date-picker-->
                <!--value-format="timestamp"-->
                  <!--v-model="filtersHealth.endTime"-->
                  <!--type="date"-->
                  <!--placeholder="选择日期">-->
                <!--</el-date-picker>-->
              <!--</el-form-item>-->
              <!--<el-form-item>-->
                <!--<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findChufang()"/>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="总药费：">-->
                <!--<span>{{drugTotal1}}</span>元-->
              <!--</el-form-item>-->
              <!--<el-form-item label="总加工费：">-->
                <!--<span>{{processTotal1}}</span>元-->
              <!--</el-form-item>-->
              <!--<el-form-item label="总邮费：">-->
                <!--<span>{{postageTotal1}}</span>元-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          <!--</div>-->
          <!--&lt;!&ndash;表格内容栏&ndash;&gt;-->
          <!--<el-table :data="chufangPage.rows" style="width: 100%" >-->
            <!--<el-table-column type="index" label="序号"></el-table-column>-->
						<!--&lt;!&ndash;<el-table-column label="ID" prop="id"></el-table-column>&ndash;&gt;-->
						<!--<el-table-column label="患者姓名" prop="userName" width="80px"></el-table-column>-->
            <!--<el-table-column label="患者电话" prop="userTel" width="120px"></el-table-column>-->
            <!--<el-table-column label="药费" prop="amount" width="80px"></el-table-column>-->
						<!--<el-table-column label="邮寄地址" prop="emsAddress" ></el-table-column>-->
						<!--<el-table-column label="快递单号" prop="orderId" ></el-table-column>-->
						<!--<el-table-column label="运单号" prop="mailNo" ></el-table-column>-->
						<!--<el-table-column label="状态" prop="state" :formatter="stateFormatter">-->
						<!--</el-table-column>-->
			      <!--<el-table-column label="发货时间" prop="sendTime" :formatter="timeFormatter1"></el-table-column>-->
            <!--<el-table-column label="操作">-->
            <!--<template slot-scope="scope">-->
				          <!--<el-button  @click="yaofang1(scope.row.id)" type="text" size="small">查看药方</el-button>-->
                  <!--<el-button v-if="scope.row.state == '4'" @click="xiadan(scope.row,2)" type="text" size="small">下单</el-button>-->
                  <!--<a v-if="scope.row.state == '41'" class='download' :href=printUrl(scope.row,2) download=""  title="下载">打印运单</a>-->
                  <!--<el-button v-if="scope.row.state == '41'" @click="fahuo(scope.row,2)" type="text" size="small">已发货</el-button>-->
                  <!--<el-button v-if="scope.row.state == '41'" @click="quxiao(scope.row,2)" type="text" size="small">取消订单</el-button>-->
                  <!--<el-button v-if="scope.row.state == '5'" @click="wuliu(scope.row,2)" type="text" size="small">查看物流信息</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->
					<!--</el-table>-->
					<!--&lt;!&ndash;分页栏&ndash;&gt;-->
					<!--<div class="toolbar" style="padding:10px;">-->
					<!--<el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshChufang"-->
						<!--:current-page="chufangPage.pageNum" :page-size="chufangPage.pageSize" :total="chufangPage.total" style="float:right;">-->
					<!--</el-pagination>-->
					<!--</div>-->
        <!--</el-tab-pane>-->
    </el-tabs>


    <!--药方列表-->
    <el-dialog  title="电子处方"  width="80%" :visible.sync="showYaoFang" :close-on-click-modal="false">
            <div  v-for="(item,index) in chufang" :key="index">


            <el-form label-width="90px" class="demo" v-if="item.pharmacy!='5' && item.pharmacy!='6'">
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
                        <el-form-item label="" >
                           <!-- <el-button type="primary" @click="getPdf">生出电子处方</el-button> -->
                           <el-button @click="chakan(item)" type="primary" plain>查看药品</el-button>
                           <a class='download' :href='downUrl(item,item.type)' download=""  title="下载">打印</a>
                           <!-- <a href="http://localhost:8080/system/prescribing/download" download="电子处方">下载</a> -->
                        </el-form-item>
                      </el-col>
                    </el-row>



                  </el-form>
              <el-form label-width="90px" class="demo" v-else>
                <h2 align="left">第{{index+1}}张处方</h2>

                <el-row :gutter="15">
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
                      <a class='download' :href='downUrl(item,item.type)' download=""  title="下载">打印</a>
                      <!-- <a href="http://localhost:8080/system/prescribing/download" download="电子处方">下载</a> -->
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
        <el-dialog  title="进程记录"  width="60%" :visible.sync="isShowMedicalRecord" :close-on-click-modal="false">
            <el-form label-width="110px" class="demo">
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
        </el-dialog>
         <!--物流信息-->
          <el-dialog  title="物流信息"  width="60%" :visible.sync="isShowWuliu" :close-on-click-modal="false">
            <el-tabs>
              <el-tab-pane v-for="(value, key) in wuliuList" :label="key" :key="key">
                <div class="block">
                  <el-timeline>
                    <el-timeline-item :timestamp="item.ftime" placement="top" v-for="item in value" :key="item.ftime">
                      <el-card>
                        <p>时间：{{item.ftime}}</p>
                        <p>描述：{{item.context}}</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
            </el-tabs>


            <div slot="footer" class="dialog-footer">
              <el-button :size="size" type="primary" @click.native="isShowWuliu = false">确定</el-button>
            </div>
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
              <el-button :size="size" type="primary" @click.native="submitBohui">{{$t('action.submit')}}</el-button>
            </div>
          </el-dialog>
          <!--划价-->
        <el-dialog  title="划价"  width="60%" :visible.sync="isShowHuajia" :close-on-click-modal="false">
          <el-form :model="huajiaForm" label-width="80px" ref="huajiaForm" :size="size" label-position="right">

            <el-form-item label="药费：" >
              <el-input type="text" v-model="huajiaForm.price"  auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button :size="size" @click.native="isShowHuajia = false">{{$t('action.cancel')}}</el-button>
            <el-button :size="size" type="primary" @click.native="submitHuajia">{{$t('action.submit')}}</el-button>
          </div>
        </el-dialog>
    <!--发货-->
    <el-dialog  title="发货"  width="30%" :visible.sync="isShowOrder" :close-on-click-modal="false" :before-close="close">
      <el-form :model="orderForm" label-width="100px" ref="orderForm" :size="size" label-position="right">
        <div v-for="(order,index) in orderForm.ems" :key="order.key">
          <el-form-item label="快递公司：" :prop="'ems.' + index + '.type'" :rules="{
          required: true, message: '快递公司不能为空', trigger: 'blur'
        }">
            <el-select v-model="order.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号：" :prop="'ems.' + index + '.mailNo'" :rules="{
          required: true, message: '运单号不能为空', trigger: 'blur'
        }">
            <el-input  v-model="order.mailNo" ></el-input>
          </el-form-item>
        </div>
        <div style="text-align: center">
          <el-button @click="delEms">删除</el-button>
          <el-button @click="addEms">增加</el-button>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="isShowOrder = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitOrder">{{$t('action.submit')}}</el-button>
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
        isShowMedicalRecord:false,
        drugTotal:'',
        processTotal:'',
        postageTotal:'',
        drugTotal1:'',
        processTotal1:'',
        postageTotal1:'',
        chufangPage:{
          pageNum:1,
          pageSize:10,

        },
        isShowOrder:false,
         columnFilters1:{

          },
        htmlTitle:'电子处方',
        activeName:"first",
        fahuoForm:{
          recordId:'',
          id:'',
          type:'',
          number:''
        },
        huajiaForm:{
          recordId:'',
          id:'',
          type:'',
          price:''
        },
        orderForm:{
          recordId:'',
          ems:[{
            type:'',
            mailNo:'',
            key:Date.now()
          }]
        },
        bohuiForm:{
          	recordId:'',
            type:'',
            msg:''
        },
        statesHealth:[
            {
            value: '2,3,4,41,5',
            label: '全部'
          },
          {
            value: '3',
            label: '待付费'
          },
          {
            value: '4',
            label: '待下单'
          },
          {
            value: '41',
            label: '已下单'
          },
          {
            value:'5',
            label:'已发货'
          }
        ],
        states:[
			    {
            value: '7,8,9,91,10,11',
            label: '全部'
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
          }
        ],
        isShowWuliu:false,
        isShowSheet:false,
        row:{},
        showYaoFang:false,
        inquirySheet:{},
        size: 'small',
        medicalRecordPage:{pageNum:1,pageSize:10},
        filters: {
          userName: '',
          recordState:'7,8,9,91,10,11'
        },
        filtersHealth:{
          userName:'',
          state:'2,3,4,41,5'
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
        // 新增编辑界面数据
        medicalForm: {
          id: '',
          name: '',
          medicalRecordId: '',
          number: '',
          unit:'',
          amount:''
        },
        wuliuList:[],
        deptData: [],
        roles: [],
        departMentOneList:[],
        departMentTwoList:[],
        config: {
          //可以在此处定义工具栏的内容
          // toolbars: [
          //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
          //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
          //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify'
          //   ]
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
        isShow:false,
        isShowHuajia:false,
        isShowBohui:false,
        prescribiing:{},
        fileList1:[],
        isShowYaoping:false,
        chufang:[],
        options: [{
          value: 'yuantong',
          label: '圆通速递'
        }, {
          value: 'shunfeng',
          label: '顺丰速运'
        }, {
          value: 'yunda',
          label: '韵达快递'
        }, {
          value: 'zhongtong',
          label: '中通快递'
        }, {
          value: 'huitongkuaidi',
          label: '百世快递'
        }, {
          value: 'shentong',
          label: '申通快递'
        }, {
          value: 'jd',
          label: '京东物流'
        }, {
          value: 'ems',
          label: 'EMS'
        }, {
          value: 'tiantian',
          label: '天天快递'
        }],

      }
    },
    methods: {
      close(done){
        this.orderForm.ems=[{type:'',mailNo:'',key:Date.now()}]
        this.$refs['orderForm'].resetFields();
        done()
      },
      delEms(){
        var length = this.orderForm.ems.length
        if (length > 1) {
          this.orderForm.ems.splice(length-1, 1)
        }
      },
      addEms(){
        this.orderForm.ems.push({type:'',mailNo:'',key:Date.now()})
      },
      chakan(item){
        this.prescribiing = item
        this.findMedicalPage(null)
        this.isShowYaoping = true
      },
      printUrl(row,type){
        let a
        if(type == '1'){
          a = row.recordId
        }else if(type == '2'){
          a = row.id
        }
        return 'http://baxitang.com/sh/bussiness/medicalRecords/print?recordId='+a+'&type='+type
        //return 'http://localhost:8080/bussiness/medicalRecords/print?recordId='+a+'&type='+type
      },
      downUrl(data,type){
          return 'http://baxitang.com/sh/system/prescribing/download?recordId='+data.id+'&type='+type
          //return 'http://localhost:8080/system/prescribing/download?recordId='+data.id+'&type='+type
      },
		submitFahuoForm(){
				this.$api.assistant.send(this.fahuoForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.isShow = false
                this.findMedicalRecord(null)
                this.findChufang(null)
              })
    },
      submitOrder(){
        this.$refs['orderForm'].validate((valid) => {
          if (valid) {
            this.$api.assistant.order(this.orderForm).then((res) => {
              if(res.code == 200) {
                this.$message({ message: '操作成功', type: 'success' })
              } else {
                this.$message({message: '操作失败, ' + res.msg, type: 'error'})
              }
              this.isShowOrder = false
              this.findMedicalRecord(null)
              this.findChufang(null)
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

    },
    submitHuajia(){
				this.$api.assistant.pricing(this.huajiaForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.isShowHuajia = false
                this.findMedicalRecord(null)
                this.findChufang(null)
              })
    },
    submitBohui(){
      this.bohuiForm.type = '0'
				this.$api.assistant.audit(this.bohuiForm).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.isShowBohui = false
                this.findMedicalRecord(null)
              })
    },
    wuliu(row,type){
       let a
      if(type == '1'){
        a = row.recordId
      }else if(type == '2'){
        a = row.id
      }
      this.isShowWuliu = true
      this.$api.assistant.wuliu({"recordId":a,type:type}).then((res) => {
        if(res.code == 200) {
          this.wuliuList = res.rows
        } else {
          this.$message({message: '操作失败, ' + res.msg, type: 'error'})
        }
      })
    },
    order(row,type){
        this.isShowOrder = true
        this.orderForm.recordId = row.recordId
    },
    xiadan(row,type){
      let a
      if(type == '1'){
        a = row.recordId
      }else if(type == '2'){
        a = row.id
      }
       this.$confirm('确认下单吗？', '提示', {}).then(() => {
              this.$api.assistant.xiadan({recordId:a,type:type}).then((res) => {

                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                if(type == '1'){
                  this.findMedicalRecord(null)
                }else if(type == '2'){
                  this.findChufang()
                }
              })
            })
    },
    quxiao(row,type){
      let a
      if(type == '1'){
        a = row.recordId
      }else if(type == '2'){
        a = row.id
      }
       this.$confirm('确认取消吗？', '提示', {}).then(() => {
              this.$api.assistant.quxiao({recordId:a,type:type}).then((res) => {
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                if(type == '1'){
                  this.findMedicalRecord(null)
                }else if(type == '2'){
                  this.findChufang()
                }
              })
            })
    },
		fahuo(row,type){

      let a
      if(type == '1'){
        a = row.recordId
      }else if(type == '2'){
        a = row.id
      }
        this.$confirm('确认发货吗？', '提示', {}).then(() => {
              this.$api.assistant.send({recordId:a,type:type}).then((res) => {

                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                if(type == '1'){
                  this.findMedicalRecord(null)
                }else if(type == '2'){
                  this.findChufang()
                }
              })
            })

    },
    	huajia(row,value){
        if(value==2){
          this.huajiaForm.id = row.id
          this.huajiaForm.type = '1'
        }else{
          this.huajiaForm.recordId = row.recordId
        }

				this.isShowHuajia = true
    },
    	bohui(row,value){
			  this.bohuiForm.recordId = row.recordId
				this.isShowBohui = true
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
        return "http://baxitang.com/sh/system/upload"
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

       //保健品查看药方
      yaofang1:function (value) {
         //查询电子处方
        this.$api.healthHouseKeeper.selectPrescribing({id:value}).then((res) => {
            if(res.code == '200'){
              this.prescribiing = res.rows
              this.prescribiing.type = '1'
              this.findMedicalPage(null)
              this.showYaoFang = true
            }
          })
        this.recordId = value
        this.findMedicalPage(null)
        this.showYaoFang = true
      },
      //查看药方
      yaofang:function (row) {
        console.log("sss:"+row.pharmacyType)
        if(row.pharmacyType == '1'){
          //如果是合作药房则查询电子处方
        this.$api.healthHouseKeeper.selectByRecordIdPrescribing({recordId:row.recordId}).then((res) => {
              if(res.code == '200'){
                this.chufang = res.rows
                //this.prescribiing.type = '0'
                this.showYaoFang = true
              }
            })
          this.recordId = row.recordId
        }else if(row.pharmacyType == '2'){
          this.isShowMedicalRecord = true
          //如果是个人药房则查询医疗记录详情
          this.$api.healthHouseKeeper.selectById({recordsId:row.recordId}).then((res) => {
            if(res.code == '200'){

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
            }
			     })
        }


      },
      //获取文档内容
      getContent: function(){
        let content = this.$refs.ueditor.getUEContent();
        console.log(content);
        alert(content);
      },
      //获取保健品分页数据
      findChufang:function(data){
        if(data){

        }else{
          data = this.chufangPage
        }
        this.columnFilters1.userName = {name:'userName',value:this.filtersHealth.userName}
        this.columnFilters1.startTime = {name:'startTime',value:this.filtersHealth.startTime}
        this.columnFilters1.endTime = {name:'endTime',value:this.filtersHealth.endTime}
        this.columnFilters1.state = {name:'state',value:this.filtersHealth.state}
        this.columnFilters1.type = {name:'type',value:'2'}
        this.chufangPage.columnFilters = this.columnFilters1
        this.$api.healthHouseKeeper.selectChufang(this.chufangPage).then((res) => {
          if(res.code == '200'){
            this.chufangPage = res
            this.chufangPage.columnFilters = this.columnFilters1
          }
        })
        this.$api.healthHouseKeeper.selectTotal(this.chufangPage).then((res) => {
          if(res.code == '200'){
            this.drugTotal1 = res.rows.drugTotal
            this.processTotal1 = res.rows.processTotal
            this.postageTotal1 = res.rows.postageTotal
          }
        })
      },
      //保健品分页刷新
      refreshChufang:function(pageNum){
        this.chufangPage.pageNum  = pageNum
        this.findChufang(this.chufangPage)
      },
      // 获取会员医疗记录分页数据
      findMedicalRecord: function (data) {
        if(data){
          this.medicalRecordPage = data
        }
        this.columnFilters.userName = {name:'userName',value:this.filters.userName}
        this.columnFilters.startTime = {name:'startTime',value:this.filters.startTime}
        this.columnFilters.endTime = {name:'endTime',value:this.filters.endTime}
        this.columnFilters.type = {name:'type',value:'1'}
        this.columnFilters.recordState = {name:'recordState',value:this.filters.recordState}
        this.columnFilters.employeeId = {
            name:'employeeId',
            value:JSON.parse(sessionStorage.getItem("employee")).id
          }
        this.medicalRecordPage.columnFilters = this.columnFilters
        this.$api.healthHouseKeeper.selectByYaoFang(this.medicalRecordPage).then((res) => {
          if(res.code == '200'){
            this.medicalRecordPage = res
          }
        })
         this.$api.healthHouseKeeper.selectTotal(this.medicalRecordPage).then((res) => {
          if(res.code == '200'){
            this.drugTotal = res.rows.drugTotal
            this.processTotal = res.rows.processTotal
            this.postageTotal = res.rows.postageTotal
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
          return "待下单";
        case '41':
					return "已下单";
				case '5':
					return "已完成";
			}
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

    timeFormatter1:function(row) {
      if(row.sendTime){
        return timestampToTime(row.sendTime)
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
    	//剂型格式化
		dosageTypeFormatter:function(row){
			switch (row.dosageType){
				case '1':
          return "大蜜丸";
        case '2':
          return "浓缩丸";
        case '3':
          return "水丸";
        case '4':
          return "水蜜丸";
        case '5':
          return "打粉";
        case '6':
          return "膏方";
        case '7':
          return "汤剂";
        case '8':
          return "饮片";
        case '9':
          return "颗粒";

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
      this.findChufang(null)
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
