<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

const {t} = useI18n()
const router = useRouter()
</script>
<template>
  <div>
    <button @click="router.push('/')">{{t('home')}}</button>
    <h1>{{t('about')}}</h1>
    <p>{{t('aboutParagraph')}}</p>
  </div>
</template>
