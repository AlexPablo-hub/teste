## Sistema de Cadastro de Veículos

Backend API para cadastro e gerenciamento de veículos (carros e motos) com autenticação Firebase.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **Firebase Authentication** - Autenticação de usuários
- **mysql2** - Driver MySQL para Node.js
- **firebase-admin** - SDK do Firebase para backend

## 📋 Pré-requisitos

- Node.js 16+ instalado
- MySQL 8.0+ instalado e configurado
- Projeto Firebase configurado
- Chaves de serviço do Firebase

## 🚀 Instalação e Configuração

### 1. Clone o repositório e instale as dependências

```bash
git clone 
cd cadastro-veiculos-backend
npm install
```

### 2. Configure o banco de dados MySQL

Execute o script SQL fornecido no arquivo `database.sql` para criar o banco de dados e tabelas:

```sql
-- Execute este script no seu MySQL
CREATE DATABASE IF NOT EXISTS cadastro_veiculos;
-- ... (resto do script fornecido)
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=cadastro_veiculos

# Configurações do Firebase (obtidas do console Firebase)
FIREBASE_PROJECT_ID="seu-project-id"
FIREBASE_PRIVATE_KEY_ID="sua-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nsua-private-key-aqui\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="seu-client-id"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_AUTH_PROVIDER_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40seu-project.iam.gserviceaccount.com"

# CORS 
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 4. Inicie o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   ├── database.js          # Configuração MySQL
│   └── firebase.js          # Configuração Firebase Admin
├── controllers/
│   ├── userController.js    # Controlador de usuários
│   └── vehicleController.js # Controlador de veículos
├── middleware/
│   └── auth.js              # Middleware de autenticação
├── routes/
│   ├── index.js             # Rotas principais
│   ├── userRoutes.js        # Rotas de usuários
│   └── vehicleRoutes.js     # Rotas de veículos
├── services/
│   ├── userService.js       # Serviços de usuário
│   └── vehicleService.js    # Serviços de veículo
├── .env                     # Variáveis de ambiente
├── .gitignore
├── package.json
├── README.md
└── server.js                # Servidor principal
```

## 🔐 Autenticação

Todas as rotas da API estão protegidas por middleware de autenticação Firebase. Para acessar qualquer endpoint:

1. O usuário deve fazer login via Firebase Authentication no frontend
2. Enviar o token JWT no header da requisição: `Authorization: Bearer <token>`
3. O backend verifica o token e extrai as informações do usuário

## 🛣️ Rotas da API

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/users/profile` | Obter perfil do usuário logado |
| PUT | `/api/users/profile` | Atualizar perfil do usuário |

### Veículos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/vehicles` | Listar veículos do usuário + estatísticas |
| POST | `/api/vehicles` | Cadastrar novo veículo |
| GET | `/api/vehicles/:id` | Obter veículo específico |
| PUT | `/api/vehicles/:id` | Atualizar veículo |
| DELETE | `/api/vehicles/:id` | Remover veículo |

### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Status da API |

## 📝 Exemplos de Uso

### 1. Obter perfil do usuário

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer "
```

### 2. Cadastrar veículo

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer " \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "carro",
    "marca": "Toyota",
    "modelo": "Corolla",
    "ano": 2020,
    "cor": "Branco",
    "placa": "ABC1234",
    "valor": 85000.00,
    "observacoes": "Veículo seminovo"
  }'
```

### 3. Listar veículos

```bash
curl -X GET http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer "
```

## 📊 Estrutura do Banco de Dados

### Tabela `usuarios`
- `id` - Chave primária
- `firebase_uid` - UID único do Firebase
- `email` - Email do usuário
- `nome` - Nome do usuário
- `foto_url` - URL da foto do perfil
- `data_criacao` - Data de criação
- `data_atualizacao` - Data da última atualização
- `ativo` - Status do usuário

### Tabela `veiculos`
- `id` - Chave primária
- `usuario_id` - Referência ao usuário
- `tipo` - Tipo do veículo (carro/moto)
- `marca` - Marca do veículo
- `modelo` - Modelo do veículo
- `ano` - Ano de fabricação
- `cor` - Cor do veículo
- `placa` - Placa (única)
- `chassi` - Número do chassi
- `renavam` - Código RENAVAM
- `valor` - Valor do veículo
- `observacoes` - Observações adicionais
- `data_criacao` - Data de criação
- `data_atualizacao` - Data da última atualização
- `ativo` - Status do veículo

## 🔒 Segurança

- **Rate Limiting**: Limite de 100 requisições por IP a cada 15 minutos
- **CORS**: Configurado para aceitar apenas origens permitidas
- **Helmet**: Headers de segurança configurados
- **Autenticação JWT**: Todas as rotas protegidas por Firebase Auth
- **Validação de dados**: Validação básica nos controllers
- **SQL Injection**: Proteção via prepared statements

## 🔧 Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative Authentication e configure login com Google
4. Vá em "Configurações do projeto" > "Contas de serviço"
5. Gere uma nova chave privada para Firebase Admin SDK
6. Use os dados da chave no arquivo `.env`

## 📈 Monitoramento

### Health Check
Acesse `GET /status` para verificar se a API está funcionando:

```json
{
  "success": true,
  "message": "API de veículos funcionando corretamente!",
  "timestamp": "2025-06-14T22:09:13.796Z",
  "version": "1.0.0"
}
```

### Logs
- Logs de conexão com MySQL
- Logs de inicialização do Firebase
- Logs de erro em produção (sem stack trace)
- Logs detalhados em desenvolvimento

## 🚀 Deploy

### Variáveis de ambiente de produção
```env
NODE_ENV=production
PORT=80
# ... outras variáveis
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ❓ FAQ

### Como adicionar novos campos aos veículos?
1. Adicione o campo na tabela MySQL
2. Atualize o service `vehicleService.js`
3. Atualize o controller `vehicleController.js`

### Como implementar paginação?
Modifique o método `getVehiclesByUser` no `vehicleService.js` para aceitar parâmetros de paginação.

### Problemas de conexão com MySQL?
Verifique se:
- MySQL está rodando
- Credenciais no `.env` estão corretas
- Banco de dados foi criado
- Usuário tem permissões adequadas