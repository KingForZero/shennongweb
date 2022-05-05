<template>
  <!-- <el-button :size="size" :type="type" :icon="icon"
    :loading="loading" :disabled="!hasPerms(perms)" @click="handleClick">
    {{label}}
  </el-button> -->

  <div>
    <el-form label-width="170px" class="demo">
						<h2 align="left">基本信息</h2>
						<el-row :gutter="10">
							<el-col :span="8">
								<el-form-item label="问诊时间：" >
									<span>{{inquirySheet.inquiryDate|timeStatus}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="姓名：">
									<span>{{inquirySheet.name}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="年龄：">
									<span>{{inquirySheet.age}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="性别：" >
									<el-radio-group v-model="inquirySheet.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="出生日期：">
									<span>{{inquirySheet.birthDate|dateStatus}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="婚否：">
									<el-radio-group v-model="inquirySheet.isMarry">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="家庭地址：" >
									<span>{{inquirySheet.address}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="身高：">
									<span>{{inquirySheet.height}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="体重：">
									<span>{{inquirySheet.weight}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="血压：">
									<span>{{inquirySheet.blood}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="血糖：">
									<span>{{inquirySheet.bloodSugar}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="脉搏：" >
									<span>{{inquirySheet.sphygmus}}</span>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row :gutter="15">
							<el-col :span="8">
								<el-form-item label="中医体质：" >
									<span>{{inquirySheet.physique}}</span>
								</el-form-item>
							</el-col>
						</el-row>
            <h2 align="left">主诉</h2>
						<el-row :gutter="15">
              <el-col>
								<el-form-item label="明显症状：">
									<span>{{inquirySheet.obviousSymptom}}</span>
								</el-form-item>
							</el-col>
            </el-row>

            <el-row>
              <el-col>
								<el-form-item label="伴随症状：">
									<span>{{inquirySheet.accompanySymptom}}</span>
								</el-form-item>
							</el-col>
            </el-row>
            <el-row>
              <el-col>
								<el-form-item label="病程：">
                  <span>{{inquirySheet.morbidityDate}}</span>
								</el-form-item>
							</el-col>
            </el-row>

						<h2 align="left">基础问诊</h2>
						<el-row>
							<el-col>
								<el-row>1、你觉得自己容易疲劳吗？</el-row>
								<el-row>
									<el-form-item label="">
										<el-radio-group v-model="inquirySheet.isTired">
											<el-radio label="0">否</el-radio>
											<el-radio label="1">是</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-row>
							</el-col>
            </el-row>
            <el-row>
							<el-col>
								<div>2、你平时容易怕冷、怕热、手足心热吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.feelHow">
                    <el-radio label="1">怕冷(或者手足冰凉)</el-radio>
                    <el-radio label="2">怕热</el-radio>
                    <el-radio label="3">手足心热</el-radio>
                    <el-radio label="4">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
              </el-row>
              <el-row>
							<el-col>
								<div>3、你平时容易出汗或者晚上睡觉容易出汗吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.sweat">
                    <el-radio label="1">活动出汗</el-radio>
                    <el-radio label="2">夜间出汗</el-radio>
                    <el-radio label="3">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
							<el-col>
								<div>4、出汗颜色</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.sweatColor">
                    <el-radio label="1">黄色</el-radio>
                    <el-radio label="2">黑色</el-radio>
                    <el-radio label="3">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
							<el-col>
								<div>5、平时小便情况怎么样</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.peeSituation">
                    <el-radio label="1">偏黄</el-radio>
                    <el-radio label="2">清长（色清 量多）</el-radio>
                    <el-radio label="3">夜尿频多</el-radio>
                    <el-radio label="4">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>6、平时大便情况怎么样？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.shitSituation">
                    <el-radio label="1">偏干</el-radio>
                    <el-radio label="2">偏黏</el-radio>
                    <el-radio label="3">偏稀</el-radio>
                    <el-radio label="4">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>7、平时胃口怎样？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.eat">
                    <el-radio label="1">不好</el-radio>
                    <el-radio label="2">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>8、平时容易口渴口干吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.thirst">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>9、平时觉得口中有异样味道吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isOropharynx">
                    <el-radio label="1">甜</el-radio>
                    <el-radio label="2">苦</el-radio>
                    <el-radio label="3">黏</el-radio>
                    <el-radio label="4">淡</el-radio>
										<el-radio label="5">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>10、平时容易心烦、情绪低落吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.temperament">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>11、你容易掉头发吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isHairLoss">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>12、平时容易失眠吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.sleeping">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<!-- <el-row>
							<el-col>
								<div>13、你平时身体有胀满不适吗（可多选）</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.abdomenFeel">
                    <el-radio label="1">乳房胀</el-radio>
                    <el-radio label="2">食后胀</el-radio>
                    <el-radio label="3">胸胁胀满</el-radio>
                    <el-radio label="4">无</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row> -->
						<el-row>
							<el-col>
								<div>14、你平时感觉腰膝酸软、腿脚无力吗？</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.livingHabits">
                    <el-radio label="0">否</el-radio>
                    <el-radio label="1">是</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>

            <h2 align="left">一般问诊</h2>
            <el-row>
							<el-col>
								<div>1、有无咳嗽（可多选）</div>
								<el-form-item label="">
									<el-checkbox-group v-model="inquirySheet.cough">
                    <el-checkbox label="1">无</el-checkbox>
                    <el-checkbox label=2>咳嗽轻</el-checkbox>
                    <el-checkbox label="3">咳嗽重</el-checkbox>
                    <el-checkbox label="4">夜晚加重</el-checkbox>
                    <el-checkbox label="5">晨起咳嗽</el-checkbox>
                    <el-checkbox label="6">受寒加重</el-checkbox>
                    <el-checkbox label="7">持续咳嗽</el-checkbox>
                  </el-checkbox-group>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
							<el-col>
								<div>2、有无痰</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.expectoration">
                    <el-radio label="1">无</el-radio>
                    <el-radio label="2">黄色痰</el-radio>
                    <el-radio label="3">清稀痰</el-radio>
                    <el-radio label="4">泡沫痰</el-radio>
                    <el-radio label="5">粘稠痰</el-radio>
                    <el-radio label="6">血丝痰</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>3、有无鼻涕</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.snot">
                    <el-radio label="1">无</el-radio>
                    <el-radio label="2">清鼻涕</el-radio>
                    <el-radio label="3">黄鼻涕</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>4、有无头痛头晕</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isHeadache">
                    <el-radio label="1">无</el-radio>
                    <el-radio label="2">头疼</el-radio>
                    <el-radio label="3">头晕</el-radio>
                  </el-radio-group>
										<span v-if="inquirySheet.isHeadache == '2'"> (详情：{{inquirySheet.headacheOne}})</span>
										<span v-if="inquirySheet.isHeadache == '3'"> (详情：{{inquirySheet.headacheTwo}})</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>5、有无经常异常出血</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isBleeding">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
										<span v-if="inquirySheet.isBleeding == '1'"> (详情：{{inquirySheet.bleedingDetail}})</span>

								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>6、有无全身肌肉疼痛</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isMuscle">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
										<span v-if="inquirySheet.isMuscle == '1'"> (详情：{{inquirySheet.muscleOther}})</span>

								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>7、有无关节活动不利</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isJoint">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
									<span v-if="inquirySheet.isJoint == '1'"> (详情：{{inquirySheet.jointOther}})</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>8、皮肤有无异常</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isSkin">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
									<span v-if="inquirySheet.isSkin == '1'">(详情：{{inquirySheet.skinOther}})</span>

								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>9、局部有无麻木感觉</div>
								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isNumbness">
                    <el-radio label="1">无</el-radio>
                    <el-radio label="2">头面</el-radio>
                    <el-radio label="3">四肢</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>10、有无异常胃肠道感觉？（可多选）</div>
								<el-form-item label="">
									<el-checkbox-group v-model="inquirySheet.stomachFeel">
										<el-checkbox label="1">正常</el-checkbox>
                    <el-checkbox label="2">泛酸</el-checkbox>
                    <el-checkbox label="3">食管烧灼感</el-checkbox>
                    <el-checkbox label="4">烧心</el-checkbox>
                    <el-checkbox label="5">胀气</el-checkbox>
                  </el-checkbox-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>11、呼吸有无异常气味</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isBreath">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
									<span v-if="inquirySheet.isBreath == '1'"> (详情：{{inquirySheet.breathDetail}})</span>

								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>12、头发有无异常</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.isHair">
                    <el-radio label="4">无</el-radio>
                    <el-radio label="1">断发</el-radio>
                    <el-radio label="2">脱发</el-radio>
                    <el-radio label="3">早白发</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<div>13、有无听力异常</div>

								<el-form-item label="">
									<el-radio-group v-model="inquirySheet.hearing">
                    <el-radio label="4">无</el-radio>
                    <el-radio label="1">耳聋</el-radio>
                    <el-radio label="2">耳鸣</el-radio>
                    <el-radio label="3">听力下降</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">妇科单独加强问诊</h2>
						<el-row>
							<el-col>
								<el-form-item label="月经周期：">
									<span>{{inquirySheet.menstrualCycle}}</span>
								</el-form-item>
							</el-col>
							<el-col>
								<el-form-item label="月经天数：">
									<span>{{inquirySheet.menstrualDate}}</span>
								</el-form-item>
							</el-col>
							<el-col>
								<el-form-item label="月经颜色：">
									<span>{{inquirySheet.menstrualColor}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="月经准时情况：">
									<el-radio-group v-model="inquirySheet.menstrualTimeSituation">
                    <el-radio label="1">准时</el-radio>
                    <el-radio label="2">提前</el-radio>
                    <el-radio label="3">退后</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="月经量：">
									<el-radio-group v-model="inquirySheet.menstrualNumber">
                    <el-radio label="1">多</el-radio>
                    <el-radio label="2">少</el-radio>
                    <el-radio label="3">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="伴随疼痛情况：">
									<el-radio-group v-model="inquirySheet.menstrualPain">
                    <el-radio label="1">轻微</el-radio>
                    <el-radio label="2">剧烈</el-radio>
                    <el-radio label="3">不痛</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="月经血块：">
									<el-radio-group v-model="inquirySheet.menstrualClot">
                    <el-radio label="3">无</el-radio>
                    <el-radio label="1">多</el-radio>
                    <el-radio label="2">少</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="白带量：">
									<el-radio-group v-model="inquirySheet.leucorrhea">
                    <el-radio label="7">无异味</el-radio>
                    <el-radio label="1">多</el-radio>
                    <el-radio label="2">少</el-radio>
                    <el-radio label="3">黄稠</el-radio>
                    <el-radio label="4">清稀</el-radio>
                    <el-radio label="5">白色</el-radio>
                    <el-radio label="6">有异味</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="生育情况：">
									<el-radio-group v-model="inquirySheet.bearing">
                    <el-radio label="1">育0</el-radio>
                    <el-radio label="2">育1</el-radio>
                    <el-radio label="3">育2及以上</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">儿科加强触诊</h2>
						<el-row>
							<el-col>
								<el-form-item label="额头温度：">
									<el-radio-group v-model="inquirySheet.foreheadTemperature">
                    <el-radio label="1">凉</el-radio>
                    <el-radio label="2">烫</el-radio>
                    <el-radio label="3">正常</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="手脚温度：">
									<el-radio-group v-model="inquirySheet.handfootTemperature">
                    <el-radio label="1">温暖</el-radio>
                    <el-radio label="2">凉</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="肚子温度：">
									<el-radio-group v-model="inquirySheet.bellyTemperature">
                    <el-radio label="1">暖</el-radio>
                    <el-radio label="2">凉</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="肚子按压：">
									<el-radio-group v-model="inquirySheet.stomachPressing">
                    <el-radio label="1">柔软</el-radio>
                    <el-radio label="2">紧硬</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="儿童眼睑照片：">
									<img  v-for="item in imgUtil(inquirySheet.childEyePicture)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="儿童舌头照片：">
									<img  v-for="item in imgUtil(inquirySheet.childTonguePicture)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">（男）房事是否正常</h2>
						<el-row>
							<el-col>
								<el-form-item label="有无阳痿：">
									<el-radio-group v-model="inquirySheet.isAsynodia">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="有无早泄：">
									<el-radio-group v-model="inquirySheet.isProspermia">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="有无遗精：">
									<el-radio-group v-model="inquirySheet.isSpermatorrhea">
                    <el-radio label="0">无</el-radio>
                    <el-radio label="1">有</el-radio>
                  </el-radio-group>
								</el-form-item>
							</el-col>
						</el-row>
							<el-row>
							<el-col>
								<el-form-item label="房事频率：">
									<span>{{inquirySheet.sexualFrequency}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="房事其他症状：">
									<span>{{inquirySheet.sexualOther}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">望诊</h2>
						<el-row>
							<el-col>
								<el-form-item label="面部图片：">
									<img  v-for="item in imgUtil(inquirySheet.facePicture)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="舌部图片：">
									<img  v-for="item in imgUtil(inquirySheet.tonguePicture)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col>
								<el-form-item label="病患部位图片：">
									<img  v-for="item in imgUtil(inquirySheet.illnessPicture)" :key="item.index" :src="item" style="width: 250px;height: 250px;"/>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">既往病史及治疗经过</h2>
						<el-row>
							<el-col>
								<el-form-item label="">
									<span>{{inquirySheet.anamnesisSymptom}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<h2 align="left">自我感觉身体还有其他异常之处吗？</h2>
						<el-row>
							<el-col>
								<el-form-item label="">
									<span>{{inquirySheet.other}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<!-- <el-button type="primary">保存</el-button> -->
						<el-button type="primary" @click="fanhui" >返回</el-button>
					</el-form>
  </div>

</template>
<script>
import { timestampToDate } from "@/utils/datetime"
import { timestampToTime } from "@/utils/datetime"
export default {
  name: 'InquirySheet',
  props: {
    inquirySheet:Object
  },
  data: function () {
    return {

    }
	},
	methods:{
		fanhui(){
			this.$emit('isShowSheetMethod',false)
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
		}

	},
	mounted(){
		if(this.inquirySheet.cough){
			console.log(this.inquirySheet.cough)
				this.inquirySheet.cough = this.inquirySheet.cough.split(',')
				console.log(this.inquirySheet.cough)
		}
		if(this.inquirySheet.stomachFeel){
			this.inquirySheet.stomachFeel = this.inquirySheet.stomachFeel.split(',')
		}
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
		}
	}

}
</script>

<style scoped>
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
	.demo .el-row{
		text-align: left
	}

</style>
