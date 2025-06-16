<template>
  <v-container class="pa-6 d-flex justify-center">
    <v-card class="elevation-8" max-width="720" width="100%" rounded="xl">
      <v-card-title class="text-h5 font-weight-bold pa-6 bg-gradient-primary white--text">
        <v-icon left size="28" class="mr-3">mdi-car-plus</v-icon>
        {{ isEditing ? 'Editar Veículo' : 'Cadastrar Novo Veículo' }}
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="handleSubmit">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-select
                v-model="vehicle.tipo"
                :items="['carro', 'moto']"
                label="Tipo do Veículo"
                prepend-inner-icon="mdi-car-info"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vehicle.marca"
                label="Marca"
                prepend-inner-icon="mdi-tag"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>

            <v-col cols="12" sm="8">
              <v-text-field
                v-model="vehicle.modelo"
                label="Modelo"
                prepend-inner-icon="mdi-car-side"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="vehicle.ano"
                label="Ano"
                type="number"
                prepend-inner-icon="mdi-calendar"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vehicle.cor"
                label="Cor"
                prepend-inner-icon="mdi-palette"
                variant="outlined"
                color="primary"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vehicle.placa"
                label="Placa"
                prepend-inner-icon="mdi-card-text"
                variant="outlined"
                color="primary"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="vehicle.valor"
                label="Valor"
                prepend-inner-icon="mdi-cash"
                prefix="R$"
                variant="outlined"
                color="primary"
                type="number"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="vehicle.observacoes"
                label="Observações"
                prepend-inner-icon="mdi-note-text"
                variant="outlined"
                color="primary"
                rows="3"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-end gap-3 mt-4">
            <v-btn color="grey" variant="outlined" size="large" @click="$router.push('/')">
              <v-icon left>mdi-arrow-left</v-icon>
              Cancelar
            </v-btn>
            <v-btn type="submit" color="primary" size="large" class="font-weight-bold" elevation="2">
              <v-icon left>{{ isEditing ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
              {{ isEditing ? 'Atualizar' : 'Cadastrar' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
const auth = useAuthStore();
import api from '@/utils/api';

const route = useRoute();
const router = useRouter();
const isEditing = !!route.params.id;
const vehicle = ref({
  tipo: '', marca: '', modelo: '', ano: '', cor: '', placa: '',
  valor: '', observacoes: ''
});

onMounted(async () => {
  if (isEditing) {
    try {
      const res = await api.get(`/api/vehicles/${route.params.id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const v = res.data.data;

      vehicle.value = {
        tipo: v.tipo || '',
        marca: v.marca || '',
        modelo: v.modelo || '',
        ano: Number(v.ano) || '',
        cor: v.cor || '',
        placa: v.placa || '',
        valor: parseFloat(v.valor) * 100 || '',
        observacoes: v.observacoes || ''
      };
    } catch (err) {
      console.error('Erro ao carregar veículo:', err);
      alert('Erro ao carregar veículo para edição');
      router.push('/');
    }
  }
});

const handleSubmit = async () => {
  try {
    const data = {
      ...vehicle.value,
      ano: Number(vehicle.value.ano),
      valor: parseFloat((vehicle.value.valor / 100).toFixed(2)),
    };

    if (isEditing) {
      await api.put(`/api/vehicles/${route.params.id}`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
    } else {
      await api.post('/api/vehicles', data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
    }

    router.push('/');
  } catch (error) {
    console.error('Erro ao salvar veículo:', error);
    alert(error?.response?.data?.error || 'Erro ao salvar veículo');
  }
};
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}
</style>