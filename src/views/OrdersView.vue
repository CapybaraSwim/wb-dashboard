<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-6">Заказы</h1>

    <div class="filter-group">
      <div class="filter-item">
        <label>Дата от</label>
        <input v-model="filters.dateFrom" type="date" />
      </div>
      <div class="filter-item">
        <label>Дата до</label>
        <input v-model="filters.dateTo" type="date" />
      </div>
      <div class="filter-item">
        <label>Лимит</label>
        <select v-model="filters.limit">
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="500">500</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Мин. сумма</label>
        <input v-model.number="filters.minTotalPrice" type="number" min="0" placeholder="0" />
      </div>
      <div class="filter-item">
        <label>Макс. сумма</label>
        <input v-model.number="filters.maxTotalPrice" type="number" min="0" placeholder="100000" />
      </div>
      <button @click="fetchData" class="btn btn--primary">Применить</button>
    </div>

    <div class="chart-container">
      <h2 class="text-lg font-semibold mb-2">График: Сумма заказов по дате</h2>
      <canvas ref="chartRef"></canvas>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Артикул</th>
            <th>Размер</th>
            <th>Штрихкод</th>
            <th>Сумма (₽)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in filteredOrders" :key="index">
            <td>{{ order.date }}</td>
            <td>{{ order.supplier_article }}</td>
            <td>{{ order.tech_size }}</td>
            <td>{{ order.barcode }}</td>
            <td>{{ order.total_price }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="page--" :disabled="page <= 1">Назад</button>
      <span>Стр. {{ page }} из {{ totalPages }}</span>
      <button @click="page++" :disabled="page >= totalPages">Вперёд</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { ordersService } from '@/services/ordersService'
import type { Order } from '@/types'

Chart.register(...registerables)

const orders = ref<Order[]>([])
const page = ref(1)
const totalPages = ref(1)
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const filters = ref<{
  dateFrom: string | undefined
  dateTo: string | undefined
  limit: number
  minTotalPrice: number
  maxTotalPrice: number
}>({
  dateFrom: undefined,
  dateTo: undefined,
  limit: 500,
  minTotalPrice: 0,
  maxTotalPrice: 100000
})

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const price = parseFloat(o.total_price)
    return price >= filters.value.minTotalPrice && price <= filters.value.maxTotalPrice
  })
})

const fetchData = async () => {
  if (!filters.value.dateFrom || !filters.value.dateTo) return

  try {
    const response = await ordersService.getOrders(
      filters.value.dateFrom,
      filters.value.dateTo,
      page.value,
      filters.value.limit
    )
    orders.value = response.data
    totalPages.value = response.meta.last_page
    renderChart()
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  }
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const labels = filteredOrders.value.map(o => o.date)
  const prices = filteredOrders.value.map(o => parseFloat(o.total_price) || 0)

  chartInstance = new Chart(ctx, {
    type: 'bar',
      data: {
      labels,
      datasets: [{
        label: 'Сумма заказов (₽)',
        data: prices,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  })
}

watch(page, fetchData)

onMounted(() => {
  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)

  const formatDate = (d: Date) => d.toISOString().split('T')[0]

  filters.value.dateFrom = formatDate(sevenDaysAgo)
  filters.value.dateTo = formatDate(today)
  fetchData()
})
</script>

<style scoped>
.chart-container canvas {
  height: 300px !important;
  width: 100% !important;
}
</style>