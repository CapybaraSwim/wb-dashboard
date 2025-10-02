<template>
  <div class="container">
    <h1 class="text-2xl font-bold mb-6">Склады</h1>
    <p class="mb-4 text-gray-600">
      Дата: {{ formattedToday }}
    </p>
    <div class="filter-group">
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
      <h2 class="text-lg font-semibold mb-2">График: Остатки на складе (quantity)</h2>
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
            <th>Остаток (шт)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, index) in stocks" :key="index">
            <td>{{ stock.date }}</td>
            <td>{{ stock.supplier_article || '—' }}</td>
            <td>{{ stock.tech_size || '—' }}</td>
            <td>{{ stock.barcode || '—' }}</td>
            <td>{{ stock.quantity }}</td>
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
import { stocksService } from '@/services/stocksService'
import type { Stock } from '@/types'

Chart.register(...registerables)

const stocks = ref<Stock[]>([])
const page = ref(1)
const totalPages = ref(1)
const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const today = new Date()
const formattedToday = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`

const filters = ref({
  limit: 500
})


const fetchData = async () => {
  const today = new Date()
  const dateStr = new Date().toISOString().split('T')[0]!

  try {
    const response = await stocksService.getStocks(
      dateStr,
      page.value,
      filters.value.limit
    )
    stocks.value = response.data
    totalPages.value = response.meta.last_page
    renderChart()
  } catch (error) {
    console.error('Ошибка загрузки складских остатков:', error)
  }
}

const renderChart = () => {
  if (!chartRef.value) return
  if (chartInstance) chartInstance.destroy()

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const labels = stocks.value.map(s => {
    const article = (s.supplier_article || 'N/A').substring(0, 8)
    const size = (s.tech_size || 'N/A').substring(0, 4)
    return `Арт: ${article} / Р: ${size}`
  })

  const quantities = stocks.value.map(s => parseInt(s.quantity, 10) || 0)

  chartInstance = new Chart(ctx, {
    type: 'bar',
     data: {
      labels,
      datasets: [{
        label: 'Остаток на складе (шт)',
        data: quantities,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true
          }
        }
      }
    }
  })
}

watch(page, fetchData)

onMounted(() => {
  fetchData()
})
</script>
