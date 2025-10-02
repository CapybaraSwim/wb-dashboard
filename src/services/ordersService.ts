import apiClient from '@/api/client'
import type { Order, PaginatedResponse } from '@/types'

export const ordersService = {
  async getOrders(dateFrom: string, dateTo: string, page = 1, limit = 500) {
    const res = await apiClient.get<PaginatedResponse<Order>>('/api/orders', {
      params: { dateFrom, dateTo, page, limit }
    })
    return res.data
  }
}