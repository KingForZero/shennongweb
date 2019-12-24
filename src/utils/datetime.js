/**
 * 时间日期相关操作
 */


/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format (datetime) {
  return formatWithSeperator(datetime, "/", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator (datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat = year + dateSeprator + month + dateSeprator + day + " " + hh + timeSeprator + mm + timeSeprator + ss;
    return timeFormat;
  }
}



/**
 * 通过HH:mm:ss字符串返回时间戳
 * @param time str
 * @returns {string}
 */
export function formatTimeStr(timestr) {
  console.log(new Number((new Date(timestr)).getTime()));
  return (new Date(timestr)).getTime()+'';
}
/**
 * 时间戳转换为H-M-D 
 * @param {*} timestamp 
 */
export function timestampToDate(timestamp) {
  var date =  new Date(timestamp);
  var y = 1900+date.getYear();
  var m = "0"+(date.getMonth()+1);
  var d = "0"+date.getDate();
  return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}
/**
 * 时间戳转换为日期H-M-D S:m:s
 * @param {} timestamp 
 */
export function timestampToTime(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
  return Y+M+D+h+m+s;
}
