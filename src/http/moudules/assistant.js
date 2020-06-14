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
        url: '/system/employee/selectDoctorByAssisant',
        method: 'post',
        params:data
    })
}

// 助理查询医生
export const selectDocByAssistant = (data) => {
  return axios({
      url: '/system/employee/selectDocByAssistant',
      method: 'post',
      data
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



// 助理工作台--工作团队（分页）
export const myTeam = (data) => {
  return axios({
    url: '/system/employee/findUserByRole',
    method: 'post',
    data
  })
}

//助理工作台--我的医生--更新会诊时间（不分页）
export const updateDocWorkTime = (data) => {
  return axios({
    url: '/system/docWorkTime/updateDocWorkTime',
    method: 'post',
    params:data
  })
}

//助理工作台--我的医生--更新会诊时间（不分页）
export const selectDocWorkTimeById = (data) => {
  return axios({
    url: '/system/docWorkTime/selectById',
    method: 'post',
    params:data
  })
}


//助理工作台--我的医生--添加工作时间（不分页）
export const addDocWorkTime = (data) => {
  return axios({
    url: '/system/docWorkTime/addDocWorkTime',
    method: 'post',
    params:data
  })
}
//查看药方
export const selectMedical = (data) => {
  return axios({
    url: '/bussiness/medicine/selectMedical',
    method: 'post',
    data
  })
}
//查看所有得药方
export const selectMedicalAll = (data) => {
  return axios({
    url: '/bussiness/medicine/selectMedicalAll',
    method: 'post',
    params:data
  })
}


//统计金额
export const countAmonut = (data) => {
  return axios({
    url: '/bussiness/medicine/countAmonut',
    method: 'post',
    params:data
  })
}


//添加药方
export const add = (data) => {
  return axios({
    url: '/bussiness/medicine/add',
    method: 'post',
    data
  })
}

//删除药方
export const deleteById = (data) => {
  return axios({
    url: '/bussiness/medicine/deleteById',
    method: 'post',
    params:data
  })
}
//助理更新医疗记录
export const update = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/update',
    method: 'post',
    params:data
  })
}
//助理发送给医生
export const pushDoctor = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/push',
    method: 'post',
    params:data
  })
}
//助理提交给审核人
export const pushYs = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/pushYs',
    method: 'post',
    params:data
  })
}
//医生更新医疗记录
export const doctorCommit = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/doctorCommit',
    method: 'post',
    params:data
  })
}
//医生处理完成
export const doctorDone = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/doctorDone',
    method: 'post',
    params:data
  })
}
//医生更改医疗记录实验组状态
export const updateCompare = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/updateCompare',
    method: 'post',
    params:data
  })
}
//药师审核驳回
export const audit = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/audit',
    method: 'post',
    params:data
  })
}
//药师审核通过
export const auditTongGuo = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/auditTongGuo',
    method: 'post',
    params:data
  })
}


//查询所有的药房
export const selectYaofang = () => {
  return axios({
    url: '/system/role/selectYaofang',
    method: 'post'
  })
}

//发货
export const send = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/send',
    method: 'post',
    params:data
  })
}
//根据id查询个人档案
export const selectHealthRecord = (data) => {
  return axios({
    url: '/system/healthRecord/selectById',
    method: 'post',
    params:data
  })
}

//助理更新个人档案
export const addHealthRecord = (data) => {
  return axios({
    url: '/system/healthRecord/addHealthRecord',
    method: 'post',
    params:data
  })
}


//管家更新健康档案
export const updateHealthRecord = (data) => {
  return axios({
    url: '/system/healthRecord/updateHealthRecord',
    method: 'post',
    params:data
  })
}
//药房划价
export const pricing = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/pricing',
    method: 'post',
    params:data
  })
  
}
//药房下单
export const xiadan = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/xiadan',
    method: 'post',
    params:data
  })
}
//取消下单
export const quxiao = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/quxiao',
    method: 'post',
    params:data
  })
}
//查询物流信息
export const wuliu = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/wuliu',
    method: 'post',
    params:data
  })
  
}
//查询物流信息
export const getOpenId = (data) => {
  return axios({
    url: '/pay/getOpenId',
    method: 'get',
    params:data
  })
}
export const getYingYangOpenId = (data) => {
  return axios({
    url: '/yingyangWx/getOpenId',
    method: 'get',
    params:data
  })
}
