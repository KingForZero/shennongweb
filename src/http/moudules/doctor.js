import axios from '../axios'

/* 
 * 医生工作台模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/system/employee/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/system/employee/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectForDoctor',
        method: 'post',
      params:data
    })
}

//医生工作台-医生工作量统计
export const findPageForWorkLoad = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/performance',
    method: 'post',
    data
  })
}
//医生工作台，提交图片
export const doctorCommit = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/doctorCommit',
    method: 'post',
    params:data
  })
}
