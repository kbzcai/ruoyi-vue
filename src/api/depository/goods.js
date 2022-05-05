import request from '@/utils/request'

// 查询货物列表
export function listGoods(query) {
  return request({
    url: '/depository/goods/list',
    method: 'get',
    params: query
  })
}

// 查询货物详细
export function getGoods(goodsId) {
  return request({
    url: '/depository/goods/' + goodsId,
    method: 'get'
  })
}

// 新增货物
export function addGoods(data) {
  return request({
    url: '/depository/goods',
    method: 'post',
    data: data
  })
}

// 修改货物
export function updateGoods(data) {
  return request({
    url: '/depository/goods',
    method: 'put',
    data: data
  })
}

// 删除货物
export function delGoods(goodsId) {
  return request({
    url: '/depository/goods/' + goodsId,
    method: 'delete'
  })
}
