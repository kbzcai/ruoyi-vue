import request from '@/utils/request'

// 查询仓库列表
export function listTables(query) {
  return request({
    url: '/depository/tables/list',
    method: 'get',
    params: query
  })
}

// 查询仓库详细
export function getTables(depositoryId) {
  return request({
    url: '/depository/tables/' + depositoryId,
    method: 'get'
  })
}

// 新增仓库
export function addTables(data) {
  return request({
    url: '/depository/tables',
    method: 'post',
    data: data
  })
}

// 修改仓库
export function updateTables(data) {
  return request({
    url: '/depository/tables',
    method: 'put',
    data: data
  })
}

// 删除仓库
export function delTables(depositoryId) {
  return request({
    url: '/depository/tables/' + depositoryId,
    method: 'delete'
  })
}
