import axios from '../axios'


/**
 * 查询营养方案列表
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const selectListGZ = () => {
  return axios({
    url: '/system/productMix/selectListGZ',
    method: 'post',
  })
}
/**
 * 查询产品列表
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const selectList = (data) => {
  return axios({
    url: '/system/productMix/selectList',
    method: 'post',
    data
  })
}
/**
 * 根据id查询详情
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const selectById = (data) => {
  return axios({
    url: '/system/productMix/selectById',
    method: 'post',
    params:data
  })
}
/**
 * 根据id删除
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const deleteById = (data) => {
  return axios({
    url: '/system/productMix/deleteById',
    method: 'post',
    params:data
  })
}
/**
 * 保存产品
 * @param data
 * @returns {Promise | Promise<unknown>}
 */
export const save = (data) => {
  return axios({
    url: '/system/productMix/save',
    method: 'post',
    data
  })
}
