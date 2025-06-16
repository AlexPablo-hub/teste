<template>
  <v-card 
    class="mb-4 vehicle-card" 
    elevation="6" 
    rounded="xl"
    hover
    @click="$emit('edit', vehicle)"
  >
    <!-- Header with gradient -->
    <div class="card-header pa-4">
      <div class="d-flex justify-space-between align-center">
        <div>
          <h3 class="text-h5 font-weight-bold text-white mb-1">
            {{ vehicle.modelo }}
          </h3>
          <div class="text-body-1 text-white opacity-90">
            {{ vehicle.marca }} • {{ vehicle.ano }}
          </div>
        </div>
        <v-chip 
          :color="getTypeColor(vehicle.tipo)" 
          size="small" 
          variant="elevated"
          class="font-weight-bold"
        >
          {{ vehicle.tipo }}
        </v-chip>
      </div>
    </div>

    <v-card-text class="pa-4">
      <v-row class="mb-3">
        <v-col cols="6" class="py-1">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-2">mdi-palette</v-icon>
            <div>
              <div class="text-caption text-grey">Cor</div>
              <div class="font-weight-medium">{{ vehicle.cor || 'N/A' }}</div>
            </div>
          </div>
        </v-col>
        <v-col cols="6" class="py-1">
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-2">mdi-card-text</v-icon>
            <div>
              <div class="text-caption text-grey">Placa</div>
              <div class="font-weight-medium">{{ vehicle.placa || 'N/A' }}</div>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-3"></v-divider>

      <div class="d-flex align-center justify-center">
        <v-icon color="green" size="24" class="mr-2">mdi-cash</v-icon>
        <div class="text-h5 font-weight-bold text-green">
          R$ {{ formatCurrency(vehicle.valor) }}
        </div>
      </div>

      <div v-if="vehicle.observacoes" class="mt-3">
        <div class="text-caption text-grey mb-1">Observações</div>
        <div class="text-body-2">{{ vehicle.observacoes }}</div>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-spacer />
      <v-btn 
        color="primary" 
        variant="outlined"
        @click.stop="$emit('edit', vehicle)"
        class="mr-2"
      >
        <v-icon left>mdi-pencil</v-icon>
        Editar
      </v-btn>
      <v-btn 
        color="red-darken-1" 
        variant="outlined"
        @click.stop="$emit('delete', vehicle.id)"
      >
        <v-icon left>mdi-delete</v-icon>
        Excluir
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  vehicle: Object,
});

const getTypeColor = (tipo) => {
  const colors = {
    'Carro': 'blue',
    'Moto': 'orange',
    'Caminhão': 'purple',
    'Van': 'teal',
    'SUV': 'indigo'
  };
  return colors[tipo] || 'grey';
};

const formatCurrency = (value) => {
  if (!value) return '0,00';
  return new Intl.NumberFormat('pt-BR').format(value);
};
</script>

<style scoped>
.vehicle-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card-header {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}
</style>
