import axios from '../axios'

/*
 * 体质辨识模块
 */


// 查询体质列表
export const selectList = (data) => {
    return axios({
        url: '/system/physique/selectList',
        method: 'post',
        data
    })
}
// 根据体质id查询详情
export const selectById = (data) => {
    return axios({
        url: '/system/physique/selectById',
        method: 'post',
        params:data
    })
}
//编辑体质（不传id新增，传id更新）
export const edit = (data) => {
    return axios({
        url: '/system/physique/edit',
        method: 'post',
        params:data
    })
}
// 根据体质id查询养生保健方案
export const selectReginmenById = (data) => {
  return axios({
    url: '/system/physique/selectReginmenById',
    method: 'post',
    params:data
  })
}
//编辑养生保健方案

//编辑体质（不传id新增，传id更新）
  export const editReginmenById = (data) => {
    return axios({
      url: '/system/regimen/edit',
      method: 'post',
      params:data
    })
  }

//根据体质类型和id查询中药调理列表
export const selectMedicalConditionById = (data) => {
  return axios({
    url: '/system/physique/selectMedicalConditionById',
    method: 'post',
    params:data
  })
}
//保存中药调理
export const editMedicalCondition = (data) => {
  return axios({
    url: '/system/medicalCondition/edit',
    method: 'post',
    params:data
  })
}
//根据id查询中药调理详情
export const selectMedicalConditionDetailById = (data) => {
  return axios({
    url: '/system/medicalCondition/selectById',
    method: 'post',
    params:data
  })
}
