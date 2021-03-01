/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

 // 后台管理系统服务器地址
//export const baseUrl = process.env.API_ROOT
export const baseUrl = window.location.origin+"/sh"
export const backupBaseUrl = ""
export const imageUrl = window.location.origin+"/images/"

export default {
    baseUrl,
    backupBaseUrl,
    imageUrl
}
