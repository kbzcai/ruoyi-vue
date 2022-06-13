import request from '@/utils/request'

// 查询计划管理列表
export function listPlan(query) {
  return request({
    url: '/produceManage/plan/list',
    method: 'get',
    params: query
  })
}

// 查询计划管理详细
export function getPlan(id) {
  return request({
    url: '/produceManage/plan/' + id,
    method: 'get'
  })
}
// 查询物料需求详细
export function getMaterialDetail(id) {
  return request({
    url: '/bomManage/bom/detail/' + id,
    method: 'get'
  })
}

// 新增计划管理
export function addPlan(data) {
  return request({
    url: '/produceManage/plan',
    method: 'post',
    data: data
  })
}

// 修改计划管理
export function updatePlan(data) {
  return request({
    url: '/produceManage/plan',
    method: 'put',
    data: data
  })
}

// 删除计划管理
export function delPlan(id) {
  return request({
    url: '/produceManage/plan/' + id,
    method: 'delete'
  })
}
