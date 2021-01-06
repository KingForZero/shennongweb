import axios from '../axios'

/*
 * 网站管理
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/user/save',
    method: 'post',
    data
  })
}
// 常见疾病删除
export const batchDelete = (data) => {
  return axios({
    url: '/system/commonDiseases/delCommonDiseases',
    method: 'post',
    params:data
  })
}
// 常见疾病分页查询
export const findPage = (data) => {
  return axios({
    url: '/system/commonDiseases/selectPagePc',
    method: 'post',
    data
  })
}
// 服务协议查询
export const findProtocol = (data) => {
  return axios({
    url: '/system/protocol/selectList',
    method: 'post',
    data
  })
}



//门户管理--常见疾病--添加常见疾病（不分页）
export const editProtocol = (data) => {
  return axios({
    url: '/system/protocol/edit',
    method: 'post',
    data
  })
}


//门户管理--常见疾病--添加常见疾病（不分页）
export const addCommonDiseases = (data) => {
  return axios({
    url: '/system/commonDiseases/addCommonDiseases',
    method: 'post',
    params:data
  })
}


//门户管理--医院管理--添加医院（不分页）
export const addHospital = (data) => {
  return axios({
    url: '/system/hospital/addHospital',
    method: 'post',
    params:data
  })
}

// 医院管理分页查询
export const findPageByHospital = (data) => {
  return axios({
    url: '/system/hospital/selectPagePc',
    method: 'post',
    data
  })
}


//医院批量删除
export const hospitalBatchDelete = (data) => {
  return axios({
    url: '/system/hospital/delHospital',
    method: 'post',
    params:data
  })
}

//查询所有二级科室
export const selectAllDepartTwo = (data) => {
  return axios({
    url: '/system/departmentTwo/selectTwo',
    method: 'post',
    params:data
  })
}


// 商品管理分页查询
export const goodsManagefindPage = (data) => {
  return axios({
    url: '/system/goods/selectPagePc',
    method: 'post',
    data
  })
}


// 商品管理删除
export const goodsManageBatchDelete = (data) => {
  return axios({
    url: '/system/goods/delGoods',
    method: 'post',
    params:data
  })
}
//商品管理，报存
export const addGoods = (data) => {
  return axios({
    url: '/system/goods/addGoods',
    method: 'post',
    params:data
  })
}

// 系统公告分页查询
export const noticeFindPage = (data) => {
  return axios({
    url: '/system/notice/selectListPc',
    method: 'post',
    data
  })
}

//系统公告添加
export const addNotice = (data) => {
  return axios({
    url: '/system/notice/addNotice',
    method: 'post',
    params:data
  })
}


// 系统公告删除
export const delNotice = (data) => {
  return axios({
    url: '/system/notice/delNotice',
    method: 'post',
    params:data
  })
}


// 医疗机构分页查询
export const medicalInstitutionFindPage = (data) => {
  return axios({
    url: '/system/medicalInstitution/selectPagePc',
    method: 'post',
    data
  })
}
//医疗机构添加
export const addMedicalInstitution = (data) => {
  return axios({
    url: '/system/medicalInstitution/addMedicalInstitution',
    method: 'post',
    params:data
  })
}


// 医疗机构删除
export const delMedicalInstitution = (data) => {
  return axios({
    url: '/system/medicalInstitution/delMedicalInstitution',
    method: 'post',
    params:data
  })
}


// 获取环信好友列表
export const getFriendList = (data) => {
  return axios({
    url: '/system/clientUser/getFriends',
    method: 'post',
    params:data
  })
}
//保存聊条记录
export const saveChatRecord = (data) => {
  return axios({
    url: '/system/wechatPayRecorde/saveChatRecord',
    method: 'post',
    data
  })
}
//获取聊条记录
export const selectChatRecord = (data) => {
  return axios({
    url: '/system/wechatPayRecorde/selectChatRecord',
    method: 'post',
    params:data
  })
}
