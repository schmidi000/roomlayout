<script setup lang="ts">
import { ref } from 'vue'
import { useRoomStore, type CustomItem } from '@/stores/room'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const store = useRoomStore()
const router = useRouter()
const {t} = useI18n()

const width = ref(10)
const height = ref(10)
const unit = ref('meters')

const emit = defineEmits(['close'])

function createRoom() {
  store.setRoomDimensions(width.value, height.value, unit.value)
  store.addCustomItem({ name: t('bed'), group: t('floor'), color: '#CCFFCF', width: store.room.unit === 'meters' ? 1.8 : 5.9, height: store.room.unit === 'meters' ? 2 : 6.56, unit: store.room.unit === 'meters' ? 'meters' : 'feet', noColor: false } as CustomItem)
  store.addCustomItem({ name: t('desk'), group: t('floor'), color: '#FFF9B8', width: store.room.unit === 'meters' ? 1.6 : 5.2, height: store.room.unit === 'meters' ? 0.6 : 1.9, unit: store.room.unit === 'meters' ? 'meters' : 'feet', noColor: false } as CustomItem)
  router.push('/editor')
  emit('close')
}
</script>

<template>
  <div class="dialog-backdrop">
    <div class="dialog">
      <h2>{{ t('createRoom') }}</h2>
      <form @submit.prevent="createRoom" class="dialog-form">
        <label for="width">{{ t('width') }}:</label>
        <input id="width" type="number" step="0.01" v-model="width" />
        
        <label for="height">{{ t('height') }}:</label>
        <input id="height" type="number" step="0.1" v-model="height" />
        
        <label for="unit">{{ t('unit') }}:</label>
        <select id="unit" v-model="unit">
          <option value="meters">{{ t('meters') }}</option>
          <option value="feet">{{ t('feet') }}</option>
        </select>
        <button type="submit">{{ t('create') }}</button>
        <button @click="$emit('close')">{{ t('cancel') }}</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

.dialog-form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}
</style>
