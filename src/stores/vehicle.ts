import { defineStore } from 'pinia'

interface Vehicle {
  id: string
  type: string
  model: string
  userId: string
  userName?: string
  registeredAt: string
}

interface VehicleData {
  type: string
  model: string
}

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [] as Vehicle[],
  }),

  getters: {
    getVehiclesByUser: (state) => (userId: string) => {
      return state.vehicles.filter((vehicle) => vehicle.userId === userId)
    },

    getTotalVehicles: (state) => state.vehicles.length,
  },

  actions: {
    // Register a new vehicle
    async registerVehicle(vehicleData: VehicleData, userId: string, userName?: string) {
      try {
        const newVehicle: Vehicle = {
          id: 'vehicle-' + Date.now(),
          type: vehicleData.type,
          model: vehicleData.model,
          userId: userId,
          userName: userName || '',
          registeredAt: new Date().toISOString(),
        }

        this.vehicles.push(newVehicle)

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('vehicles', JSON.stringify(this.vehicles))
        }

        return newVehicle
      } catch (error) {
        console.error('Vehicle registration failed:', error)
        throw error
      }
    },

    // Load vehicles from localStorage
    loadVehicles() {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('vehicles')
        if (stored) {
          this.vehicles = JSON.parse(stored)
        }
      }
    },

    resetVehicles() {
      this.vehicles = []
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('vehicles')
      }
    },
  },
})
