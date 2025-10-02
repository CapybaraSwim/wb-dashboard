<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-6">Продажи</h1>

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
      <button @click="fetchData" class="btn btn--primary">Применить</button>
    </div>

    <div class="chart-container">
      <h2 class="text-lg font-semibold mb-2">График: Сумма продаж по дате</h2>
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
          <tr v-for="(sale, index) in sales" :key="index">
            <td>{{ sale.date }}</td>
            <td>{{ sale.supplier_article }}</td>
            <td>{{ sale.tech_size }}</td>
            <td>{{ sale.barcode }}</td>
            <td>{{ sale.total_price }}</td>
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
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { salesService } from '@/services/salesService'
import type { Sale } from '@/types'

Chart.register(...registerables)

const sales = ref<Sale[]>([])
const page = ref(1)
const totalPages = ref(1)
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const filters = ref<{
  dateFrom: string | undefined
  dateTo: string | undefined
  limit: number
}>({
  dateFrom: undefined,
  dateTo: undefined,
  limit: 500
})

const fetchData = async () => {
  if (!filters.value.dateFrom || !filters.value.dateTo) return

  try {
    const response = await salesService.getSales(
      filters.value.dateFrom,
      filters.value.dateTo,
      page.value,
      filters.value.limit
    )
    sales.value = response.data
    totalPages.value = response.meta.last_page
    renderChart()
  } catch (error) {
    console.error('Ошибка загрузки продаж:', error)
  }
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const labels = sales.value.map(s => s.date)
  const prices = sales.value.map(s => parseFloat(s.total_price) || 0)

  chartInstance = new Chart(ctx, {
    type: 'bar',
     data: {
      labels,
      datasets: [{
        label: 'Сумма продаж (₽)',
        data: prices,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
