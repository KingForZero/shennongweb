export default class MedicalRecordEnum {
  static status(val) {
    const map = new Map()
    map.set('1', '新增')
    map.set('2', '待医生处理')
    map.set('3', '医生已处理')
    map.set('4', '已预约面诊')
    map.set('5', '药师审核驳回')
    map.set('6', '待药师审核')
    map.set('7', '待划价')
    map.set('8', '待付费')
    map.set('9', '待下单')
    map.set('91', '已下单')
    map.set('10', '已发货')
    map.set('11', '已完成')
    map.set('12', '已取消')
    return map.get(val)
  }
}
