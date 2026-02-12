<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">Vehicle Counter</h1>
        <div class="navbar-actions">
          <span class="user-greeting">Welcome, {{ name }}!</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>

    <div class="dashboard-content">
      <div class="dashboard-header">
        <h2>Dashboard</h2>
        <p>
          User: <strong>{{ name }}</strong>
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Trucks</h3>
          <img
            src="https://d266ikknpf76ju.cloudfront.net/assets/Resize/lg/1707051534164787100"
            class="vehicle-icon"
          />
          <div class="stat-content">
            <button class="minus-number" @click="decrementTrucks">-</button>
            <p class="stat-number">{{ truckCount }}</p>
            <button class="add-number" @click="incrementTrucks">+</button>
          </div>
        </div>
        <div class="stat-card">
          <h3>Padyak</h3>
          <img
            src="https://cdn-icons-png.freepik.com/256/2021/2021538.png?semt=ais_white_label"
            alt="Padyak Icon"
            class="vehicle-icon"
          />
          <div class="stat-content">
            <button class="minus-number" @click="decrementPadyak">-</button>
            <p class="stat-number">{{ padyakCount }}</p>
            <button class="add-number" @click="incrementPadyak">+</button>
          </div>
        </div>
        <div class="stat-card">
          <h3>Tricycle</h3>
          <img
            src="https://trykecorp.com/assets/img/Comp_Trike_Logo_B_0v2.png"
            alt="Tricycle Icon"
            class="vehicle-icon"
          />
          <div class="stat-content">
            <button class="minus-number" @click="decrementTricycle">-</button>
            <p class="stat-number">{{ tricycleCount }}</p>
            <button class="add-number" @click="incrementTricycle">+</button>
          </div>
        </div>
        <div class="stat-card">
          <h3>Motorcycle</h3>
          <img
            src="https://marketplace.canva.com/ViCC8/MAEXmYViCC8/1/tl/canva-green-motorcycle-illustration-MAEXmYViCC8.png"
            alt="Motorcycle Icon"
            class="vehicle-icon"
          />
          <div class="stat-content">
            <button class="minus-number" @click="decrementMotorcycle">-</button>
            <p class="stat-number">{{ motorcycleCount }}</p>
            <button class="add-number" @click="incrementMotorcycle">+</button>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="action-btn" @click="handleRegister">Register</button>
          <button class="action-btn" @click="goToSummary">Summary</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="DashboardView">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVehicleStore } from '@/stores/vehicle'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const vehicleStore = useVehicleStore()
const name = ref<string>('User')
const userId = ref<string>('')

// Vehicle counters
const truckCount = ref<number>(0)
const padyakCount = ref<number>(0)
const tricycleCount = ref<number>(0)
const motorcycleCount = ref<number>(0)

// Increment methods
const incrementTrucks = () => {
  truckCount.value++
}

const incrementPadyak = () => {
  padyakCount.value++
}

const incrementTricycle = () => {
  tricycleCount.value++
}

const incrementMotorcycle = () => {
  motorcycleCount.value++
}

// Decrement methods
const decrementTrucks = () => {
  if (truckCount.value > 0) truckCount.value--
}

const decrementPadyak = () => {
  if (padyakCount.value > 0) padyakCount.value--
}

const decrementTricycle = () => {
  if (tricycleCount.value > 0) tricycleCount.value--
}

const decrementMotorcycle = () => {
  if (motorcycleCount.value > 0) motorcycleCount.value--
}

// Register handler to save data
const handleRegister = async () => {
  try {
    // Register each vehicle type based on count
    if (truckCount.value > 0) {
      for (let i = 0; i < truckCount.value; i++) {
        await vehicleStore.registerVehicle(
          { type: 'Truck', model: `Truck-${i + 1}` },
          userId.value,
          name.value,
        )
      }
    }

    if (padyakCount.value > 0) {
      for (let i = 0; i < padyakCount.value; i++) {
        await vehicleStore.registerVehicle(
          { type: 'Padyak', model: `Padyak-${i + 1}` },
          userId.value,
          name.value,
        )
      }
    }

    if (tricycleCount.value > 0) {
      for (let i = 0; i < tricycleCount.value; i++) {
        await vehicleStore.registerVehicle(
          { type: 'Tricycle', model: `Tricycle-${i + 1}` },
          userId.value,
          name.value,
        )
      }
    }

    if (motorcycleCount.value > 0) {
      for (let i = 0; i < motorcycleCount.value; i++) {
        await vehicleStore.registerVehicle(
          { type: 'Motorcycle', model: `Motorcycle-${i + 1}` },
          userId.value,
          name.value,
        )
      }
    }

    // Reset counters after successful registration
    truckCount.value = 0
    padyakCount.value = 0
    tricycleCount.value = 0
    motorcycleCount.value = 0

    alert('Vehicles registered successfully!')
  } catch (error) {
    console.error('Error registering vehicles:', error)
    alert('Error registering vehicles. Please try again.')
  }
}

onMounted(() => {
  // Check if user is authenticated
  if (!authStore.checkAuth()) {
    // If not authenticated, redirect to login
    router.push('/loguser')
    return
  }

  // Get username and userId from query parameter or from auth store
  const queryname = route.query.user as string
  if (queryname) {
    name.value = decodeURIComponent(queryname)
  } else if (authStore.user?.name) {
    name.value = authStore.user.name
  }

  // Get userId for vehicle registration
  if (authStore.user?.id) {
    userId.value = authStore.user.id
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/loguser')
}

const goToSummary = () => {
  router.push('/summary')
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

.vehicle-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  max-width: 1200px;
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

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #333;
}

.dashboard-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.stat-number {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  min-width: 80px;
  text-align: center;
}

.add-number,
.minus-number {
  width: 40px;
  height: 40px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background 0.3s,
    color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-number:hover,
.minus-number:hover {
  background: #667eea;
  color: white;
}

.content-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section h3 {
  margin-top: 0;
  color: #333;
  font-size: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 15px;
  }

  .navbar-actions {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-content {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
