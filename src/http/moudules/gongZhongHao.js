import axios from '../axios'
//查询我的患者
export const selectMedicalRecordsGZ = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/selectMedicalRecordsGZ',
    method: 'post',
    params:data
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
    url: '/bussiness/medicalRecords/cancel',
    method: 'post',
    params:data
  })
}
