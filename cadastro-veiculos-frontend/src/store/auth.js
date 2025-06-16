import { defineStore } from 'pinia';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    backendUser: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.backendUser,
  },

  actions: {
    async loginWithGoogle() {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const token = await firebaseUser.getIdToken();

      this.user = firebaseUser;
      this.token = token;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('user', JSON.stringify(firebaseUser));
      localStorage.setItem('token', token);

      console.log("🌐 API URL:", import.meta.env.VITE_API_BASE_URL);
      console.log("🔐 Token enviado:", token);
      console.log("➡️ Enviando requisição para /api/users/profile...");

      await this.fetchUserProfile();
    },

    async fetchUserProfile() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`);
    this.backendUser = response.data.data;

    console.log("✅ Perfil do backend recebido:", this.backendUser);
    console.log("🖼️ Foto de perfil recebida (backendUser.foto_url):", this.backendUser?.foto_url);

    localStorage.setItem('backendUser', JSON.stringify(this.backendUser));
  } catch (error) {
    console.error("❌ Erro ao buscar dados do usuário:", error);
    throw error;
  }
},

    async logout() {
      await signOut(auth);
      this.user = null;
      this.token = null;
      this.backendUser = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('backendUser');
      window.location.href = '/login';
    },

    initAuthListener() {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      const savedBackendUser = localStorage.getItem('backendUser');

      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser);
        this.token = savedToken;
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        if (savedBackendUser) {
          this.backendUser = JSON.parse(savedBackendUser);
        }
      }

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.user = user;
          this.token = await user.getIdToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', this.token);

          try {
            await this.fetchUserProfile();
          } catch (error) {
            console.error("Erro ao buscar perfil no initAuthListener:", error);
          }
        } else {
          this.user = null;
          this.token = null;
          this.backendUser = null;
          localStorage.clear();
        }
      });
    }
  }
});
