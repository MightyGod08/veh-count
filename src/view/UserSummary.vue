<template>
  <div class="summary-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">Vehicle Counter</h1>
        <div class="navbar-actions">
          <span class="user-greeting">Welcome, {{ userName }}!</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>

    <div class="summary-content">
      <div class="summary-header">
        <h2>Vehicle Summary Report</h2>
        <button @click="goToDashboard" class="back-btn">Back to Dashboard</button>
      </div>

      <!-- User-wise Vehicle Count -->
      <div class="summary-section">
        <h3>Vehicle Count Per User</h3>
        <div class="table-wrapper">
          <table class="user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Total Vehicles</th>
                <th>Trucks</th>
                <th>Padyak</th>
                <th>Tricycle</th>
                <th>Motorcycle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="userSummary.length === 0">
                <td colspan="6" class="no-data">No user data available</td>
              </tr>
              <tr v-for="user in userSummary" :key="user.userId">
                <td>
                  <strong>{{ user.userName || user.userId }}</strong>
                </td>
                <td class="total-value">{{ user.total }}</td>
                <td>{{ user.trucks }}</td>
                <td>{{ user.padyak }}</td>
                <td>{{ user.tricycle }}</td>
                <td>{{ user.motorcycle }}</td>
              </tr>
              <tr class="totals-row" v-if="userSummary.length > 0">
                <td><strong>Grand Total</strong></td>
                <td class="total-value">
                  <strong>{{ totalVehicles }}</strong>
                </td>
                <td>
                  <strong>{{ countByType('Truck') }}</strong>
                </td>
                <td>
                  <strong>{{ countByType('Padyak') }}</strong>
                </td>
                <td>
                  <strong>{{ countByType('Tricycle') }}</strong>
                </td>
                <td>
                  <strong>{{ countByType('Motorcycle') }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button @click="resetData" class="reset-btn">Reset All Data</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserSummaryView">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVehicleStore } from '@/stores/vehicle'

const router = useRouter()
const authStore = useAuthStore()
const vehicleStore = useVehicleStore()

const userName = ref<string>('User')

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.checkAuth()) {
    router.push('/loguser')
    return
  }

  // Load vehicles from localStorage
  vehicleStore.loadVehicles()

  // Get username from auth store
  if (authStore.user?.name) {
    userName.value = authStore.user.name
  }
})

// Computed properties
const vehicles = computed(() => vehicleStore.vehicles)

const totalVehicles = computed(() => vehicles.value.length)

// Count vehicles by type
const countByType = (type: string): number => {
  return vehicles.value.filter((v) => v.type === type).length
}

// User summary data
const userSummary = computed(() => {
  const users: {
    [key: string]: {
      userId: string
      userName: string
      total: number
      trucks: number
      padyak: number
      tricycle: number
      motorcycle: number
    }
  } = {}

  vehicles.value.forEach((vehicle) => {
    const key =
      vehicle.userName && vehicle.userName.trim() !== '' ? vehicle.userName : vehicle.userId
    if (!users[key]) {
      users[key] = {
        userId: vehicle.userId,
        userName: vehicle.userName || vehicle.userId,
        total: 0,
        trucks: 0,
        padyak: 0,
        tricycle: 0,
        motorcycle: 0,
      }
    }

    const userRecord = users[key]
    if (userRecord) {
      userRecord.total++
      switch (vehicle.type) {
        case 'Truck':
          userRecord.trucks++
          break
        case 'Padyak':
          userRecord.padyak++
          break
        case 'Tricycle':
          userRecord.tricycle++
          break
        case 'Motorcycle':
          userRecord.motorcycle++
          break
      }
    }
  })

  return Object.values(users)
})

// Navigation handlers
const goToDashboard = () => {
  router.push('/dashboard')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/loguser')
}

const resetData = () => {
  if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
    vehicleStore.resetVehicles()
    alert('All data has been reset.')
  }
}
</script>

<style scoped>
.summary-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navbar-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-greeting {
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.summary-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.summary-header h2 {
  margin: 0;
  font-size: 32px;
  color: #333;
}

.back-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

.summary-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.summary-section h3 {
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 20px;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.count-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.count-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f7 100%);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.count-card h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
}

.count-value {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
}

.total-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.total-card h4 {
  color: white;
}

.total-card .count-value {
  color: white;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 4px;
}

.vehicle-table,
.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.vehicle-table thead,
.user-table thead {
  background: #f5f5f5;
}

.vehicle-table th,
.user-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.vehicle-table td,
.user-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.vehicle-table tbody tr:hover {
  background: #f9f9f9;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 30px 15px !important;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-truck {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-padyak {
  background: #f3e5f5;
  color: #7b1fa2;
}

.badge-tricycle {
  background: #e8f5e9;
  color: #388e3c;
}

.badge-motorcycle {
  background: #fff3e0;
  color: #f57c00;
}

.delete-btn {
  padding: 6px 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover {
  background: #da190b;
  transform: scale(1.05);
}

.delete-btn:active {
  transform: scale(0.98);
}

.total-value {
  font-weight: 600;
  color: #667eea;
}

.totals-row {
  background: #f5f5f5;
  font-weight: 600;
  border-top: 2px solid #667eea;
}

.totals-row td {
  padding: 15px;
  color: #333;
}

@media (max-width: 768px) {
  .summary-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .summary-header h2 {
    font-size: 24px;
  }

  .back-btn {
    width: 100%;
  }

  .count-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .vehicle-table,
  .user-table {
    font-size: 12px;
  }

  .vehicle-table th,
  .vehicle-table td,
  .user-table th,
  .user-table td {
    padding: 8px;
  }

  .navbar-content {
    flex-direction: column;
    gap: 15px;
  }

  .navbar-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
