import request from '@/utils/request'

// 查询物料管理列表
export function listBom(query) {
  return request({
    url: '/bomManage/bom/list',
    method: 'get',
    params: query
  })
}

// 查询物料管理详细
export function getBom(id) {
  return request({
    url: '/bomManage/bom/' + id,
    method: 'get'
  })
}

// 新增物料管理
export function addBom(data) {
  return request({
    url: '/bomManage/bom',
    method: 'post',
    data: data
  })
}

// 修改物料管理
export function updateBom(data) {
  return request({
    url: '/bomManage/bom',
    method: 'put',
    data: data
  })
}

// 删除物料管理
export function delBom(id) {
  return request({
    url: '/bomManage/bom/' + id,
    method: 'delete'
  })
}
