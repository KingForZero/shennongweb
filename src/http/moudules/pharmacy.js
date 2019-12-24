import axios from '../axios'

/* 
 * 助理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/user/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: 'bussiness/medicalRecords/selectForPharmacy',
        method: 'post',
        params:data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/user/findPermissions',
        method: 'get',
        params
    })
}


// 助理查询医疗记录列表
export const assisantSelectMedicalRecords = (params) => {
  return axios({
    url: '/bussiness/medicalRecords/selectForAssistant',
    method: 'post',
    params
  })
}



// 助理工作台--工作团队
export const myTeam = (data) => {
  return axios({
    url: '/system/employee/findUserByRole',
    method: 'post',
    data
  })
}
