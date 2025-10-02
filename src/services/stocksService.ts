import apiClient from '@/api/client'
import type { Stock, PaginatedResponse } from '@/types'

export const stocksService = {
  async getStocks(dateFrom: string, page = 1, limit = 500) {
    const res = await apiClient.get<PaginatedResponse<Stock>>('/api/stocks', {
      params: { dateFrom, page, limit }
    })
    return res.data
  }
}