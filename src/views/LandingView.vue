<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CreateRoomDialog from '@/components/CreateRoomDialog.vue'
import { useRoomStore } from '@/stores/room'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const showDialog = ref(false)
const route = useRoute()
const {t} = useI18n()

const store = useRoomStore()
const router = useRouter()

function loadRoom() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const data = JSON.parse(event.target.result as string)
          store.$patch({ room: data })
          router.push('/editor')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}
</script>

<template>
  <div class="landing-page">
    <div class="background">
      <div v-for="n in 20" :key="n" class="rect" :style="{
        top: Math.random() * 100 + 'vh',
        left: Math.random() * 100 + 'vw',
        width: Math.random() * 100 + 50 + 'px',
        height: Math.random() * 100 + 50 + 'px',
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        animationDuration: (Math.random() * 10 + 10) + 's'
      }"></div>
    </div>
    <div class="content">
      <div class="main-box">
        <h1>{{ t('createRoom') }}</h1>
        <button @click="showDialog = true">{{ t('createRoom') }}</button>
        <button @click="loadRoom">{{ t('loadRoom') }}</button>
      </div>
      <footer>
        <router-link to="/about">{{ t('about') }}</router-link>
        <router-link to="/contact">{{ t('contact') }}</router-link>
        <span>{{ t('copyright', {year: (new Date()).getFullYear() }) }}</span>
      </footer>
    </div>
    <CreateRoomDialog v-if="showDialog" @close="showDialog = false" />
  </div>
</template>

<style scoped>
.landing-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(10px);
}

@keyframes rotate {
  from {
    transform: rotate(0deg) translateX(200px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(200px) rotate(-360deg);
  }
}

.rect {
  position: absolute;
  animation: rotate 20s linear infinite;
  transform-origin: center center;
}

.content {
  z-index: 1;
  text-align: center;
}

.main-box {
  border: 2px solid black;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

footer {
  margin-top: 20px;
}

footer a {
  margin-right: 20px;
}
</style>
