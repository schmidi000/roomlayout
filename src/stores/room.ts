import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface RoomItem {
  id: string
  name: string
  group: string
  color: string
  width: number
  height: number
  x: number
  y: number
  rotation: number
  labelPlacement: 'top' | 'right' | 'bottom' | 'left' | 'inside'
  unit: 'meters' | 'cm' | 'feet' | 'inches'
  noColor: boolean
}

export interface CustomItem {
  name: string
  group: string
  color: string
  width: number
  height: number
  rotation: number
  labelPlacement: 'top' | 'right' | 'bottom' | 'left' | 'inside'
  unit: 'meters' | 'cm' | 'feet' | 'inches'
  noColor: boolean
}

interface RoomState {
  width: number
  height: number
  unit: string
  items: RoomItem[]
  customItems: CustomItem[]
  selectedItemId: string | null
}

export const useRoomStore = defineStore('room', {
  state: () => ({
    room: useStorage<RoomState>('room', {
      width: 0,
      height: 0,
      unit: 'meters',
      items: [],
      customItems: [
        
      ],
      selectedItemId: null
    })
  }),
  actions: {
    setRoomDimensions(width: number, height: number, unit: string) {
      this.room.width = width
      this.room.height = height
      this.room.unit = unit
    },
    addItem(item: RoomItem) {
      this.room.items.push(item)
    },
    updateItem(item: RoomItem) {
      const index = this.room.items.findIndex((i) => i.id === item.id)
      if (index !== -1) {
        this.room.items[index] = item
      }
    },
    addCustomItem(item: CustomItem) {
      this.room.customItems.push(item)
    },
    selectItem(id: string | null) {
      this.room.selectedItemId = id
    },
    removeItem(id: string) {
      this.room.items = this.room.items.filter(item => item.id !== id)
    },
    removeCustomItem(name: string) {
      this.room.customItems = this.room.customItems.filter(item => item.name !== name)
    },
    reset() {
      this.room = {
        width: 0,
        height: 0,
        unit: 'meters',
        items: [],
        customItems: [],
        selectedItemId: null
      }
    }
  }
})
