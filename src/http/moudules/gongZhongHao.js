import axios from '../axios'
//查询我的患者
export const selectMedicalRecordsGZ = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/selectMedicalRecordsGZ',
    method: 'post',
    params:data
  })
}
//创建医疗记录
export const addByGZhao = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/addByGZhao',
    method: 'post',
    data
  })
}
//根据医疗记录id查询电子处方以及每个电子处方包含的药材
export const selectByRecordIdWX = (data) => {
  return axios({
    url: '/system/prescribing/selectByRecordIdWX',
    method: 'post',
    params:data
  })
}

//根据id查询医疗记录
export const selectByIdGZ = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/selectByIdGZ',
    method: 'post',
    params:data
  })
}
//新增收获地址
export const add = (data) => {
  return axios({
    url: '/system/address/add',
    method: 'post',
    params:data
  })
}
//修改收获地址
export const edit = (data) => {
  return axios({
    url: '/system/address/edit',
    method: 'post',
    params:data
  })
}
//查询收获地址
export const list = (data) => {
  return axios({
    url: '/system/address/list',
    method: 'post',
    params:data
  })
}
//获取jssdk签名
export const getJsSdk = (data) => {
  return axios({
    url: '/wx/getJsSdk',
    method: 'post',
    params:data
  })
}
//支付
export const wxpay = (data) => {
  return axios({
    url: '/pay/wxpay',
    method: 'post',
    params:data
  })
}
//取消医疗记录
export const cancel = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/cancelGZ',
    method: 'post',
    params:data
  })
}
//根据openId查询用户是否已经注册
export const selectByOpenId = (data) => {
  return axios({
    url: "/system/clientUser/selectByOpenId",
    method: 'post',
    params:data
  })
}
//查询医生列表
export const selectDocListWeb = (data) => {
  return axios({
    url: "/system/employee/selectDocListGZ",
    method: 'post',
    params:data
  })
}
//根据id查询
export const selectById = (data) => {
  return axios({
    url: "/system/employee/selectById",
    method: 'post',
    params:data
  })
}
//我的医生列表
export const selectMyDocGZ = (data) => {
  return axios({
    url: "/system/clientUser/selectMyDocGZ",
    method: 'post',
    params:data
  })
}
//获取分享url
export const getTicketByOpenId = (data) => {
  return axios({
    url: "/yingyangWx/getTicketByOpenId",
    method: 'post',
    params:data
  })
}
//查询就诊人信息
export const selectChildUserByUserId = (data) => {
  return axios({
    url: "/system/clientChildUser/selectChildUserByUserId",
    method: 'post',
    params:data
  })
}
//编辑就诊人信息
export const editChildUser = (data) => {
  return axios({
    url: "/system/clientChildUser/editChildUser",
    method: 'post',
    data
  })
}
//删除就诊人信息
export const removeChildUser = (data) => {
  return axios({
    url: "/system/clientChildUser/removeChildUser",
    method: 'post',
    params:data
  })
}
