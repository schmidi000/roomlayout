<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

const {t} = useI18n()
const router = useRouter()
</script>
<template>
  <div>
    <button @click="router.push('/')">{{t('home')}}</button>
    <h1>{{ t('contact') }}</h1>
    <p v-html="t('contactParagraph')"></p>
  </div>
</template>
