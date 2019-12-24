import axios from '../axios'

/* 
 * 角色管理模块
 */


// 保存
export const findById = (data) => {
    return axios({
        url: '/system/role/findById',
        method: 'post',
        params:data
    })
}
// 保存
export const save = (data) => {
    return axios({
        url: '/system/role/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/system/role/delete',
        method: 'get',
        params:data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/system/role/findPage',
        method: 'post',
        data
    })
}
// 查询全部
export const findAll = () => {
    return axios({
        url: '/system/role/findAll',
        method: 'get'
    })
}
// 查询角色菜单集合
export const findRoleMenus = (data) => {
    return axios({
        url: '/system/role/findRoleMenus',
        method: 'get',
        params:data
    })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
    return axios({
        url: '/system/role/saveRoleMenus',
        method: 'post',
        data
    })
}