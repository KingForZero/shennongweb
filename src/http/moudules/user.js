import axios from '../axios'

/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/system/employee/save',
        method: 'post',
        data
    })
}
// 新增
export const add = (data) => {
    return axios({
        url: '/system/employee/add',
        method: 'post',
        data
    })
}
// 新增
export const lalala = () => {
    return axios({
        url: '/admin/blogArticle/login',
        method: 'get',
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
        url: '/system/employee/list',
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
//发送验证码接口
export const sendSmsCode = (data) => {
    return axios({
        url: '/system/employee/sendSmsCode',
        method: 'post',
        params:data
    })
}
//忘记密码接口
export const forgetPass = (data) => {
    return axios({
        url: '/system/employee/forgetPass',
        method: 'post',
        params:data
    })
}
//患者注册接口
export const cliengUser = (data) => {
    return axios({
        url: '/system/clientUser/clientUser',
        method: 'post',
        params:data
    })
}

//查询所有助理接口

export const selectAssisant = (data) => {
    return axios({
        url: '/system/employee/selectAssisant',
        method: 'post'
    })
}
//查询所有的小程序用户
export const selectClientUser = (data) => {
    return axios({
        url: '/system/clientUser/selectClientUser',
        method: 'post',
        data
    })
}
//查询病例
export const selectKun = (data) => {
    return axios({
        url: '/system/clientUser/selectKun',
        method: 'post',
        data
    })
}

//查询所有的管家
export const selectKeeperList = (data) => {
    return axios({
        url: '/system/employee/selectKeeperList',
        method: 'post',
        params:data
    })
}
//查询个人药房
export const selectYaoFang = (data) => {
    return axios({
        url: '/system/role/selectYaoFang',
        method: 'post',
        params:data
    })
}

//根据电话查询用户信息
export const selectClientUserByTel = (data) => {
    return axios({
        url: '/system/clientUser/selectByCondition',
        method: 'post',
        params:data
    })
}

//查询所有的医生
export const selectDocListWeb = () => {
    return axios({
        url: '/system/employee/selectDocListWeb',
        method: 'post'
    })
}

//助理取消转诊
export const unChange = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/unChange',
        method: 'post',
        params:data
    })
}
//查询既往病史
export const selectHistory = (data) => {
    return axios({
        url: '/system/medicalHistory/selectByUserIdWeb',
        method: 'post',
        params:data
    })
}
//新增既往病史
export const addHistory = (data) => {
    return axios({
        url: '/system/medicalHistory/add',
        method: 'post',
        params:data
    })
}


//新增会员管家关系
export const addVipKeeper = (data) => {
    return axios({
        url: '/system/clientKeeper/add',
        method: 'post',
        params:data
    })
}

//解除会员管家关系
export const cancelVipKeeper = (data) => {
    return axios({
        url: '/system/clientKeeper/cancel',
        method: 'post',
        params:data
    })
}
//转诊
export const change = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/change',
        method: 'post',
        params:data
    })
}

//查询所有的小程序用户
export const selectClientUserAll = () => {
    return axios({
        url: '/system/clientUser/selectClientUserAll',
        method: 'post'
    })
}
//医生新建医疗记录
export const doctorAdd = (data) => {
    return axios({
        url: '/bussiness/medicalRecords/doctorAdd',
        method: 'post',
        params:data
    })
}
//课题医生新建患者
export const doctorAddUser = (data) => {
    return axios({
        url: '/system/clientUser/doctorAdd',
        method: 'post',
        params:data
    })
}
