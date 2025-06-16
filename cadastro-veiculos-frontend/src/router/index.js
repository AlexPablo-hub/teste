import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicle/new',
    name: 'VehicleNew',
    component: () => import('@/views/VehicleForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicle/edit/:id',
    name: 'VehicleEdit',
    component: () => import('@/views/VehicleForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

let isInitialized = false;

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Inicializa apenas uma vez
  if (!isInitialized) {
    auth.initAuthListener();
    isInitialized = true;

    // Aguarda carregar dados do localStorage
    await new Promise((resolve) => setTimeout(resolve, 100)); // Pequeno delay opcional
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return next('/dashboard');
  }

  next();
});

export default router;
