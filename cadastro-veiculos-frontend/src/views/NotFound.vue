<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex align-center justify-center">
        <div class="text-center">
          <v-icon size="120" color="grey-lighten-1" class="mb-6">mdi-car-off</v-icon>
          <h1 class="text-h2 font-weight-bold text-grey-darken-2 mb-4">404</h1>
          <h2 class="text-h4 font-weight-medium text-grey-darken-1 mb-6">
            Página não encontrada
          </h2>
          <p class="text-h6 text-grey mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div class="d-flex gap-4 justify-center">
            <v-btn 
              color="primary" 
              size="large" 
              to="/dashboard" 
              class="px-8"
            >
              <v-icon left>mdi-home</v-icon>
              Voltar ao Início
            </v-btn>
            <v-btn 
              color="grey" 
              variant="outlined" 
              size="large" 
              @click="$router.go(-1)"
              class="px-8"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Página Anterior
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>