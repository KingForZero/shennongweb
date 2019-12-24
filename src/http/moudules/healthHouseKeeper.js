import axios from '../axios'

/* 
 * 健康管家理模块
 */


// 查询我的会员
export const selectClientUserByKeeper = (data) => {
    return axios({
        url: '/system/clientKeeper/selectClientUserByKeeper',
        method: 'post',
        data
    })
}
//查询我的患者
export const selectPatient = (data) => {
    return axios({
        url: '/system/userDoc/selectByContion',
        method: 'post',
        data
    })
}
//保存健康指导
export const saveHealthGuidance = (data) => {
    return axios({
        url: '/system/healthGuidance/saveHealthGuidance',
        method: 'post',
        params:data
    })
}
//药房查询医疗记录
export const selectByYaoFang = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectByYaoFang',
        method: 'post',
        data
    })
}
//查询


//根据用户id查询医疗记录
export const selectByContion = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectByContion',
        method: 'post',
        data
    })
}
//查询总药费
export const selectTotal = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectTotal',
        method: 'post',
        data
    })
}

//根据id查询医疗记录
export const selectById = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectById',
        method: 'post',
        params:data
    })
}
//查询健康指导
export const selectPage = (data) => {
    return axios({
        url: '/system/healthGuidance/selectPage',
        method: 'post',
        params:data
    })
}
//查询健康日志
export const selectLogPage = (data) => {
    return axios({
        url: '/system/healthLog/selectPage',
        method: 'post',
        data
    })
}

//查询健康方案
export const selectProgramme = (data) => {
    return axios({
        url: '/system/healthProgramme/selectByUserId',
        method: 'post',
        data
    })
}
//保存健康方案
export const saveProgramme = (data) => {
    return axios({
        url: '/system/healthProgramme/save',
        method: 'post',
        params:data
    })
}
//根据id查询健康方案
export const selectProgrammeById = (data) => {
    return axios({
        url: '/system/healthProgramme/selectById',
        method: 'post',
        params:data
    })
}


//查询健康评估
export const selectassessmentPage = (data) => {
    return axios({
        url: '/system/healthAssessment/selectassessmentPage',
        method: 'post',
        data
    })
}
//查询健康评估
export const saveAssessment = (data) => {
    return axios({
        url: '/system/healthAssessment/saveAssessment',
        method: 'post',
        params:data
    })
}
//根据问诊单id查询问诊单
export const selectInquirySheetById = (data) => {
    return axios({
        url: '/system/inquirySheet/selectById',
        method: 'post',
        params:data
    })
}
//新增电子处方
export const addPrescribing = (data) => {
    return axios({
        url: '/system/prescribing/add',
        method: 'post',
        params:data
    })
}
//删除电子处方
export const deletePrescribiing = (data) => {
    return axios({
        url: '/system/prescribing/deleteById',
        method: 'post',
        params:data
    })
}

//修改电子处方
export const updatePrescribing = (data) => {
    return axios({
        url: '/system/prescribing/update',
        method: 'post',
        params:data
    })
}
//根据id查询电子处方
export const selectPrescribing = (data) => {
    return axios({
        url: '/system/prescribing/selectById',
        method: 'post',
        params:data
    })
}
//根据id查询电子处方
export const selectByRecordIdPrescribing = (data) => {
    return axios({
        url: '/system/prescribing/selectByRecordId',
        method: 'post',
        params:data
    })
}
//根据我的医生
export const selectMyDoctor = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/selectMyDoctor',
        method: 'post'
    })
}
//记载中医库
export const selectList = (data) => {
    return axios({
        url: '/system/tcmLibrary/selectList',
        method: 'post',
        params:data
    })
}
//根据患者查询保健品电子处方
export const selectChufang = (data) => {
    return axios({
        url: '/system/prescribing/selectChufang',
        method: 'post',
        data
    })
}

//根据推送给药房
export const pushYf = (data) => {
    return axios({
        url: '/system/prescribing/pushYf',
        method: 'post',
        params:data
    })
}
