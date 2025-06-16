<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  auth.initAuthListener();
  
  if (!auth.isAuthenticated && router.currentRoute.value.path !== '/login') {
    router.push('/login');
  }
});
</script>