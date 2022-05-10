import request from '@/utils/request'

// 查询plc数据列表
export function listPlc(query) {
  return request({
    url: '/equipmentManage/plc/list',
    method: 'get',
    params: query
  })
}

// 查询plc数据详细
export function getPlc(id) {
  return request({
    url: '/equipmentManage/plc/' + id,
    method: 'get'
  })
}

// 新增plc数据
export function addPlc(data) {
  return request({
    url: '/equipmentManage/plc',
    method: 'post',
    data: data
  })
}

// 修改plc数据
export function updatePlc(data) {
  return request({
    url: '/equipmentManage/plc',
    method: 'put',
    data: data
  })
}

// 删除plc数据
export function delPlc(id) {
  return request({
    url: '/equipmentManage/plc/' + id,
    method: 'delete'
  })
}
