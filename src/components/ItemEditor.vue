<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoomStore } from '@/stores/room'
import type { RoomItem } from '@/stores/room'
import { useI18n } from 'vue-i18n'

const store = useRoomStore()
const {t} = useI18n()

const selectedItem = computed(() => {
  return store.room.items.find(item => item.id === store.room.selectedItemId)
})

const editableItem = ref<RoomItem | null>(null)

watch(selectedItem, (newItem) => {
  if (newItem) {
    editableItem.value = { ...newItem }
  } else {
    editableItem.value = null
  }
}, { immediate: true })

function updateItem() {
  if (editableItem.value) {
    store.updateItem(editableItem.value)
  }
}

function deleteItem() {
  if (editableItem.value) {
    store.removeItem(editableItem.value.id)
    store.selectItem(null)
  }
}
</script>

<template>
  <div v-if="editableItem">
    <h2>{{ t('editItem') }}</h2>
    <form @submit.prevent="updateItem" class="item-form">
      <label for="name">{{ t('name') }}:</label>
      <input id="name" type="text" v-model="editableItem.name" />
      
      <label for="group">{{ t('group') }}:</label>
      <input id="group" type="text" v-model="editableItem.group" />

      <label for="color">{{ t('color') }}:</label>
      <input id="color" type="color" v-model="editableItem.color" />

      <label for="width">{{ t('width') }}:</label>
      <input id="width" type="number" step="0.1" v-model="editableItem.width" />

      <label for="height">{{ t('height') }}:</label>
      <input id="height" type="number" step="0.1" v-model="editableItem.height" />

      <label for="rotation">{{ t('rotation') }}:</label>
      <input id="rotation" type="number" step="0.01" v-model="editableItem.rotation" />

      <label for="labelPlacement">{{ t('labelPlacement') }}:</label>
      <select id="labelPlacement" v-model="editableItem.labelPlacement">
        <option value="top">{{ t('top') }}</option>
        <option value="right">{{ t('right') }}</option>
        <option value="bottom">{{ t('bottom') }}</option>
        <option value="left">{{ t('left') }}</option>
        <option value="inside">{{ t('inside') }}</option>
      </select>

      <label for="noColor">{{ t('noColor') }}:</label>
      <input id="noColor" type="checkbox" v-model="editableItem.noColor" />

      <label for="unit">{{ t('unit') }}:</label>
      <select id="unit" v-model="editableItem.unit">
        <option v-if="store.room.unit === 'meters'" value="meters">{{ t('meters') }}</option>
        <option v-if="store.room.unit === 'meters'" value="cm">{{ t('cm') }}</option>
        <option v-if="store.room.unit === 'feet'" value="feet">{{ t('feet') }}</option>
        <option v-if="store.room.unit === 'feet'" value="inches">{{ t('inches') }}</option>
      </select>

      <div>
        <button type="submit">{{ t('save') }}</button>
        <button @click="store.selectItem(null)">{{ t('back') }}</button>
        <button @click="deleteItem">{{ t('delete') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.item-form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}
</style>
