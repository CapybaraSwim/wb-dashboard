<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex space-x-6">
          <router-link
            to="/sales"
            class="nav-link"
            active-class="nav-link--active"
          >
            Продажи
          </router-link>
          <router-link
            to="/orders"
            class="nav-link"
            active-class="nav-link--active"
          >
            Заказы
          </router-link>
          <router-link
            to="/incomes"
            class="nav-link"
            active-class="nav-link--active"
          >
            Доходы
          </router-link>
          <router-link
            to="/stocks"
            class="nav-link"
            active-class="nav-link--active"
          >
            Склады
          </router-link>
        </div>
      </div>
    </nav>

    <main class="py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.nav-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #4b5563; /* gray-700 */
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    color: #2563eb; /* blue-600 */
    background-color: #dbeafe; /* blue-100 */
  }
}

.nav-link--active {
  color: #1d4ed8; /* blue-700 */
  background-color: #dbeafe; /* blue-100 */
  font-weight: 600;
}
</style>