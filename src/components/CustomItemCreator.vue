<script setup lang="ts">
import { ref } from 'vue'
import { useRoomStore } from '@/stores/room'
import type { CustomItem } from '@/stores/room'
import { useI18n } from 'vue-i18n'

const store = useRoomStore()
const {t} = useI18n()

const newItem = ref<CustomItem>({
  name: t('customItem'),
  group: t('custom'),
  color: '#949494',
  width: 1,
  height: 1,
  rotation: 0,
  labelPlacement: 'top',
  unit: 'meters',
  noColor: false,
})

function addCustomItem() {
  store.addCustomItem({ ...newItem.value })
}
</script>

<template>
  <div>
    <h2>{{ t('createCustomItem') }}</h2>
    <form @submit.prevent="addCustomItem" class="item-form">
      <label for="custom-name">{{ t('name') }}:</label>
      <input id="custom-name" type="text" v-model="newItem.name" />

      <label for="custom-group">{{ t('group') }}:</label>
      <input id="custom-group" type="text" v-model="newItem.group" />

      <label for="custom-color">{{ t('color') }}:</label>
      <input id="custom-color" type="color" v-model="newItem.color" />

      <label for="custom-width">{{ t('width') }}:</label>
      <input id="custom-width" type="number" step="0.1" v-model="newItem.width" />

      <label for="custom-height">{{ t('height') }}:</label>
      <input id="custom-height" type="number" step="0.1" v-model="newItem.height" />

      <label for="custom-rotation">{{ t('rotation') }}:</label>
      <input id="custom-rotation" type="number" step="0.01" v-model="newItem.rotation" />

      <label for="custom-labelPlacement">{{ t('labelPlacement') }}:</label>
      <select id="custom-labelPlacement" v-model="newItem.labelPlacement">
        <option value="top">{{ t('top') }}</option>
        <option value="right">{{ t('right') }}</option>
        <option value="bottom">{{ t('bottom') }}</option>
        <option value="left">{{ t('left') }}</option>
        <option value="inside">{{ t('inside') }}</option>
      </select>

      <label for="custom-noColor">{{ t('noColor') }}:</label>
      <input id="custom-noColor" type="checkbox" v-model="newItem.noColor" />

      <label for="custom-unit">{{ t('unit') }}:</label>
      <select id="custom-unit" v-model="newItem.unit">
        <option v-if="store.room.unit === 'meters'" value="meters">{{ t('meters') }}</option>
        <option v-if="store.room.unit === 'meters'" value="cm">{{ t('cm') }}</option>
        <option v-if="store.room.unit === 'feet'" value="feet">{{ t('feet') }}</option>
        <option v-if="store.room.unit === 'feet'" value="inches">{{ t('inches') }}</option>
      </select>

      <button type="submit">{{ t('add') }}</button>
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
