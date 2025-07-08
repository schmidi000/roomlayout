<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoomStore } from '@/stores/room'
import type { RoomItem } from '@/stores/room'

interface Props {
  parentWidth?: number
  parentHeight?: number
}

const {parentWidth = 100, parentHeight = 100} = defineProps<Props>()

const store = useRoomStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const dragging = ref(false)
const scaling = ref(false)
const rotating = ref(false)
const dragItem = ref<RoomItem | null>(null)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)


function getConvertedValue(value: number, fromUnit: string, toUnit: string) {
  if (fromUnit === toUnit) {
    return value
  }
  if (fromUnit === 'meters' && toUnit === 'cm') {
    return value * 100
  }
  if (fromUnit === 'cm' && toUnit === 'meters') {
    return value / 100
  }
  if (fromUnit === 'feet' && toUnit === 'inches') {
    return value * 12
  }
  if (fromUnit === 'inches' && toUnit === 'feet') {
    return value / 12
  }
  return value
}

function draw() {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      let canvasWidth
      let canvasHeight
      if (parentWidth / parentHeight > store.room.width / store.room.height) {
          // Container is wider than canvas: scale based on height
          canvasHeight = parentHeight - 20;
          canvasWidth = parentHeight * (store.room.width / store.room.height);
      } else {
          // Container is taller than canvas: scale based on width
          canvasWidth = parentWidth;
          canvasHeight = parentWidth * (store.room.height / store.room.width);
      }
      
      canvas.value.width = canvasWidth
      canvas.value.height = canvasHeight

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      ctx.strokeRect(0, 0, canvasWidth, canvasHeight)

      // Draw items
      store.room.items.forEach(item => {
        const itemWidth = getConvertedValue(item.width, item.unit, store.room.unit)
        const itemHeight = getConvertedValue(item.height, item.unit, store.room.unit)

        const x = item.x * (canvasWidth / store.room.width)
        const y = item.y * (canvasHeight / store.room.height)
        const width = itemWidth * (canvasWidth / store.room.width)
        const height = itemHeight * (canvasHeight / store.room.height)

        ctx.save()
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate(item.rotation * Math.PI / 180)
        ctx.translate(-(x + width / 2), -(y + height / 2))

        if (item.noColor) {
          ctx.strokeStyle = 'black'
          ctx.strokeRect(x, y, width, height)
        } else {
          ctx.fillStyle = item.color
          ctx.fillRect(x, y, width, height)
        }
        
        if (item.id === store.room.selectedItemId) {
          ctx.strokeStyle = 'red'
          ctx.strokeRect(x, y, width, height)
          // Draw scaling and rotation handles
          ctx.fillStyle = 'red'
          ctx.fillRect(x + width - 12, y + height - 12, 12, 12)
          
          ctx.save()
          ctx.translate(x + width / 2, y + height / 2)
          ctx.rotate(-item.rotation * Math.PI / 180)
          ctx.font = '20px Arial'
          ctx.fillText('↻', 0, 0)
          ctx.restore()
        }
        
        ctx.restore()

        ctx.fillStyle = 'black'
        ctx.save()
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate(item.rotation * Math.PI / 180)
        let labelX = 0
        let labelY = 0
        switch (item.labelPlacement) {
          case 'top':
            labelX = 0
            labelY = -height / 2 - 5
            break
          case 'right':
            labelX = width / 2 + 5
            labelY = 0
            break
          case 'bottom':
            labelX = 0
            labelY = height / 2 + 15
            break
          case 'left':
            labelX = -width / 2 - ctx.measureText(item.name).width - 5
            labelY = 0
            break
          case 'inside':
            labelX = 0
            labelY = 0
            break
        }
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(item.name, labelX, labelY)
        ctx.restore()
      })
    }
  }
}

