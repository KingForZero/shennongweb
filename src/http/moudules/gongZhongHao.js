import axios from '../axios'
//根据userId查询用户的医疗记录
export const selectMedicalRecordByUserId = (data) => {
  return axios({
    url: '/bussiness/medicalRecords/selectMedicalRecordByUserId',
    method: 'post',
    params:data
  })
}
