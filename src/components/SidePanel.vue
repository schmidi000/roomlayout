<script setup lang="ts">
import { useRoomStore } from '@/stores/room'
import { v4 as uuidv4 } from 'uuid'
import { computed } from 'vue'
import ItemEditor from './ItemEditor.vue'
import CustomItemCreator from './CustomItemCreator.vue'
import { useI18n } from 'vue-i18n'

const store = useRoomStore()
const {t} = useI18n()


const allItems = computed(() => {
  return store.room.customItems
})

const groupedItems = computed(() => {
  const groups: { [key: string]: any[] } = {}
  allItems.value.forEach(item => {
    if (!groups[item.group]) {
      groups[item.group] = []
    }
    groups[item.group].push(item)
  })
  return groups
})

function addItemToRoom(item: any) {
  store.addItem({
    ...item,
    id: uuidv4(),
    x: store.room.width / 2,
    y: store.room.height / 2,
    rotation: 0,
    labelPlacement: 'top'
  })
}
</script>

<template>
  <div class="side-panel">
    <ItemEditor v-if="store.room.selectedItemId" />
    <div v-else>
      <h2>{{ t('items') }}</h2>
      <div v-for="(group, groupName) in groupedItems" :key="groupName"  class="group">
        <h3>{{ groupName }}</h3>
        <ul>
          <li v-for="item in group" :key="item.name">
            <span @click="addItemToRoom(item)">{{ item.name }}</span>
            <button @click="store.removeCustomItem(item.name)">x</button>
          </li>
        </ul>
      </div>
      <hr />
      <CustomItemCreator />
    </div>
  </div>
</template>

<style scoped>
.side-panel {
  padding: 20px;
  border-left: 0px solid black;
}

li {
  cursor: pointer;
}

.group {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5em 1em;
  margin-bottom: 1em;
  background-color: #f9f9f9;
}

.group h3 {
  margin-top: 0;
  font-size: 1.2em;
  color: #333;
}

.group ul {
  list-style: none;
  padding-left: 0;
  margin: 0.5em 0 0 0;
}

.group li {
  padding: 0.5em;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.group li:last-child {
  border-bottom: none;
}

.group li:hover {
  background-color: #e0f0ff;
}

</style>
