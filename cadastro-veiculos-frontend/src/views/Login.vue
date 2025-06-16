<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">
          <v-col
            cols="12"
            md="6"
            class="d-flex flex-column justify-center align-center pa-8"
          >
            <v-card class="pa-8 elevation-12" max-width="400" width="100%" rounded="xl">
              <div class="text-center mb-8">
                <v-icon size="64" color="primary" class="mb-4">mdi-car-key</v-icon>
                <h2 class="text-h4 font-weight-bold text-primary mb-2">
                  Bem-vindo!
                </h2>
                <p class="text-h6 text-grey">
                  Faça login para acessar o sistema
                </p>
              </div>

              <v-btn 
                color="primary" 
                size="x-large"
                block
                elevation="2"
                @click="login"
                class="font-weight-bold py-4"
              >
                <v-icon left size="24">mdi-google</v-icon>
                Entrar com Google
              </v-btn>

              <v-divider class="my-6"></v-divider>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script setup>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

async function login() {
  await auth.loginWithGoogle();
  router.push('/dashboard');
}
</script>