function handleMouseDown(event: MouseEvent) {
  if (canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const canvasWidth = canvas.value.width
    const canvasHeight = canvas.value.height

    let selectedItem: RoomItem | null = null
    for (let i = store.room.items.length - 1; i >= 0; i--) {
      const item = store.room.items[i]
      const itemWidth = getConvertedValue(item.width, item.unit, store.room.unit)
      const itemHeight = getConvertedValue(item.height, item.unit, store.room.unit)
      
      const itemX = item.x * (canvasWidth / store.room.width)
      const itemY = item.y * (canvasHeight / store.room.height)
      const width = itemWidth * (canvasWidth / store.room.width)
      const height = itemHeight * (canvasHeight / store.room.height)

      const angle = -item.rotation * Math.PI / 180
      const rotatedX = (x - (itemX + width / 2)) * Math.cos(angle) - (y - (itemY + height / 2)) * Math.sin(angle) + (itemX + width / 2)
      const rotatedY = (x - (itemX + width / 2)) * Math.sin(angle) + (y - (itemY + height / 2)) * Math.cos(angle) + (itemY + height / 2)

      if (rotatedX >= itemX && rotatedX <= itemX + width && rotatedY >= itemY && rotatedY <= itemY + height) {
        selectedItem = item
        break
      }
    }

    if (selectedItem) {
      store.selectItem(selectedItem.id)
      const itemWidth = getConvertedValue(selectedItem.width, selectedItem.unit, store.room.unit)
      const itemHeight = getConvertedValue(selectedItem.height, selectedItem.unit, store.room.unit)
      
      const itemX = selectedItem.x * (canvasWidth / store.room.width)
      const itemY = selectedItem.y * (canvasHeight / store.room.height)
      const width = itemWidth * (canvasWidth / store.room.width)
      const height = itemHeight * (canvasHeight / store.room.height)

      const angle = -selectedItem.rotation * Math.PI / 180
      const rotatedX = (x - (itemX + width / 2)) * Math.cos(angle) - (y - (itemY + height / 2)) * Math.sin(angle) + (itemX + width / 2)
      const rotatedY = (x - (itemX + width / 2)) * Math.sin(angle) + (y - (itemY + height / 2)) * Math.cos(angle) + (itemY + height / 2)

      if (rotatedX >= itemX + width - 12 && rotatedY >= itemY + height - 12) {
        scaling.value = true
      } else if (Math.sqrt((rotatedX - (itemX + width / 2)) ** 2 + (rotatedY - (itemY + height / 2)) ** 2) <= 10) {
        rotating.value = true
      } else {
        dragging.value = true
      }
      
      dragItem.value = selectedItem
      dragOffsetX.value = x - itemX
      dragOffsetY.value = y - itemY
    } else {
      store.selectItem(null)
    }
  }
}

function handleMouseMove(event: MouseEvent) {
  if (dragItem.value && canvas.value) {
    const rect = canvas.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const canvasWidth = canvas.value.width
    const canvasHeight = canvas.value.height

    if (dragging.value) {
      let newX = (x - dragOffsetX.value) / (canvasWidth / store.room.width)
      let newY = (y - dragOffsetY.value) / (canvasHeight / store.room.height)

      if (newX < 0) newX = 0
      if (newY < 0) newY = 0
      if (newX + dragItem.value.width > store.room.width) newX = store.room.width - dragItem.value.width
      if (newY + dragItem.value.height > store.room.height) newY = store.room.height - dragItem.value.height

      store.updateItem({
        ...dragItem.value,
        x: newX,
        y: newY
      })
    } else if (scaling.value) {
      const itemX = dragItem.value.x * (canvasWidth / store.room.width)
      const itemY = dragItem.value.y * (canvasHeight / store.room.height)
      const newWidth = (x - itemX) / (canvasWidth / store.room.width)
      const newHeight = (y - itemY) / (canvasHeight / store.room.height)
      store.updateItem({
        ...dragItem.value,
        width: newWidth > 0 ? newWidth : 0,
        height: newHeight > 0 ? newHeight : 0
      })
    } else if (rotating.value) {
      const itemX = dragItem.value.x * (canvasWidth / store.room.width)
      const itemY = dragItem.value.y * (canvasHeight / store.room.height)
      const itemWidth = getConvertedValue(dragItem.value.width, dragItem.value.unit, store.room.unit) * (canvasWidth / store.room.width)
      const itemHeight = getConvertedValue(dragItem.value.height, dragItem.value.unit, store.room.unit) * (canvasHeight / store.room.height)
      const angle = Math.atan2(y - (itemY + itemHeight / 2), x - (itemX + itemWidth / 2))
      store.updateItem({
        ...dragItem.value,
        rotation: angle * 180 / Math.PI
      })
    }
  }
}

function handleMouseUp() {
  dragging.value = false
  scaling.value = false
  rotating.value = false
  dragItem.value = null
}

onMounted(draw)
watch(() => store.room, draw, { deep: true })
watch([() => parentHeight, () => parentWidth], draw)

</script>

<template>
  <div>
    <canvas 
      ref="canvas" 
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    ></canvas>
  </div>
</template>

<style scoped>
canvas {
  border: 1px solid black;
  cursor: grab;
  background-color: white;
}
</style>
