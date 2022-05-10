import request from '@/utils/request'

// 查询物料管理列表
export function getNum(start, end) {
  return request({
    url: '/mainDashboard/getNum/' + start + "/" + end,
    method: 'get',
    headers: {
      isToken: false
    }
  })
}
