import axios from '../axios'

/* 
 * 科研课题模块
 */


// 查询我的课题
export const selectAllPage = (data) => {
    return axios({
        url: '/system/project/selectAllPage',
        method: 'post',
        data
    })
}
// 查询我的课题
export const selectPage = (data) => {
    return axios({
        url: '/system/project/selectPage',
        method: 'post',
        data
    })
}
//保存课题
export const save = (data) => {
    return axios({
        url: '/system/project/save',
        method: 'post',
        params:data
    })
}
//更新观察表
export const update = (data) => {
    return axios({
        url: '/system/projectUser/update',
        method: 'post',
        params:data
    })
}
//删除课题
export const deleteById = (data) => {
    return axios({
        url: '/system/projectUser/delete',
        method: 'post',
        params:data
    })
}
// 查询课题患者
export const selectUserPage = (data) => {
    return axios({
        url: '/system/projectUser/selectPage',
        method: 'post',
        data
    })
}
// 课题添加成员
export const projectAdd = (data) => {
    return axios({
        url: '/system/projectUser/add',
        method: 'post',
        data
    })
}
