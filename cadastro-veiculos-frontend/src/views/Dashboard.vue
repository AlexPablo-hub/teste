<template>
  <v-app>
    <!-- AppBar embutida -->
    <v-app-bar app  height="80">
      <v-container>
        <v-row align="center" justify="space-between" class="fill-height">

          <!-- FOTO + NOME -->
          <v-col cols="auto" class="d-flex align-center gap-3">
            <v-avatar v-if="auth.backendUser?.foto_url" size="40">
              <v-img :src="auth.backendUser.foto_url" cover />
            </v-avatar>
            <span class="text-subtitle-1 font-weight-medium">
              {{ auth.backendUser?.nome }}
            </span>
          </v-col>

          <!-- TÍTULO -->
          <v-col class="text-center">
            <h1 class="text-h5 font-weight-bold mb-0">Sistema de Veículos</h1>
          </v-col>

          <!-- BOTÃO SAIR -->
          <v-col cols="auto" class="d-flex justify-end">
            <v-btn color="error" @click="logout" class="text-body-2 font-weight-bold">
              SAIR
            </v-btn>
          </v-col>

        </v-row>
      </v-container>
    </v-app-bar>


    <!-- Main content -->
    <v-main style="padding-top: 80px">
      <div v-if="loading" class="d-flex justify-center align-center" style="height: 50vh;">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <v-container v-else fluid class="pa-6">
        <!-- Header Section -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon size="40" class="mr-3">mdi-garage</v-icon>
              Meus Veículos
            </h1>
            <p class="text-h6 text-grey-en-1">
              {{ vehicles.length }} veículo{{ vehicles.length !== 1 ? 's' : '' }} cadastrado{{ vehicles.length !== 1 ?
              's' : '' }}
            </p>
          </div>
          <v-btn color="primary" size="large" elevation="4" to="/vehicle/new" class="px-8 font-weight-bold">
            <v-icon left>mdi-plus</v-icon>
            Adicionar Veículo
          </v-btn>
        </div>

        <!-- Vehicles Grid -->
        <v-row v-if="vehicles.length > 0">
          <v-col v-for="v in vehicles" :key="v.id" cols="12" sm="6" lg="4" xl="3">
            <VehicleCard :vehicle="v" @edit="editVehicle" @delete="deleteVehicle" />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-card v-else class="text-center pa-12 elevation-2" rounded="xl">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-car-off</v-icon>
          <h2 class="text-h4 font-weight-bold mb-4 text-grey-en-1">
            Nenhum veículo cadastrado
          </h2>
          <p class="text-h6 text-grey mb-6">
            Comece adicionando seu primeiro veículo
          </p>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import VehicleCard from '@/components/VehicleCard.vue';

const vehicles = ref([]);
const loading = ref(true);
const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push('/login');
    return;
  }

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    vehicles.value = res.data.data.vehicles;
    console.log('Veículos carregados:', vehicles.value);
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
  } finally {
    loading.value = false;
  }
});

const editVehicle = (vehicle) => {
  router.push(`/vehicle/edit/${vehicle.id}`);
};

const deleteVehicle = async (vehicleId) => {
  if (confirm('Tem certeza que deseja excluir este veículo?')) {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      vehicles.value = vehicles.value.filter(v => v.id !== vehicleId);
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
    }
  }
};

function logout() {
  auth.logout();
  router.push('/login');
}
</script>