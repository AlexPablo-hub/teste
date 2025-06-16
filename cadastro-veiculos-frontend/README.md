# Cadastro de Veículos - Frontend

Este projeto é uma aplicação frontend desenvolvida com Vue 3, Vite, Vuetify, Pinia, Vue Router e integração com Firebase. Ele serve como interface para cadastro e gerenciamento de veículos, com autenticação de usuários.

## Pré-requisitos
- Node.js (recomendado v16 ou superior)
- npm (geralmente instalado junto com o Node.js)

## Instalação
1. Clone o repositório ou baixe os arquivos do projeto.
2. No terminal, navegue até a pasta cadastro-veiculos-frontend .
3. Instale as dependências:
```
npm install
```
## Scripts Disponíveis
- npm run dev : Inicia o servidor de desenvolvimento (acesso geralmente em http://localhost:5173 ).
- npm run build : Gera a versão de produção do app na pasta dist .
- npm run preview : Visualiza localmente a build de produção.

## Estrutura do Projeto
- src/main.js : Ponto de entrada da aplicação. Inicializa Vue, Pinia (gerenciamento de estado), Vuetify (UI) e Vue Router.
- src/App.vue : Componente raiz. Renderiza a navegação entre páginas e verifica autenticação do usuário ao montar.
- src/router/ : Configura as rotas da aplicação.
- src/store/ : Armazena os módulos de estado (ex: autenticação).
- src/components/ : Componentes reutilizáveis da interface.
- src/views/ : Telas principais da aplicação.
- src/firebase.js : Configuração e integração com Firebase.

## Autenticação
O app utiliza um store de autenticação ( useAuthStore ) e integra com Firebase para login/logout. Ao acessar qualquer rota protegida sem estar autenticado, o usuário é redirecionado para /login .

## Tecnologias Utilizadas
- Vue 3
- Vite
- Vuetify 3
- Pinia
- Vue Router
- Firebase
- Axios

## Customização
- Para alterar configurações do Firebase, edite o arquivo src/firebase.js .
- Para adicionar novas rotas, edite src/router/index.js .
- Para novos módulos de estado, utilize src/store/ .

## Observações
- Certifique-se de configurar corretamente as variáveis de ambiente, caso utilize recursos do Firebase ou APIs externas.