import apiClient from '@/api/client'
import type { Sale, PaginatedResponse } from '@/types'

export const salesService = {
  async getSales(dateFrom: string, dateTo: string, page = 1, limit = 500) {
    const res = await apiClient.get<PaginatedResponse<Sale>>('/api/sales', {
      params: { dateFrom, dateTo, page, limit }
    })
    return res.data
  }
}