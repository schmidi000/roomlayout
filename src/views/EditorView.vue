<script setup lang="ts">
import RoomCanvas from '@/components/RoomCanvas.vue'
import SidePanel from '@/components/SidePanel.vue'
import { useRoomStore } from '@/stores/room'
import { ref, computed, type ComputedRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

const store = useRoomStore()
const {t} = useI18n()

const dividerPosition = ref(80)
const dragging = ref(false)
const leftPane = ref()
const rightPane = ref()

const { width: leftPaneWidth, height: leftPaneHeight } = useElementSize(leftPane)

function startDrag() {
  dragging.value = true
}

function stopDrag() {
  dragging.value = false
}

function onDrag(event: MouseEvent) {
  if (dragging.value) {
    dividerPosition.value = (event.clientX / window.innerWidth) * 100
  }
}

import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()

function saveRoom() {
  const data = JSON.stringify(store.room)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'room-layout.json'
  a.click()
  URL.revokeObjectURL(url)
}

function resetRoom() {
  store.reset()
  router.push('/')
}
</script>

<template>
  <div class="editor-view" @mousemove="onDrag" @mouseup="stopDrag">
    <div ref="leftPane" class="left-pane" :style="{ width: dividerPosition + '%' }">
      <RoomCanvas :parent-width="leftPaneWidth" :parent-height="leftPaneHeight" />
    </div>
    <div class="divider" @mousedown="startDrag"></div>
    <div ref="rightPane" class="right-pane" :style="{ width: (100 - dividerPosition) + '%' }">
      <SidePanel />
    </div>
    <button @click="saveRoom" class="save-button">{{ t('save') }}</button>
    <button @click="resetRoom" class="reset-button">{{ t('reset') }}</button>
  </div>
</template>

<style scoped>
.editor-view {
  display: flex;
  height: 100vh;
  position: relative;
}

.left-pane, .right-pane {
  height: 100%;
  overflow: auto;
}

.divider {
  width: 10px;
  height: 100%;
  cursor: col-resize;
  background-color: #ccc;
}

.save-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.reset-button {
  position: absolute;
  top: 10px;
  right: 80px;
}
</style>
