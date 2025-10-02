import apiClient from '@/api/client'
import type { Income, PaginatedResponse } from '@/types'

export const incomesService = {
  async getIncomes(dateFrom: string, dateTo: string, page = 1, limit = 500) {
    const res = await apiClient.get<PaginatedResponse<Income>>('/api/incomes', {
      params: { dateFrom, dateTo, page, limit }
    })
    return res.data
  }
}